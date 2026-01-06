# Stripe Webhook Setup Guide

This guide will help you set up the Stripe webhook to delay redirects by 10 seconds after successful checkout.

## Overview

The webhook handler delays the redirect from Stripe's checkout success page by waiting 10 seconds before responding to the `checkout.session.completed` event. This keeps users on Stripe's success page for the full 10 seconds before redirecting them back to your app.

## Prerequisites

- Firebase project with Functions enabled
- Stripe account with API keys configured
- Firebase CLI installed and configured
- Node.js 18+ installed

## Step 1: Install Dependencies

Navigate to the functions directory and install dependencies:

```bash
cd functions
npm install
cd ..
```

## Step 2: Set Up Firebase Functions Secrets

You need to set two secrets for the webhook function:

1. **STRIPE_WEBHOOK_SECRET** - Your Stripe webhook signing secret (you'll get this in Step 4)
2. **STRIPE_SECRET_KEY** - Your Stripe secret key (should already exist from the Stripe extension)

### Set the secrets:

```bash
# Set the Stripe secret key (if not already set by the extension)
firebase functions:secrets:set STRIPE_SECRET_KEY

# You'll be prompted to enter the secret key value
# Get this from: https://dashboard.stripe.com/apikeys

# Set the webhook secret (we'll do this after creating the webhook endpoint in Step 4)
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

## Step 3: Deploy the Function

Build and deploy the function:

```bash
# From the project root
npm run deploy:functions

# Or manually:
cd functions
npm run build
cd ..
firebase deploy --only functions
```

After deployment, note the function URL. It will look like:
```
https://<region>-<project-id>.cloudfunctions.net/stripeWebhook
```

## Step 4: Create Webhook Endpoint in Stripe

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"** or **"Add webhook"**
3. Enter your function URL:
   ```
   https://<region>-<project-id>.cloudfunctions.net/stripeWebhook
   ```
4. Select the event to listen for:
   - **`checkout.session.completed`**
5. Click **"Add endpoint"**
6. After creating the endpoint, click on it to view details
7. Click **"Reveal"** next to **"Signing secret"**
8. Copy the signing secret (it starts with `whsec_...`)

## Step 5: Set the Webhook Secret

Now set the webhook secret in Firebase Functions:

```bash
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

When prompted, paste the signing secret you copied from Stripe (starts with `whsec_...`).

## Step 6: Redeploy the Function

After setting the secret, redeploy the function so it can access the secret:

```bash
npm run deploy:functions
```

## Step 7: Test the Webhook

1. Make a test payment using a Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

2. After successful payment, you should see:
   - Stripe's success page for 10 seconds
   - Then automatic redirect to your success URL

3. Check the Firebase Functions logs:
   ```bash
   firebase functions:log --only stripeWebhook
   ```

   You should see:
   ```
   Checkout session completed: cs_...
   Delaying redirect for 10 seconds...
   Webhook delay complete, returning 200 OK
   ```

## Troubleshooting

### Webhook not receiving events

- Verify the webhook endpoint URL in Stripe Dashboard matches your deployed function URL
- Check that the endpoint is enabled in Stripe Dashboard
- Verify the event type `checkout.session.completed` is selected

### Signature verification failed

- Ensure `STRIPE_WEBHOOK_SECRET` secret is set correctly
- The secret should start with `whsec_...`
- Make sure you're using the signing secret from the correct webhook endpoint

### Function timeout errors

- The function is configured with a 14-second timeout (max for 2nd gen functions)
- The delay is set to 10 seconds, which should be within the timeout limit
- If you see timeout errors, check Firebase Functions logs for details

### Secret not found

- Make sure you've set both secrets:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Redeploy the function after setting secrets
- Verify secrets are set: `firebase functions:secrets:access STRIPE_WEBHOOK_SECRET`

## Viewing Logs

To view function logs:

```bash
# View all logs
firebase functions:log

# View only webhook logs
firebase functions:log --only stripeWebhook

# Follow logs in real-time
firebase functions:log --only stripeWebhook --follow
```

## Environment-Specific Setup

### Test Mode vs Live Mode

- Create separate webhook endpoints for test mode and live mode in Stripe
- Use different signing secrets for each
- You may want to use different function URLs or handle both in the same function

### Switching Between Test and Live

When switching between test and live mode:

1. Create a new webhook endpoint in Stripe for the new mode
2. Update the `STRIPE_WEBHOOK_SECRET` secret with the new signing secret
3. Redeploy the function

## Important Notes

- The webhook handler only delays `checkout.session.completed` events
- Other event types will receive immediate responses
- The maximum delay is 10 seconds (Stripe waits up to 10 seconds for webhook responses)
- The function timeout is set to 14 seconds to ensure it completes within the limit
- Make sure your Stripe extension's webhook handling doesn't conflict with this function

