// Configuration file for the Big Island Wedding Map App

export const config = {
  // Map settings
  mapImage: '/map.jpg', // Place your map image in the public folder
  
  // Label content
  mapTitle: "Aloha Hawai'i",
  mapDescription: 'Adventure and romance await!',
  
  // Survey URL - replace with your actual survey link
  surveyUrl: import.meta.env.VITE_SURVEY_URL || '',
  
  // Payment settings
  venmoUrl: import.meta.env.VITE_VENMO_URL || '', // Replace with your Venmo profile URL
  checkMailingAddress: import.meta.env.VITE_CHECK_MAILING_ADDRESS || '',
  
  // Firebase configuration (will be set up separately)
  firebase: {
    // These will be added when Firebase is configured
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    // Add other Firebase config as needed
  },
};
