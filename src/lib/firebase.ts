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
import { getFirestore, collection, doc, addDoc, onSnapshot, type Firestore } from 'firebase/firestore';
import { config } from '../config';

// Re-export User type for convenience
export type { User };

let app: FirebaseApp | null = null;
let functions: Functions | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

// Initialize Firebase
export const initializeFirebase = () => {
  if (app) return { app, functions, auth, firestore };

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
    auth = getAuth(app);
    firestore = getFirestore(app);
  }

  return { app, functions, auth, firestore };
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

// Get Firestore instance
export const getFirestoreInstance = (): Firestore => {
  if (!firestore) {
    initializeFirebase();
    if (!firestore) {
      throw new Error('Firestore is not initialized. Please check your Firebase configuration.');
    }
  }
  return firestore;
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

// Payment processing using Invertase Firestore Stripe Payments extension
// The extension works by creating a Firestore document in /customers/{userId}/checkout_sessions
// The extension automatically processes the document and adds a 'url' field when ready
export const createCheckoutSession = async (
  amount: number, 
  currency: string = 'USD',
  successUrl?: string,
  cancelUrl?: string
): Promise<{ url: string }> => {
  const db = getFirestoreInstance();
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User must be authenticated to process payments');
  }

  // Ensure URLs have default values if not provided
  const defaultSuccessUrl = successUrl || window.location.origin + '/payment-success';
  const defaultCancelUrl = cancelUrl || window.location.origin + '/payment-cancel';

  // Create a document in the checkout_sessions subcollection
  // The extension will watch for new documents and create the Stripe checkout session
  const checkoutSessionsRef = collection(db, `customers/${user.uid}/checkout_sessions`);
  
  // Create the document with checkout session data
  const sessionData: any = {
    mode: 'payment',
    success_url: defaultSuccessUrl,
    cancel_url: defaultCancelUrl,
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
  };

  console.log('Creating Firestore document for checkout session:', sessionData);
  const docRef = await addDoc(checkoutSessionsRef, sessionData);
  console.log('Document created with ID:', docRef.id);

  // Return a promise that resolves when the extension adds the URL to the document
  return new Promise((resolve, reject) => {
    // Listen for changes to the document
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();
      
      if (data?.error) {
        unsubscribe();
        console.error('Checkout session error:', data.error);
        reject(new Error(data.error.message || 'Failed to create checkout session'));
        return;
      }
      
      if (data?.url) {
        unsubscribe();
        console.log('Checkout session URL received:', data.url);
        resolve({ url: data.url });
        return;
      }
      
      // Document created but URL not yet available - extension is still processing
      console.log('Waiting for checkout session URL...', data);
    }, (error) => {
      unsubscribe();
      console.error('Firestore snapshot error:', error);
      reject(new Error(`Failed to create checkout session: ${error.message}`));
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      unsubscribe();
      reject(new Error('Checkout session creation timed out. Please try again.'));
    }, 30000);
  });
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


