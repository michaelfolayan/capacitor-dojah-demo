# Capacitor + Next.js Dojah KYC Demo

A demo project showing how to integrate Dojah KYC SDK with a Next.js app wrapped in Capacitor for iOS/Android mobile deployment.

## Prerequisites

- Node.js 18+
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS) # install using `brew install cocoapods`

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

6. **Add the necessary permissions for the camera:**

   For iOS (in Info.plist):

   ```xml
   <key>NSCameraUsageDescription</key>
   <string>Allow Dojah to access your camera for KYC.</string>
   ```

   For Android (in AndroidManifest.xml):

   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   ```

7. **Sync web assets to native projects:**

   ```bash
   npx cap sync
   ```

8. **Open native project:**

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



```bash
npm run build
npx cap sync
npx cap open ios   # rebuild and run from Xcode
```

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

**iOS camera freezes during liveness check:**

iOS WKWebView strictly enforces the [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy) on cross-origin iframes. The Dojah SDK renders its liveness UI inside an iframe, and without explicit `allow="camera; microphone"` attributes, `getUserMedia()` silently fails or the camera stream freezes. The `DojahSdk` component includes a `MutationObserver` that automatically patches these attributes onto the Dojah iframe as soon as it appears in the DOM.

If the camera still freezes:

1. Ensure `NSCameraUsageDescription` is set in `ios/App/App/Info.plist` (see step 6 above).
2. Run `npx cap sync` after any config change to propagate updates to the native project.
3. Do **not** set `WKAppBoundDomains` in your `Info.plist` unless you include the Dojah domains — this restricts which domains the WKWebView can load.
4. Verify that `capacitor.config.ts` includes `server.allowNavigation` entries for `*.dojah.io` and `*.dojah.services`.

**Dojah SDK not loading:**

- Verify your credentials in `.env.local`
- Check the Dojah dashboard for widget configuration

---




## iOS Liveness Camera Fix

### Problem

The liveness challenge camera stream works correctly on Android but **freezes on iOS** when running the app as a native Capacitor build.

### Root Cause

The Dojah KYC React SDK (`dojah-kyc-sdk-react`) renders its liveness UI inside a **cross-origin iframe** that calls `getUserMedia()` to access the device camera. iOS WKWebView and Android WebView handle this differently:

- **Android WebView** is permissive — it grants `getUserMedia()` access to cross-origin iframes without requiring an explicit `allow` attribute on the `<iframe>` element.
- **iOS WKWebView** strictly enforces the [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy). Without an explicit `allow="camera; microphone"` attribute on the iframe, `getUserMedia()` either silently fails or the video stream **freezes** after the first frame.

Since the Dojah React SDK creates and manages the iframe internally, the host application has no direct control over the iframe's attributes at creation time.

A secondary issue was that the original Capacitor configuration had no `allowNavigation` entries for Dojah's domains, meaning WKWebView could block or degrade iframe navigation to `*.dojah.io` / `*.dojah.services`.

### What Was Fixed

**1. Iframe Permissions Policy patching (`components/DojahSdk.tsx`)**

A `MutationObserver` watches the DOM for the Dojah iframe and patches it the instant it is inserted — before its content loads and before `getUserMedia()` is called. The following attributes are added:

```
allow="camera; microphone; fullscreen; autoplay; display-capture; encrypted-media"
allowfullscreen="true"
```

This replaced the previous approach which used a polling loop (800ms delay + up to 20 retries at 1-second intervals) that was slow to react and had a cleanup leak where the async loop could continue running after the component unmounted.

**2. Capacitor configuration (`capacitor.config.ts`)**

- Added `server.allowNavigation` for `*.dojah.io` and `*.dojah.services` so WKWebView permits iframe navigation to Dojah's domains.
- Added `ios.preferredContentMode: "mobile"` to ensure a mobile viewport.
- Added `ios.limitsNavigationsToAppBoundDomains: false` to prevent iOS 14+ from restricting WebView navigation to app-bound domains.

**3. iOS notch/Dynamic Island layout**

The margin adjustment for the iframe (to avoid the notch/Dynamic Island) is now handled by the same `MutationObserver` and only applied when `Capacitor.getPlatform() === "ios"`, rather than unconditionally.


For more details on Capacitor, including plugin usage, native features, and deployment, check out the official documentation:

https://capacitorjs.com/docs
