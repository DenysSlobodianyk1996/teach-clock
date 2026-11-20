/**
 * The app's version, shown on the Privacy Page (batch 27): package.json's MAJOR.MINOR (raised by
 * hand for a big change) and the Android build's run number as the patch, e.g. 1.0.23. It is the
 * same rule android/app/build.gradle uses for Google Play's versionName (batch 26), so the Android
 * App's Privacy Page and Play show one number. CI sets VERSION_CODE: the Android workflow to its own
 * run number, the Pages deploy to the Android run of the same commit. A local build keeps
 * package.json's version. vite.config.ts puts it in VITE_APP_VERSION; src/privacy.ts exposes it.
 */
export function appVersion({
  packageVersion,
  versionCode,
}: {
  /** `version` in package.json. */
  packageVersion: string
  /** The Android workflow's run number, from VERSION_CODE. */
  versionCode?: string
}): string {
  if (!versionCode || !/^\d+$/.test(versionCode)) return packageVersion
  const [major = '1', minor = '0'] = packageVersion.split('.')
  return `${major}.${minor}.${versionCode}`
}
