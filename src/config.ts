// Configuration file for the Big Island Wedding Map App

// Helper function to ensure URLs use HTTPS
const ensureHttps = (url: string): string => {
  if (!url) return url;
  // If URL starts with http://, replace with https://
  return url.replace(/^http:\/\//i, 'https://');
};

export const config = {
  // Map settings
  mapImage: '/map.jpg', // Place your map image in the public folder
  
  // Label content
  mapTitle: "Join us for our wedding!",
  mapDescription: 'Adventure and romance await!',
  
  // Survey URL - replace with your actual survey link
  // Automatically converts HTTP to HTTPS to prevent mixed content warnings
  surveyUrl: ensureHttps(import.meta.env.VITE_SURVEY_URL || ''),
  
  // Payment settings
  // Automatically converts HTTP to HTTPS to prevent mixed content warnings
  venmoUrl: ensureHttps(import.meta.env.VITE_VENMO_URL || ''), // Replace with your Venmo profile URL
  checkMailingAddress: import.meta.env.VITE_CHECK_MAILING_ADDRESS || '',
  
  // Firebase configuration (will be set up separately)
  firebase: {
    // These will be added when Firebase is configured
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    // authDomain should be just the domain (no protocol) - Firebase SDK handles HTTPS automatically
    authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').replace(/^https?:\/\//, ''),
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    // Add other Firebase config as needed
  },
};
