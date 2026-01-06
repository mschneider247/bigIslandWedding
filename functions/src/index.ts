import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as express from 'express';
import Stripe from 'stripe';

// Define the Stripe webhook secret as a secret parameter
// This will be set in Firebase Functions secrets
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

// Define the Stripe secret key (should already exist from the extension)
const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');

// Create Express app for handling webhooks
const app = express();

// Middleware to capture raw body for Stripe webhook signature verification
// This MUST be before any JSON parsing middleware
// Use express.raw() to capture the raw body as a Buffer
app.use(express.raw({ type: 'application/json' }));

/**
 * Stripe webhook handler that delays redirect by waiting 10 seconds
 * before responding to checkout.session.completed events.
 * 
 * This function listens for checkout.session.completed events and waits
 * 10 seconds before returning a 200 OK response, which delays Stripe's
 * redirect to the success URL.
 */
app.post('/', async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = stripeWebhookSecret.value();

  if (!signature || !webhookSecret) {
    console.error('Missing Stripe signature or webhook secret');
    res.status(400).send('Missing Stripe signature or webhook secret');
    return;
  }

  const secretKey = stripeSecretKey.value();
  if (!secretKey) {
    console.error('Missing Stripe secret key');
    res.status(500).send('Server configuration error');
    return;
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  });

  // Get raw body for webhook signature verification
  const rawBody = req.body as Buffer;

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('Checkout session completed:', session.id);
    console.log('Customer:', session.customer);
    console.log('Amount total:', session.amount_total);
    console.log('Delaying redirect for 10 seconds...');

    // Wait 10 seconds before responding
    // This will keep the user on Stripe's success page for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));

    console.log('Webhook delay complete, returning 200 OK');
    
    // Return 200 OK after the delay
    // Stripe will now redirect the user to the success URL
    res.status(200).json({ received: true, sessionId: session.id });
    return;
  }

  // For other event types, respond immediately
  console.log(`Unhandled event type: ${event.type}`);
  res.status(200).json({ received: true, eventType: event.type });
});

export const stripeWebhook = onRequest(
  {
    // Maximum timeout for the function (14 seconds is the max for 2nd gen functions)
    timeoutSeconds: 14,
    // Memory allocation
    memory: '256MiB',
    // Secrets that need to be accessed
    secrets: [stripeWebhookSecret, stripeSecretKey],
  },
  app
);

