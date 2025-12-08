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
    functions = getFunctions(app);
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

  try {
    // Try common extension function names
    // Adjust function name based on your extension configuration
    const createCheckoutSessionFn = httpsCallable(functions, 'ext-firestore-stripe-payments-createCheckoutSession');
    
    const result = await createCheckoutSessionFn({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      mode: 'payment',
      successUrl: successUrl || window.location.origin + '/payment-success',
      cancelUrl: cancelUrl || window.location.origin + '/payment-cancel',
      customer: user.uid, // Link payment to Firebase user
    });

    return result.data;
  } catch (error: any) {
    // If that function doesn't exist, try alternative names
    if (error?.code === 'not-found' || error?.message?.includes('not found')) {
      // Try alternative function names that extensions might use
      const alternatives = [
        'createCheckoutSession',
        'stripeCreateCheckoutSession',
        'createPaymentSession'
      ];

      for (const fnName of alternatives) {
        try {
          const fn = httpsCallable(functions, fnName);
          const result = await fn({
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            successUrl: successUrl || window.location.origin,
            cancelUrl: cancelUrl || window.location.origin,
          });
          return result.data;
        } catch (altError) {
          continue;
        }
      }
    }
    
    throw new Error(
      `Payment function not found. Please verify the Stripe extension is installed and the function name is correct. Error: ${error?.message || 'Unknown error'}`
    );
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



