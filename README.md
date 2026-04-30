# Capacitor + Next.js Dojah KYC Demo

A demo project showing how to integrate Dojah KYC SDK with a Next.js app wrapped in Capacitor for iOS/Android mobile deployment.

## Prerequisites

- Node.js 18+
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

## Quick Start

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Dojah credentials:**

   Copy `.env.local.example` to `.env.local` and add your Dojah credentials:

   ```bash
   cp .env.local.example .env.local
   ```

   Update the following variables:

   ```
   NEXT_PUBLIC_DOJAH_APP_ID=your_app_id
   NEXT_PUBLIC_DOJAH_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_DOJAH_WIDGET_ID=your_widget_id
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 to test in browser.

4. **Build for mobile:**

   ```bash
   npm run build
   ```

5. **Add native platforms (first time only):**

   For iOS:

   ```bash
   npx cap add ios
   ```

   For Android:

   ```bash
   npx cap add android
   ```

   For both platforms, run both commands.

6. **Sync web assets to native projects:**

   ```bash
   npx cap sync
   ```

7. **Open native project:**

   For iOS:

   ```bash
   npx cap open ios
   ```

   For Android:

   ```bash
   npx cap open android
   ```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── page.tsx            # Main demo page with Dojah launch
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   └── DojahSdk.tsx        # Dojah KYC SDK wrapper
├── ios/                    # Native iOS project
├── android/                # Native Android project
├── capacitor.config.ts     # Capacitor configuration
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
└── .env.local.example      # Environment template
```

## Key Scripts

| Command                | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start Next.js dev server               |
| `npm run build`        | Build Next.js for production           |
| `npx cap add ios`      | Add iOS platform (first time only)     |
| `npx cap add android`  | Add Android platform (first time only) |
| `npx cap sync`         | Sync web assets to native projects     |
| `npx cap open ios`     | Open iOS project in Xcode              |
| `npx cap open android` | Open Android project in Android Studio |

## How It Works

1. **DojahSdk Component** (`components/DojahSdk.tsx`):
   - Wraps the `dojah-kyc-sdk-react` package
   - Accepts user data and callback handlers
   - Renders the Dojah KYC iframe in the app
   - Handles success, error, and close events

2. **Main Page** (`app/page.tsx`):
   - Displays demo user information
   - Provides "Launch Dojah KYC" button
   - Shows status messages based on KYC results

3. **Capacitor Integration**:
   - Next.js builds to static export (`out/` directory)
   - Capacitor syncs web assets to native projects
   - WebView loads the Next.js app with full native capabilities

## Environment Variables

| Variable                       | Description           |
| ------------------------------ | --------------------- |
| `NEXT_PUBLIC_DOJAH_APP_ID`     | Your Dojah App ID     |
| `NEXT_PUBLIC_DOJAH_PUBLIC_KEY` | Your Dojah Public Key |
| `NEXT_PUBLIC_DOJAH_WIDGET_ID`  | Your Dojah Widget ID  |

## Troubleshooting

**Platform not added error:**

If you get an error like "ios platform not found" or "android platform not found", you need to add the platform first:

```bash
# For iOS
npx cap add ios

# For Android
npx cap add android
```

Then sync:

```bash
npx cap sync
```

**iOS build issues:**

- Ensure you have CocoaPods installed: `sudo gem install cocoapods`
- Run `cd ios/App && pod install` if needed

**Android build issues:**

- Ensure Android SDK is configured in Android Studio

**Dojah SDK not loading:**

- Verify your credentials in `.env.local`
- Check the Dojah dashboard for widget configuration

---

For more details on Capacitor, including plugin usage, native features, and deployment, check out the official documentation:

👉 https://capacitorjs.com/docs
