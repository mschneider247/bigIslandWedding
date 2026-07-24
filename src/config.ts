// Configuration file for the Big Island Wedding Map App

// Helper function to ensure URLs use HTTPS
const ensureHttps = (url: string): string => {
  if (!url) return url;
  // If URL starts with http://, replace with https://
  return url.replace(/^http:\/\//i, 'https://');
};

// Cache-busting version - increment this when you update images
const IMAGE_VERSION = '10';

// Helper function to add cache-busting to image URLs
export const withCacheBust = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${IMAGE_VERSION}`;
};

// Pinpoints on map.jpg (as % of image width/height) for the day-of locations.
export const weddingLocations = [
  {
    id: 'ceremony',
    label: 'Ceremony',
    time: '10 - 11 AM',
    x: 77.3,
    y: 41.7,
    color: '#ffb627',
  },
  {
    id: 'reception',
    label: 'Reception',
    time: '11 AM - 5 PM',
    x: 74.4,
    y: 42.0,
    color: '#ff4d8d',
  },
  {
    id: 'honeymoon',
    label: 'Honeymoon',
    time: 'Sept 15 - 16',
    x: 40.2,
    y: 26.5,
    color: '#2dd4bf',
  },
];

export const config = {
  // Map settings
  mapImage: withCacheBust('/map.jpg'), // Place your map image in the public folder

  // Label content
  mapTitle: "Join us for our wedding!",
  mapDescription: 'Adventure and romance await!',

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
