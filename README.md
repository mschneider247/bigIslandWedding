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

### 3. Configure Environment Variables

**IMPORTANT**: Sensitive information (survey URL, Venmo URL, mailing address) must be stored in environment variables for security.

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```env
   # Survey URL
   VITE_SURVEY_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform
   
   # Payment Settings
   VITE_VENMO_URL=https://venmo.com/your-username
   VITE_CHECK_MAILING_ADDRESS=Please send checks to:\nYour Name\nYour Address\nCity, State ZIP
   ```

   **Note**: Use `\n` for line breaks in the mailing address.

3. Edit `src/config.ts` for non-sensitive settings:
   - **Map Image**: Path to your map image (default: `/map.jpg`)
   - **Map Title**: The title displayed in the floating label
   - **Map Description**: Description text for the floating label

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

Add Firebase configuration to your `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

The Firebase configuration is already set up in `src/config.ts` to read from these environment variables.

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

## Security & Privacy

**IMPORTANT**: This application stores sensitive information in environment variables:

- **Survey URLs** - May contain identifiable form IDs
- **Venmo URLs** - Contains personal payment profile information
- **Mailing Addresses** - Contains full personal addresses including names

All sensitive data has been moved to environment variables (`.env` file) which is gitignored and will not be committed to version control. 

**Before deploying or sharing your repository:**
1. Ensure `.env` is in `.gitignore` (already configured)
2. Never commit `.env` files to version control
3. Use `env.example` as a template for other developers
4. Set environment variables in your hosting platform (Firebase, Vercel, etc.) for production

## Customization

### Environment Variables (`.env` file)
- Survey URL (`VITE_SURVEY_URL`)
- Venmo URL (`VITE_VENMO_URL`)
- Mailing address (`VITE_CHECK_MAILING_ADDRESS`)
- Firebase configuration

### Configuration File (`src/config.ts`)
- Map image path
- Map title and description

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
