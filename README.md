# Big Island Wedding Map

An interactive map application built with React, TypeScript, and Vite. This app allows users to explore a wedding venue map with pan and zoom functionality, view information in a floating label, take surveys, and make payments.

## Features

- 🗺️ **Interactive Map**: Pan and zoom functionality for desktop and mobile
- 📍 **Floating Label**: Follows the user cursor (desktop) or fixed position (mobile) with map information
- 📝 **Survey Integration**: Button to link to external survey
- 💳 **Payment Options**: 
  - Firebase/Stripe payment integration
  - Venmo link
  - Check by mail option
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Map Image

Place your map image file in the `public` folder and name it `map.jpg` (or update the path in `src/config.ts`).

Supported formats: JPG, PNG, WebP

### 3. Configure App Settings

Edit `src/config.ts` to customize:

- **Map Image**: Path to your map image (default: `/map.jpg`)
- **Map Title**: The title displayed in the floating label
- **Map Description**: Description text for the floating label
- **Survey URL**: Link to your survey form
- **Venmo URL**: Your Venmo profile URL
- **Mailing Address**: Address for check payments

### 4. Firebase Setup (For Payments)

#### Option A: Using Firebase Extensions (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Install the "Accept Stripe Payments" extension from the Extensions marketplace
4. Follow the extension setup wizard
5. Copy your Firebase config values

#### Option B: Manual Firebase Functions + Stripe

1. Set up Firebase Functions in your project
2. Install Stripe SDK in your Functions
3. Create a payment processing function
4. Update `src/lib/firebase.ts` with your implementation

#### Configure Firebase

1. Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

2. Update `src/config.ts` to use these environment variables (already configured)

3. The Firebase configuration will be automatically loaded from environment variables

### 5. Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### 7. Deploy to Firebase Hosting

1. Install Firebase CLI if you haven't:

```bash
npm install -g firebase-tools
```

2. Login to Firebase:

```bash
firebase login
```

3. Initialize Firebase Hosting (if not already done):

```bash
firebase init hosting
```

4. Deploy:

```bash
firebase deploy --only hosting
```

## Project Structure

```
bigIslandWedding/
├── public/
│   └── map.jpg          # Your map image goes here
├── src/
│   ├── components/
│   │   ├── MapViewer.tsx       # Map pan/zoom component
│   │   ├── MapViewer.css
│   │   ├── FloatingLabel.tsx   # Floating label UI
│   │   ├── FloatingLabel.css
│   │   ├── PaymentMethods.tsx  # Payment modal
│   │   └── PaymentMethods.css
│   ├── lib/
│   │   └── firebase.ts         # Firebase configuration
│   ├── config.ts               # App configuration
│   ├── App.tsx                 # Main app component
│   ├── App.css
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables (create this)
├── package.json
└── README.md
```

## Usage

### Map Navigation

- **Desktop**: 
  - Click and drag to pan
  - Scroll wheel to zoom
- **Mobile**: 
  - Touch and drag to pan
  - Pinch to zoom

### Floating Label

- **Desktop**: Follows your mouse cursor
- **Mobile**: Fixed in bottom-right corner

### Payment Methods

Click the "Payment" button in the floating label to see payment options:
- **Online Payment**: Stripe integration via Firebase (requires setup)
- **Venmo**: Opens your Venmo profile in a new tab
- **Check by Mail**: Displays mailing address

## Customization

All customizable content is in `src/config.ts`. You can modify:
- Map image path
- Title and description
- Survey URL
- Venmo URL
- Mailing address

## Troubleshooting

### Map image not showing
- Ensure the image is in the `public` folder
- Check the path in `src/config.ts` matches your filename
- Verify the image format is supported (JPG, PNG, WebP)

### Firebase payments not working
- Verify your `.env` file has correct Firebase credentials
- Check that Firebase Functions are deployed
- Ensure Stripe integration is properly configured

### Mobile touch not working
- Check that `touch-action` CSS is properly set
- Verify viewport meta tag in `index.html`

## License

Private project - Big Island Wedding
