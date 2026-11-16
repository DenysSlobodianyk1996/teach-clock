/** Starting a Round from the Welcome screen. */
import { t, startingWith } from './i18n.ts'
import type { Page } from '@playwright/test'

type Game = 'setTime' | 'dragArrows' | 'dragHours' | 'dragMinutes'

/**
 * Enters a name, picks the Game, the Mode and (for the clock Games) the Level or (for Drag Hours)
 * the Hours, and presses Play.
 */
export async function startRound(
  page: Page,
  {
    game,
    mode,
    level,
    hours,
  }: { game: Game; mode: 'teach' | 'test'; level?: 5 | 15; hours?: 12 | 24 },
) {
  await page.goto('/')
  await page.getByLabel(t('welcome.nameLabel')).fill('Оля')
  await page.getByRole('button', { name: t('welcome.start') }).click()
  await page.getByRole('radio', { name: startingWith(t(`games.${game}.name`)) }).check()
  await page.getByRole('radio', { name: startingWith(t(`modes.${mode}.name`)) }).check()
  if (level)
    await page.getByRole('radio', { name: startingWith(t(`levels.${level}.name`)) }).check()
  if (hours) await page.getByRole('radio', { name: startingWith(t(`hours.${hours}.name`)) }).check()
  await page.getByRole('button', { name: t('settings.play') }).click()
}
