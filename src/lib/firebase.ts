// Firebase configuration and initialization
// This file will be set up when Firebase project is created

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  type Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { getFunctions, type Functions, httpsCallable } from 'firebase/functions';
import { config } from '../config';

// Re-export User type for convenience
export type { User };

let app: FirebaseApp | null = null;
let functions: Functions | null = null;
let auth: Auth | null = null;

// Initialize Firebase
export const initializeFirebase = () => {
  if (app) return { app, functions, auth };

  const firebaseConfig = {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    projectId: config.firebase.projectId,
    // Add other config as needed
  };

  // Only initialize if we have the required config
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    // Initialize Functions with explicit region (us-central1 is default for extensions)
    functions = getFunctions(app, 'us-central1');
    
    // Use emulator for local development if needed (uncomment if using emulator)
    // if (import.meta.env.DEV) {
    //   connectFunctionsEmulator(functions, 'localhost', 5001);
    // }
    
    auth = getAuth(app);
  }

  return { app, functions, auth };
};

// Get Firebase app instance
export const getFirebaseApp = () => {
  if (!app) {
    initializeFirebase();
  }
  return app;
};

// Get Firebase Functions instance
export const getFirebaseFunctions = (): Functions => {
  if (!functions) {
    initializeFirebase();
    if (!functions) {
      throw new Error('Firebase Functions is not initialized. Please check your Firebase configuration.');
    }
  }
  return functions;
};

// Get Firebase Auth instance
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    initializeFirebase();
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
    }
  }
  return auth;
};

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const auth = getFirebaseAuth();
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string) => {
  const auth = getFirebaseAuth();
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  const auth = getFirebaseAuth();
  return await signOut(auth);
};

export const getCurrentUser = (): User | null => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

// Payment processing function using Stripe extension
// The "Run Payments with Stripe" extension typically provides functions like:
// - createCheckoutSession
// - createPaymentIntent
export const createCheckoutSession = async (
  amount: number, 
  currency: string = 'USD',
  successUrl?: string,
  cancelUrl?: string
) => {
  const functions = getFirebaseFunctions();
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User must be authenticated to process payments');
  }

  // Ensure URLs have default values if not provided
  const defaultSuccessUrl = successUrl || window.location.origin + '/payment-success';
  const defaultCancelUrl = cancelUrl || window.location.origin + '/payment-cancel';

  // The Invertase extension function name
  const functionName = 'ext-firestore-stripe-payments-createCheckoutSession';

  try {
    console.log(`Calling function: ${functionName}`);
    const fn = httpsCallable(functions, functionName);
    
    // Invertase extension expects:
    // - line_items array with price_data (for custom amounts)
    // - OR price ID (if using predefined Stripe prices)
    // - success_url and cancel_url (snake_case, not camelCase)
    // - mode: 'payment' for one-time payments
    // - client_reference_id: user ID to link to Firebase user
    
    const params = {
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Wedding Gift',
              description: 'Wedding gift payment',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: defaultSuccessUrl,
      cancel_url: defaultCancelUrl,
      client_reference_id: user.uid, // Link to Firebase user
    };

    console.log('Calling with params:', params);
    const result = await fn(params);
    console.log('Success! Result:', result.data);
    return result.data;
  } catch (error: any) {
    console.error('Payment function error:', error);
    
    // Try alternative: if price_data doesn't work, try with amount parameter
    try {
      console.log('Trying alternative parameter format with amount...');
      const fn = httpsCallable(functions, functionName);
      const altParams = {
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        mode: 'payment',
        success_url: defaultSuccessUrl,
        cancel_url: defaultCancelUrl,
        client_reference_id: user.uid,
      };
      
      const result = await fn(altParams);
      console.log('Success with alternative format!', result.data);
      return result.data;
    } catch (altError: any) {
      console.error('Alternative format also failed:', altError);
      throw new Error(
        `Payment function failed. Error: ${error?.code || 'unknown'} - ${error?.message || 'Unknown error'}. ` +
        `Extension expects line_items with price_data or a Stripe Price ID. ` +
        `Check browser console for detailed error information.`
      );
    }
  }
};

// Legacy payment function (updated to use Stripe)
export const processPayment = async (amount: number, currency: string = 'USD') => {
  const session = await createCheckoutSession(amount, currency);
  
  // If the session contains a URL, redirect to it (Stripe Checkout)
  if (session && typeof session === 'object' && 'url' in session) {
    window.location.href = (session as { url: string }).url;
    return session;
  }
  
  // If it's a payment intent client secret, handle differently
  if (session && typeof session === 'object' && 'clientSecret' in session) {
    return session;
  }
  
  return session;
};


