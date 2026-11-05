import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import RoundView from '../RoundView.vue'
import { mountScreen } from '@/test/mountScreen'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'
import { seededRandom } from '@/game/tasks'
import { clockTime } from '@/game/clockTime'
import { describeMistake } from '@/game/mistakes'
import { t } from '@/test/i18n'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

async function open(game: 'setTime' | 'dragArrows' = 'setTime', mode: 'teach' | 'test' = 'test') {
  const screen = await mountScreen(RoundView, '/round', () => {
    usePlayerStore().setName('Оля')
    const play = usePlayStore()
    Object.assign(play.settings, { game, mode, level: 30 })
    play.startRound(seededRandom(5))
  })
  wrapper = screen.wrapper
  return screen
}

/** Types H:MM on the number pad and presses Submit. */
async function answer(time: string) {
  const [hour, minute] = time.split(':') as [string, string]
  const pad = wrapper.findAll('.pad button')
  for (const d of hour.padStart(2, '0') + minute)
    await pad[d === '0' ? 9 : Number(d) - 1]!.trigger('click')
  await wrapper
    .findAll('button')
    .find((b) => b.text() === t('round.submit'))!
    .trigger('click')
}

const clockLabel = () => wrapper.get('.clock-side svg.clock').attributes('aria-label')!
const CLOCK_SHOWS = t('app.clockShows', { time: '' })
const shownTime = () => clockLabel().replace(CLOCK_SHOWS, '')

describe('Round screen, Set Time', () => {
  it('shows a clock and asks what time it is', async () => {
    await open()
    expect(wrapper.get('h1').text()).toBe(t('round.question'))
    expect(clockLabel()).toBe(`${CLOCK_SHOWS}${shownTime()}`)
    expect(shownTime()).toMatch(/^\d{1,2}:\d{2}$/)
    expect(wrapper.text()).toContain(
      `${t('round.progress', { n: 1, total: 10 })} · ${t('modes.test.name')}`,
    )
  })

  it('moves on after every Answer and colours the dots', async () => {
    await open()
    const first = shownTime()
    await answer(first)
    const second = shownTime()
    expect(second).not.toBe(first)
    await answer(second === '12:00' ? '1:00' : '12:00')
    expect(
      wrapper
        .findAll('.dot')
        .slice(0, 3)
        .map((d) => d.classes()[1]),
    ).toEqual(['ok', 'bad', 'now'])
    expect(wrapper.text()).toContain(t('round.progress', { n: 3, total: 10 }))
  })

  it('opens the Summary after the 10th Answer', async () => {
    const { router } = await open()
    for (let i = 0; i < 10; i++) await answer(shownTime())
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('summary'))
    expect(usePlayStore().summary).toMatchObject({ rightCount: 10 })
  })

  it('does not take keyboard input while asking to leave', async () => {
    await open()
    usePlayStore().askingToLeave = true
    await wrapper.vm.$nextTick()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '7' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.get(`[aria-label="${t('round.hours')}"]`).text()).toBe('')
  })

  it('keeps the placeholder for Games that are not built yet', async () => {
    await open('dragArrows')
    expect(wrapper.get('[data-testid="play-area"]').text()).toContain(t('round.comingSoon'))
  })
})

const button = (text: string) => wrapper.findAll('button').find((b) => b.text() === text)
const dotClasses = () => wrapper.findAll('.dot').map((d) => d.classes()[1])
/** Off the 30-minute Level step, so never the right Answer. */
const WRONG = '12:01'

describe('Round screen, Set Time in Teach', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }))
  afterEach(() => vi.useRealTimers())

  it('shows no Hint before a wrong try', async () => {
    await open('setTime', 'teach')
    expect(wrapper.text()).not.toContain(t('teach.setCorrect'))
  })

  it('after a wrong Answer, shows the correct time with a teaching line and keeps the digits', async () => {
    await open('setTime', 'teach')
    const correct = shownTime()
    await answer(WRONG)
    const popup = wrapper.get('[role="dialog"]')
    expect(popup.get('h2').text()).toBe(t('teach.wrongTitle'))
    expect(popup.get('.big-time').text()).toBe(correct)
    const [h, m] = correct.split(':').map(Number) as [number, number]
    const mistake = describeMistake(clockTime(h, m), clockTime(12, 1))
    expect(popup.get('#wrong-why').text()).toBe(t(`teach.mistakes.${mistake.kind}`, mistake.params))

    await button(t('teach.gotIt'))!.trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(wrapper.get(`[aria-label="${t('round.hours')}"]`).text()).toBe('12')
    expect(wrapper.get(`[aria-label="${t('round.minutes')}"]`).text()).toBe('01')
    expect(wrapper.text()).toContain(t('round.progress', { n: 1, total: 10 }))
    expect(wrapper.get('.hint-panel').text()).toContain(`${t('teach.hint')} ${correct}`)
  })

  it('Set correct answer fills the digits; after Submit the Task ends helped (yellow)', async () => {
    await open('setTime', 'teach')
    const correct = shownTime()
    await answer(WRONG)
    await button(t('teach.gotIt'))!.trigger('click')
    await button(t('teach.setCorrect'))!.trigger('click')
    const [hour, minute] = correct.split(':')
    expect(wrapper.get(`[aria-label="${t('round.hours')}"]`).text()).toBe(hour)
    expect(wrapper.get(`[aria-label="${t('round.minutes')}"]`).text()).toBe(minute)
    // Still on the Task until the Player presses Submit.
    expect(wrapper.text()).toContain(t('round.progress', { n: 1, total: 10 }))

    await button(t('round.submit'))!.trigger('click')
    expect(wrapper.get('[role="status"]').text()).toBe(t('teach.right'))
    expect(wrapper.get('.clock-side svg.clock').classes()).toContain('rim-good')
    expect(shownTime()).toBe(correct)

    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[role="status"]').text()).toBe('')
    expect(wrapper.text()).toContain(t('round.progress', { n: 2, total: 10 }))
    expect(wrapper.text()).not.toContain(t('teach.setCorrect'))
    expect(dotClasses().slice(0, 2)).toEqual(['help', 'now'])
  })

  it('a right first try turns the dot green after the toast', async () => {
    await open('setTime', 'teach')
    await answer(shownTime())
    expect(wrapper.get('[role="status"]').text()).toBe(t('teach.right'))
    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(dotClasses().slice(0, 2)).toEqual(['ok', 'now'])
  })

  it('opens the Summary after the 10th right Answer, listing a helped Task under Wrong', async () => {
    const { router } = await open('setTime', 'teach')
    const helped = shownTime()
    await answer(WRONG)
    await button(t('teach.gotIt'))!.trigger('click')
    await button(t('teach.setCorrect'))!.trigger('click')
    await button(t('round.submit'))!.trigger('click')
    for (let i = 0; i < 10; i++) {
      if (i > 0) await answer(shownTime())
      vi.runAllTimers()
      await wrapper.vm.$nextTick()
    }
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('summary'))
    const [hour, minute] = helped.split(':').map(Number)
    expect(usePlayStore().summary).toMatchObject({
      rightCount: 9,
      wrong: [{ answer: { hour, minute }, firstAnswer: { hour: 12, minute: 1 } }],
    })
  })
})
