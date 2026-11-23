/** Welcome's name is required: Start always looks ready and explains what is missing (batch 28). */
import { t } from './i18n.ts'
import { expect, test, type Page } from '@playwright/test'

const nameField = (page: Page) => page.getByRole('textbox', { name: t('welcome.nameLabel') })
const start = (page: Page) => page.getByRole('button', { name: t('welcome.start') })
const error = (page: Page) => page.getByRole('alert').filter({ hasText: t('welcome.nameRequired') })

async function expectNameError(page: Page) {
  await expect(page).not.toHaveURL(/\/settings$/)
  await expect(error(page)).toBeVisible()
  await expect(nameField(page)).toBeFocused()
  await expect(nameField(page)).toHaveAttribute('aria-invalid', 'true')
  await expect(nameField(page)).toHaveAccessibleDescription(t('welcome.nameRequired'))
}

test('tapping Start with no name marks the field and puts focus in it', async ({ page }) => {
  await page.goto('/')
  await expect(start(page)).toBeEnabled()
  await expect(error(page)).toBeHidden()
  await start(page).click()
  await expectNameError(page)
})

test('Enter on an empty field does the same as tapping Start', async ({ page }) => {
  await page.goto('/')
  await nameField(page).press('Enter')
  await expectNameError(page)
  await expect(start(page)).toBeEnabled()
})

test('a name of only spaces counts as empty', async ({ page }) => {
  await page.goto('/')
  await nameField(page).fill('   ')
  await start(page).click()
  await expectNameError(page)
  await expect(start(page)).toBeEnabled()
})

test('the first typed letter clears the error, and the name then starts', async ({ page }) => {
  await page.goto('/')
  await start(page).click()
  await expectNameError(page)
  await page.keyboard.type('О')
  await expect(error(page)).toBeHidden()
  await expect(nameField(page)).not.toHaveAttribute('aria-invalid', 'true')
  await start(page).click()
  await expect(page).toHaveURL(/\/settings$/)
})

for (const theme of ['light', 'dark'] as const) {
  test(`in the ${theme} theme the asterisk, border and message are red`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('teach-clock.theme', value), theme)
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await start(page).click()
    const token = (name: string) =>
      page.evaluate((n) => {
        const probe = document.createElement('i')
        probe.style.color = `var(${n})`
        document.body.append(probe)
        const color = getComputedStyle(probe).color
        probe.remove()
        return color
      }, name)
    await expect(page.locator('label[for="player-name"] span')).toHaveText('*')
    await expect(page.locator('label[for="player-name"] span')).toHaveCSS(
      'color',
      await token('--bad-text'),
    )
    await expect(error(page)).toHaveCSS('color', await token('--bad-text'))
    // One border: yellow while focused, even with the error, and red once focus leaves.
    await expect(nameField(page)).toBeFocused()
    await expect(nameField(page)).toHaveCSS('border-top-color', await token('--accent'))
    await expect(nameField(page)).toHaveCSS('outline-style', 'none')
    await nameField(page).blur()
    await expect(nameField(page)).toHaveCSS('border-top-color', await token('--bad'))
  })
}

test('the field is required, and the asterisk is not read out', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('textbox', { name: t('welcome.nameLabel'), exact: true }),
  ).toHaveJSProperty('required', true)
})

test('a saved name starts straight away, with no error', async ({ page }) => {
  await page.goto('/')
  await nameField(page).fill('Оля')
  await start(page).click()
  await expect(page).toHaveURL(/\/settings$/)
  await page.goto('/')
  await expect(nameField(page)).toHaveValue('Оля')
  await start(page).click()
  await expect(page).toHaveURL(/\/settings$/)
  await expect(error(page)).toBeHidden()
})
