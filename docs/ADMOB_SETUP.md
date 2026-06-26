# AdMob / AdSense Setup

MY 4D uses **web ads (AdSense)** inside the Next.js app. Because the Android app is a TWA that loads the live website, **the same ads appear in the Play Store app automatically** — no separate Android AdMob SDK needed.

## 1. Create AdMob account

1. Go to https://admob.google.com
2. Sign in with your Google account
3. Accept terms

## 2. Add your site (web app)

1. AdMob → **Apps** → **Add app**
2. Choose **No** (if asked about Play Store for now) or add Android app `com.sevengoh.malaysia4d` later
3. For **website**: link **AdSense**
   - AdMob → **All apps** → link to AdSense account (or create AdSense at https://adsense.google.com)
4. In AdSense → **Sites** → add `malaysia-4d.vercel.app`
5. Wait for site approval (can take days). Lottery/4D sites may need review — ensure content is informational only.

## 3. Create ad units

In AdSense → **Ads** → **By ad unit** → **Display ads**:

| Unit name | Type | Use |
|-----------|------|-----|
| MY4D Footer | Responsive display | `NEXT_PUBLIC_ADSENSE_SLOT_FOOTER` |
| MY4D Content | Responsive display | `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT` |

Copy:
- **Publisher ID** → `ca-pub-XXXXXXXXXXXXXXXX` → `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- **Slot ID** for each unit (numeric)

## 4. Vercel environment variables

In Vercel → Project → **Settings** → **Environment Variables** (Production):

```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_CONTENT=0987654321
ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX
```

Redeploy. Ads only show in **production** (unless `NEXT_PUBLIC_ADS_ENABLED=true` locally).

## 5. app-ads.txt (AdMob requirement)

After deploy, verify:

https://malaysia-4d.vercel.app/app-ads.txt

Should show:
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

In AdMob → **App settings** → confirm app-ads.txt is verified.

## 6. Play Console updates

| Field | New value |
|-------|-----------|
| Contains ads | **Yes** |
| Data safety | Advertising data may be collected by Google |
| Privacy policy | Already mentions AdSense at `/privacy` |

## 7. Ad placement in app

- **Footer banner** — all pages
- **Content banner** — below operator tabs on home page

Ads are hidden when env vars are missing (safe for dev).

## 8. Policy notes

- App does **not** sell lottery tickets — improves AdSense approval odds
- Do not click your own ads
- Malaysia users: no GDPR UMP required by default; add consent later if you target EU

## 9. Revenue expectations

CPM in Malaysia for utility apps is typically low–moderate. Revenue scales with daily active users on draw nights (Wed/Sat/Sun + special Tuesdays + GD daily).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank ad box | Site not approved yet, or ad blocker |
| app-ads.txt not found | Redeploy after setting `ADSENSE_PUBLISHER_ID` |
| Ads in Android but not web | Same URL — check production env vars |
| Policy violation | Remove misleading content; emphasize results-only |
