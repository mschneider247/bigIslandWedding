# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

This will install:
- React 19
- TypeScript
- Vite
- Firebase SDK (for payments)

## 2. Add Your Map Image

1. Place your map image in the `public` folder
2. Name it `map.jpg` (or update `src/config.ts` with your filename)
3. Supported formats: JPG, PNG, WebP

## 3. Configure App Settings

Edit `src/config.ts` and update:

- `mapImage`: Path to your map image
- `mapTitle`: Title shown in the floating label
- `mapDescription`: Description text
- `surveyUrl`: Link to your survey form
- `venmoUrl`: Your Venmo profile URL
- `checkMailingAddress`: Address for check payments

Example:
```typescript
export const config = {
  mapImage: '/my-map.jpg',
  mapTitle: 'Wedding Venue Map',
  mapDescription: 'Explore our wedding locations...',
  surveyUrl: 'https://forms.google.com/your-form',
  venmoUrl: 'https://venmo.com/yourusername',
  checkMailingAddress: 'Your Name\n123 Main St\nCity, State ZIP',
};
```

## 4. Set Up Firebase (Optional - for payments)

1. Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

2. Set up Firebase payment processing:
   - Option A: Install "Accept Stripe Payments" extension in Firebase Console
   - Option B: Set up Firebase Functions with Stripe integration
   - See README.md for detailed instructions

## 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 6. Build for Production

```bash
npm run build
```

## 7. Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

## Next Steps

- Add your map image to the `public` folder
- Update `src/config.ts` with your content
- Test the app locally
- Set up Firebase if you want payment processing
- Deploy when ready!

