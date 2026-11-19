#!/usr/bin/env bash
# Builds a debug APK to try the Android App on a phone (npm run android:apk).
# With --install (npm run android:install) it also installs it on the phone plugged in over USB,
# which needs USB debugging on (Settings › Developer options).
# The debug app id ends in .debug, so it installs next to the copy from Google Play.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${ANDROID_HOME:-}" ]; then
  for sdk in "$HOME/Library/Android/sdk" "$HOME/Android/Sdk"; do
    if [ -d "$sdk" ]; then
      export ANDROID_HOME="$sdk"
      break
    fi
  done
fi
if [ -z "${ANDROID_HOME:-}" ]; then
  echo "Android SDK not found: set ANDROID_HOME to its folder." >&2
  exit 1
fi
# Gradle needs JDK 21 (docs/android-release.md); Homebrew's openjdk@21 if JAVA_HOME is unset.
if [ -z "${JAVA_HOME:-}" ] && [ -d /opt/homebrew/opt/openjdk@21 ]; then
  export JAVA_HOME=/opt/homebrew/opt/openjdk@21
fi

npm run android:sync
(cd android && ./gradlew assembleDebug)

apk="android/app/build/outputs/apk/debug/app-debug.apk"
echo "APK: $apk"

if [ "${1:-}" = "--install" ]; then
  "$ANDROID_HOME/platform-tools/adb" install -r "$apk"
fi
