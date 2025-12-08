# Stripe Payment Testing Guide

## 1. Finding Users in Firebase

Firebase Authentication users are **NOT** stored in Firestore. They're in a separate Authentication database:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `bigislandwedding-bf40e`
3. Click **Authentication** in the left sidebar
4. Click the **Users** tab
5. You should see all registered users here with their email addresses

**Note:** If you don't see the Authentication section, you need to enable it first:
- Click "Get Started" if you see a prompt
- Select "Email/Password" as an authentication method
- Enable it and save

## 2. Verify Stripe Extension Setup

### Check Extension Installation:
1. In Firebase Console, go to **Extensions** (left sidebar)
2. Look for "Run Payments with Stripe" or similar Stripe extension
3. Verify it's installed and active

### Check Cloud Functions:
1. Go to **Functions** in Firebase Console
2. Look for function names like:
   - `ext-firestore-stripe-payments-createCheckoutSession`
   - `createCheckoutSession`
   - `stripeCreateCheckoutSession`
   - `ext-stripe-createCheckoutSession`
3. Make sure they're deployed (Status: Deployed)
4. **Copy the EXACT function name** - it might be different based on your extension configuration
5. Update `src/lib/firebase.ts` line 125 with the correct function name

### Verify Stripe Configuration:
1. In Firebase Console → **Functions** → **Configuration**
2. Check for Stripe-related environment variables/secrets:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - Or any secrets configured during extension setup

## 3. Testing the Payment Flow

### Step 1: Create/Login with Test Account
1. Open your app in the browser
2. Click "Gift" button
3. Click "Sign in for Credit Card Payment"
4. Create a test account (e.g., `test@example.com` / `password123`)
5. After login, the payment modal should reopen

### Step 2: Test Payment
1. In the payment modal, enter an amount (e.g., `10.00`)
2. Click "Pay with Card"
3. You should be redirected to Stripe Checkout

### Step 3: Use Stripe Test Cards

In Stripe Checkout, use these test card numbers:

**Successful Payment:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment (to test errors):**
- Card Number: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Requires Authentication (3D Secure):**
- Card Number: `4000 0027 6000 3184`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## 4. Common Issues & Solutions

### Issue: "Payment function not found"
**Solution:**
- Check Firebase Functions are deployed
- Verify the function name matches your extension's actual function name
- Open browser console and check the exact error message
- Update the function name in `src/lib/firebase.ts` line 125 if needed

### Issue: Redirect URLs not working
**Solution:**
- The app redirects to `/payment-success` and `/payment-cancel` after payment
- These routes might not exist in your SPA - Stripe will redirect back but you may need to handle routing
- Check browser console for any redirect errors

### Issue: Users not appearing
**Solution:**
- Make sure Authentication is enabled in Firebase Console
- Check you're looking in **Authentication → Users**, not Firestore
- Try creating a new test user to verify it appears

## 5. Testing Checklist

- [ ] Firebase Authentication enabled with Email/Password
- [ ] Can create new user account
- [ ] Can login with existing account
- [ ] User appears in Firebase Console → Authentication → Users
- [ ] Stripe extension installed and active
- [ ] Cloud Functions deployed
- [ ] Can click "Pay with Card" after login
- [ ] Redirected to Stripe Checkout
- [ ] Can complete payment with test card `4242 4242 4242 4242`
- [ ] Payment appears in Stripe Dashboard (test mode)

## 6. Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
2. Make sure you're in **Test mode** (toggle in top right)
3. Check **Payments** section to see test transactions
4. Check **Customers** section to see created customers (linked to Firebase users)

## 7. Debug Mode

To see what's happening, open browser console (F12) and check:
- Any error messages when clicking "Pay with Card"
- Network tab to see function calls
- Console logs from `createCheckoutSession`

If you see function errors, note the exact function name and update `src/lib/firebase.ts` accordingly.
