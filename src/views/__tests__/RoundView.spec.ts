import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import RoundView from '../RoundView.vue'
import ClockFace from '@/components/ClockFace.vue'
import { mountScreen } from '@/test/mountScreen'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'
import { seededRandom } from '@/game/tasks'
import type { Game, Mode } from '@/game/settings'
import { clockTime } from '@/game/clockTime'
import { describeMistake } from '@/game/mistakes'
import { t } from '@/test/i18n'

let wrapper: VueWrapper
afterEach(() => wrapper.unmount())

async function open(game: Game = 'setTime', mode: Mode = 'test') {
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
    await open('dragNumbers', 'teach')
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

const CLOCK_DRAG = t('app.clockDrag', { time: '12:00' })
const target = () => wrapper.get('.target').text()
const handsLabel = () => wrapper.get('.clock-side svg.clock').attributes('aria-label')
const handsAt = (time: string) => t('app.clockDrag', { time })

/** From 12:00, drags the Minute Hand to the minutes, then the Hour Hand to the hour. */
async function setHands(time: string) {
  const [hour, minute] = time.split(':').map(Number) as [number, number]
  const clock = wrapper.findComponent(ClockFace)
  clock.vm.$emit('drag', { hand: 'minute', angle: minute * 6 })
  clock.vm.$emit('drag', { hand: 'hour', angle: hour * 30 + minute * 0.5 })
  await wrapper.vm.$nextTick()
}

const submitHands = () => button(t('round.submit'))!.trigger('click')

describe('Round screen, Drag Arrows in Test', () => {
  const submit = submitHands

  it('asks for a Clock Time and starts the hands at 12:00', async () => {
    await open('dragArrows')
    expect(wrapper.get('h1').text()).toBe(t('round.setHands'))
    expect(target()).toMatch(/^\d{1,2}:\d{2}$/)
    expect(target()).not.toBe('12:00')
    expect(handsLabel()).toBe(CLOCK_DRAG)
    expect(button(t('round.submit'))!.attributes('disabled')).toBeUndefined()
  })

  it('the dragged hands show the time, and a right Answer turns the dot green', async () => {
    await open('dragArrows')
    const first = target()
    await setHands(first)
    expect(handsLabel()).toBe(t('app.clockDrag', { time: first }))
    await submit()
    expect(dotClasses().slice(0, 2)).toEqual(['ok', 'now'])
    expect(target()).not.toBe(first)
    expect(handsLabel()).toBe(CLOCK_DRAG)
  })

  it('an untouched clock is a wrong Answer that still moves on', async () => {
    await open('dragArrows')
    await submit()
    expect(dotClasses().slice(0, 2)).toEqual(['bad', 'now'])
    expect(wrapper.text()).toContain(t('round.progress', { n: 2, total: 10 }))
  })

  it('opens the Summary after the 10th Answer', async () => {
    const { router } = await open('dragArrows')
    await submit()
    for (let i = 1; i < 10; i++) {
      await setHands(target())
      await submit()
    }
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('summary'))
    expect(usePlayStore().summary).toMatchObject({ rightCount: 9 })
  })
})

describe('Round screen, Drag Arrows in Teach', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }))
  afterEach(() => vi.useRealTimers())

  /**
   * A wrong Answer for `correct`: another hour, on the hour. Never the right Answer, and never
   * 12:00, where the hands start, so "the hands stay" can be told apart from a reset.
   */
  const wrongFor = (correct: string) => `${(Number(correct.split(':')[0]) % 11) + 1}:00`

  it('shows no Hint before a wrong try', async () => {
    await open('dragArrows', 'teach')
    expect(wrapper.get('h1').text()).toBe(t('round.setHands'))
    expect(handsLabel()).toBe(CLOCK_DRAG)
    expect(wrapper.text()).not.toContain(t('teach.setCorrect'))
  })

  it('after a wrong Answer, shows the correct time with a teaching line; the hands stay', async () => {
    await open('dragArrows', 'teach')
    const correct = target()
    const wrong = wrongFor(correct)
    await setHands(wrong)
    await submitHands()
    const popup = wrapper.get('[role="dialog"]')
    expect(popup.get('.big-time').text()).toBe(correct)
    const [h, m] = correct.split(':').map(Number) as [number, number]
    const [wh] = wrong.split(':').map(Number) as [number]
    const mistake = describeMistake(clockTime(h, m), clockTime(wh, 0))
    expect(popup.get('#wrong-why').text()).toBe(t(`teach.mistakes.${mistake.kind}`, mistake.params))

    await button(t('teach.gotIt'))!.trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(handsLabel()).toBe(handsAt(wrong))
    expect(wrapper.text()).toContain(t('round.progress', { n: 1, total: 10 }))
    expect(wrapper.get('.hint-panel').text()).toContain(`${t('teach.hint')} ${correct}`)
  })

  it('Set correct answer turns the hands to the Hint; after Submit the Task ends helped (yellow)', async () => {
    await open('dragArrows', 'teach')
    const correct = target()
    await submitHands()
    await button(t('teach.gotIt'))!.trigger('click')
    await button(t('teach.setCorrect'))!.trigger('click')
    expect(handsLabel()).toBe(handsAt(correct))
    expect(wrapper.get('.clock-side svg.clock').classes()).toContain('animate')
    expect(wrapper.text()).toContain(t('round.progress', { n: 1, total: 10 }))

    await submitHands()
    expect(wrapper.get('[role="status"]').text()).toBe(t('teach.right'))
    expect(wrapper.get('.clock-side svg.clock').classes()).toContain('rim-good')
    expect(handsLabel()).toBe(handsAt(correct))

    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain(t('round.progress', { n: 2, total: 10 }))
    expect(handsLabel()).toBe(CLOCK_DRAG)
    expect(wrapper.text()).not.toContain(t('teach.setCorrect'))
    expect(dotClasses().slice(0, 2)).toEqual(['help', 'now'])
  })

  it('dragging after Set correct answer moves the hands straight away, without the animation', async () => {
    await open('dragArrows', 'teach')
    await submitHands()
    await button(t('teach.gotIt'))!.trigger('click')
    await button(t('teach.setCorrect'))!.trigger('click')
    wrapper.findComponent(ClockFace).vm.$emit('drag', { hand: 'hour', angle: 90 })
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.clock-side svg.clock').classes()).not.toContain('animate')
  })

  it('a right first try turns the dot green after the toast', async () => {
    await open('dragArrows', 'teach')
    await setHands(target())
    await submitHands()
    expect(wrapper.get('[role="status"]').text()).toBe(t('teach.right'))
    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(dotClasses().slice(0, 2)).toEqual(['ok', 'now'])
  })

  it('opens the Summary after the 10th right Answer, listing a helped Task under Wrong', async () => {
    const { router } = await open('dragArrows', 'teach')
    const helped = target()
    await submitHands()
    await button(t('teach.gotIt'))!.trigger('click')
    await button(t('teach.setCorrect'))!.trigger('click')
    await submitHands()
    for (let i = 0; i < 10; i++) {
      vi.runAllTimers()
      await wrapper.vm.$nextTick()
      if (i < 9) {
        await setHands(target())
        await submitHands()
      }
    }
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('summary'))
    const [hour, minute] = helped.split(':').map(Number)
    expect(usePlayStore().summary).toMatchObject({
      rightCount: 9,
      wrong: [{ answer: { hour, minute }, firstAnswer: { hour: 12, minute: 0 } }],
    })
  })
})
