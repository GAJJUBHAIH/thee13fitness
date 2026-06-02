# Membership & Product Token Management System

This document outlines how to set up and run the newly integrated Token Management System for Three13 Fitness.

## Features
- **Token Generation:** Unique tokens (`MEM-YYYY-XXXXXX`, `PROD-YYYY-XXXXXX`) are generated upon purchase.
- **Verification Portal:** Public page at `/verify-token` to check validity.
- **Admin Dashboard:** Secure portal at `/admin` to view all tokens and download Excel reports.
- **User Dashboard:** Users can see their purchased memberships/products and download QR codes.
- **Notifications:** Automatic WhatsApp (via Twilio) and Email (via Nodemailer) notifications upon purchase.
- **Reporting:** Daily and Monthly Excel reports generated automatically.

## Prerequisites & Environment Variables

You need to update your backend `.env` file with the following configurations:

```env
# Existing settings
PORT=4000
CLIENT_ORIGIN=http://localhost:5173

# Firebase Admin SDK
# Provide your service account JSON as a Base64 string for secure parsing
# Run: `cat service-account.json | base64` (Linux/Mac) or convert online
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account_json

# Twilio (For WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Nodemailer (For Email)
# Use an App Password if using Gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Running the Application

1. **Install Dependencies:**
   - In `backend/`: `npm install` (Installs new packages: `firebase-admin`, `twilio`, `nodemailer`, `xlsx`, `qrcode`, `uuid`).
   - In `frontend/`: `npm install`
   
2. **Start Backend:**
   - `npm run dev`
   - Ensure the database successfully initializes (check logs for "Firebase Admin initialized successfully").

3. **Start Frontend:**
   - `npm run dev`
   
## Testing the Flow
1. **Purchase:** Go to `/store` -> Add to Cart -> Checkout. Select "Cash On Delivery", click "Pay Now" -> Check "Payment Done" -> "Confirm Order".
2. **Dashboard:** You will be redirected to the Dashboard where your new Token and QR Code will be visible.
3. **Verify:** Copy the Token ID and go to `/verify-token`. Paste the token to verify its validity.
4. **Admin:** Navigate to `/admin` to view all generated tokens and download the `Daily` or `Monthly` Excel reports.
