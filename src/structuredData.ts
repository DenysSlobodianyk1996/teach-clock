/**
 * The Web App's JSON-LD for search engines (batch 31), which the GitHub Pages build puts in
 * index.html (vite.config.ts, seoPlugin). Plain data with no imports: vite.config.ts reads this file
 * in Node.
 */

export interface StructuredDataInput {
  /** The Web App's public address (`SITE_URL`). */
  site: string
  /** The Game Name, in English. */
  name: string
  /** The description, in English. */
  description: string
  /** Every interface language, as codes. */
  languages: readonly string[]
  /** The Android App's Google Play listing once it is in production, else null. */
  googlePlayUrl: string | null
}

/**
 * The Web App as a free `WebApplication` in every language and, once the Android App is in
 * production, that app as a `MobileApplication` on Google Play. `EducationalApplication`: the game
 * is there to teach children to read a clock (its Play category is Game › Educational).
 */
export function structuredData({
  site,
  name,
  description,
  languages,
  googlePlayUrl,
}: StructuredDataInput): object {
  const context = 'https://schema.org'
  const shared = {
    name,
    description,
    applicationCategory: 'EducationalApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    inLanguage: 'en',
    availableLanguage: [...languages],
  }
  const webApplication = {
    '@context': context,
    '@type': 'WebApplication',
    ...shared,
    url: site,
    operatingSystem: 'Web',
  }
  if (!googlePlayUrl) return webApplication
  const androidApp = {
    '@context': context,
    '@type': 'MobileApplication',
    ...shared,
    url: googlePlayUrl,
    installUrl: googlePlayUrl,
    operatingSystem: 'Android',
  }
  return [webApplication, androidApp]
}
