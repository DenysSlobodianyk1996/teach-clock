// Tests run on a Ukrainian device, so a fresh game opens in Ukrainian, the language `t` reads.
// Tests about the device language override this with `stubDeviceLanguages`. Node-environment
// tests have no browser to set.
if (typeof window !== 'undefined') {
  const languages = ['uk-UA', 'uk']
  Object.defineProperty(window.navigator, 'languages', { get: () => languages, configurable: true })
  Object.defineProperty(window.navigator, 'language', { get: () => 'uk-UA', configurable: true })
}
