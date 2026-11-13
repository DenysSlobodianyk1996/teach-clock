// Fails if the Android App asks for a permission that Google Play's Families policy bans for
// apps aimed at children: location or the advertising ID.
//
//   cd android && ./gradlew bundleRelease   (or assembleRelease / processReleaseMainManifest)
//   npm run check:android                   (reads the merged release manifest)
//   npm run check:android -- <path/to/AndroidManifest.xml>
//
// It reads the manifest that Gradle merged from the app and every library, so a permission a
// plugin brings in is caught too. Without a path it uses the release one, or the debug one if
// only a debug build exists. Exit codes: 0 ok, 1 forbidden permission, 2 no manifest.
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const FORBIDDEN = [
  /^android\.permission\.ACCESS_\w*LOCATION$/,
  /^com\.google\.android\.gms\.permission\.AD_ID$/,
]

const root = fileURLToPath(new URL('../', import.meta.url))
const merged = `${root}android/app/build/intermediates/merged_manifest/`
export const MANIFESTS = [
  `${merged}release/processReleaseMainManifest/AndroidManifest.xml`,
  `${merged}debug/processDebugMainManifest/AndroidManifest.xml`,
]

/** Names of the permissions the manifest requests (`uses-permission` and `uses-permission-sdk-23`). */
export function listPermissions(xml: string): string[] {
  const tags = xml.match(/<uses-permission(?:-sdk-23)?\b[^>]*>/g) ?? []
  return tags
    .filter((tag) => !/tools:node\s*=\s*"remove"/.test(tag))
    .map((tag) => /android:name\s*=\s*"([^"]+)"/.exec(tag)?.[1])
    .filter((name): name is string => name !== undefined)
}

export function checkPermissions(xml: string): { permissions: string[]; forbidden: string[] } {
  const permissions = listPermissions(xml)
  const forbidden = permissions.filter((name) => FORBIDDEN.some((rule) => rule.test(name)))
  return { permissions, forbidden }
}

if (import.meta.main) {
  const file = process.argv[2] ?? MANIFESTS.find((path) => existsSync(path))
  if (!file || !existsSync(file)) {
    console.error(
      `No merged manifest found${file ? ` at ${file}` : ''}. Run \`npm run build:android\` and ` +
        '`cd android && ./gradlew bundleRelease` first.',
    )
    process.exit(2)
  }
  const { permissions, forbidden } = checkPermissions(readFileSync(file, 'utf8'))
  console.log(`${file}\nPermissions:\n${permissions.map((name) => `  ${name}`).join('\n')}`)
  if (forbidden.length > 0) {
    console.error(
      `Not allowed in an app for children (Families policy):\n  ${forbidden.join('\n  ')}`,
    )
    process.exit(1)
  }
  console.log('OK: no location or advertising ID permission.')
}
