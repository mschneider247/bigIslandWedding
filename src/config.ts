// Configuration file for the Big Island Wedding Map App

export const config = {
  // Map settings
  mapImage: '/map.jpg', // Place your map image in the public folder
  
  // Label content
  mapTitle: "Aloha Hawai'i",
  mapDescription: 'Adventure and romance await!',
  
  // Survey URL - replace with your actual survey link
  surveyUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScPfJJeOQrvwGyItudisB5ecTxgtzre5_bWo1L_tBfC-EKNgw/viewform',
  
  // Payment settings
  venmoUrl: 'https://venmo.com/witwi_connor-payments', // Replace with your Venmo profile URL
  checkMailingAddress: `Please send checks to:
Connor and Michael
25 East 5th Ave, Apt 409
Denver, CO 80203`,
  
  // Firebase configuration (will be set up separately)
  firebase: {
    // These will be added when Firebase is configured
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    // Add other Firebase config as needed
  },
};

