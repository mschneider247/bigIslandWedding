// Configuration file for the Big Island Wedding Map App

export const config = {
  // Map settings
  mapImage: '/map.jpg', // Place your map image in the public folder
  
  // Label content
  mapTitle: 'Big Island Wedding Map',
  mapDescription: 'Explore our wedding venue and locations. Click the buttons below to take our survey or make a payment.',
  
  // Survey URL - replace with your actual survey link
  surveyUrl: 'https://example.com/survey',
  
  // Payment settings
  venmoUrl: 'https://venmo.com/your-username', // Replace with your Venmo profile URL
  checkMailingAddress: `Please send checks to:
Your Name
Your Address
City, State ZIP`,
  
  // Firebase configuration (will be set up separately)
  firebase: {
    // These will be added when Firebase is configured
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    // Add other Firebase config as needed
  },
};

