#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT/android"
KEYSTORE="$ANDROID_DIR/release.keystore"
ALIAS="malaysia4d"
ASSETLINKS="$ROOT/public/.well-known/assetlinks.json"

if ! command -v keytool >/dev/null 2>&1; then
  echo "Java keytool not found. Install JDK 17+ (e.g. brew install openjdk@17)."
  exit 1
fi

if [[ ! -f "$KEYSTORE" ]]; then
  echo "Creating release keystore at android/release.keystore"
  read -rsp "Enter keystore password: " STORE_PASS
  echo
  read -rsp "Confirm keystore password: " STORE_PASS_CONFIRM
  echo
  if [[ "$STORE_PASS" != "$STORE_PASS_CONFIRM" ]]; then
    echo "Passwords do not match."
    exit 1
  fi
  keytool -genkeypair \
    -alias "$ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storetype PKCS12 \
    -keystore "$KEYSTORE" \
    -storepass "$STORE_PASS" \
    -keypass "$STORE_PASS" \
    -dname "CN=Malaysia 4D, OU=Mobile, O=SevenGoh, L=Kuala Lumpur, ST=MY, C=MY"

  cp "$ANDROID_DIR/keystore.properties.example" "$ANDROID_DIR/keystore.properties"
  sed -i '' "s/CHANGE_ME/$STORE_PASS/g" "$ANDROID_DIR/keystore.properties"
  echo "Wrote android/keystore.properties"
fi

FINGERPRINT="$(
  keytool -list -v \
    -keystore "$KEYSTORE" \
    -alias "$ALIAS" \
    -storepass "$(grep storePassword "$ANDROID_DIR/keystore.properties" | cut -d= -f2)" \
    2>/dev/null | awk '/SHA256:/{print $2}'
)"

if [[ -z "$FINGERPRINT" ]]; then
  echo "Could not read SHA256 fingerprint. Check keystore.properties passwords."
  exit 1
fi

python3 - <<PY
import json
from pathlib import Path

path = Path("$ASSETLINKS")
data = json.loads(path.read_text())
data[0]["target"]["sha256_cert_fingerprints"] = ["$FINGERPRINT"]
path.write_text(json.dumps(data, indent=2) + "\n")
print("Updated", path)
print("SHA256:", "$FINGERPRINT")
PY

echo ""
echo "Next steps:"
echo "  1. Deploy web app so assetlinks.json is live on malaysia-4d.vercel.app"
echo "  2. Verify: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://malaysia-4d.vercel.app&relation=delegate_permission/common.handle_all_urls"
echo "  3. Build APK: npm run android:apk"
