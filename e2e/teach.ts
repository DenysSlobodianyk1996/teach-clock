/** The wrong-Answer popup in Teach, the same in every Game. */
import { t } from './i18n.ts'
import { expect, type Page } from '@playwright/test'

export const wrongPopup = (page: Page) => page.getByRole('dialog', { name: t('teach.wrongTitle') })

/** The popup's Got it button. */
export const gotIt = (page: Page) =>
  wrongPopup(page).getByRole('button', { name: t('teach.gotIt') })

/** The popup's Set correct answer button. */
export const setCorrect = (page: Page) =>
  wrongPopup(page).getByRole('button', { name: t('teach.setCorrect') })

/** Presses one of the popup's buttons and waits for it to close. */
export async function closeWrongPopup(page: Page, button: 'gotIt' | 'setCorrect') {
  await (button === 'gotIt' ? gotIt(page) : setCorrect(page)).click()
  await expect(wrongPopup(page)).toBeHidden()
}

/** Where the popup's two buttons are on the screen. */
export async function popupButtons(page: Page) {
  return {
    gotIt: (await gotIt(page).boundingBox())!,
    setCorrect: (await setCorrect(page).boundingBox())!,
  }
}
