# Android App (TWA)

The Android app is a **Trusted Web Activity (TWA)** — a thin native shell that opens:

`https://malaysia-4d.vercel.app`

## Auto-update (no Play Store needed for web changes)

When you deploy a new version of the website to Vercel, the Android app **automatically shows the latest UI and features**. Users do not need to update the APK for normal web changes.

You only need a new Play Store release when changing:

- App icon / splash / package name
- Android permissions or native configuration
- Minimum SDK / target SDK

## Prerequisites

1. **JDK 17+** — `brew install openjdk@17`
2. **Android SDK** — install [Android Studio](https://developer.android.com/studio) or command-line tools
3. Copy SDK path:
   ```bash
   cp android/local.properties.example android/local.properties
   # Edit sdk.dir=...
   ```

## One-time setup

```bash
chmod +x scripts/android-keystore.sh
./scripts/android-keystore.sh
```

This creates `android/release.keystore`, `android/keystore.properties`, and updates `public/.well-known/assetlinks.json` with your signing certificate fingerprint.

Deploy the web app so Digital Asset Links verification works:

```bash
npx vercel deploy --prod
```

Verify:

https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://malaysia-4d.vercel.app&relation=delegate_permission/common.handle_all_urls

## Build locally

```bash
npm run android:apk    # debug/unsigned or signed if keystore exists
npm run android:aab    # Play Store bundle (requires keystore)
```

Output:

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

## CI build (GitHub Actions)

Add repository secrets:

| Secret | Description |
|--------|-------------|
| `ANDROID_KEYSTORE_BASE64` | `base64 -i android/release.keystore` |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | `malaysia4d` |
| `ANDROID_KEY_PASSWORD` | Key password |

Workflow: `.github/workflows/android.yml` — builds APK/AAB on push.

## Google Play

1. Create a Play Console developer account ($25 one-time)
2. Upload the **AAB** from CI or local build
3. Fill store listing (screenshots, privacy policy URL)
4. For ads later: declare ad content in Play Console + link privacy policy

## Package

- **Package ID:** `com.sevengoh.malaysia4d`
- **App name:** MY 4D
