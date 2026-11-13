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
    play.settings = { game, mode, level: 15 }
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
/** The hour number lit on the Round clock. */
const litNumber = () => wrapper.get('.clock-side .c-num.lit').text()

const litTick = () => wrapper.find('.clock-side [data-lit-tick]')
const litNumbers = () => wrapper.findAll('.clock-side .c-num.lit')

describe('Round screen Lit Place, shown in Teach only', () => {
  it('Set Time in Teach lights the tick and the shown hour', async () => {
    await open('setTime', 'teach')
    expect(litTick().exists()).toBe(true)
    expect(litNumber()).toBe(shownTime().split(':')[0])
  })

  it('Drag Arrows in Teach lights 12 at the start and follows the dragged hands', async () => {
    await open('dragArrows', 'teach')
    expect(litTick().exists()).toBe(true)
    expect(litNumber()).toBe('12')
    await setHands('3:15')
    expect(litTick().exists()).toBe(true)
    expect(litNumber()).toBe('3')
  })

  it('Set Time in Test lights nothing', async () => {
    await open('setTime', 'test')
    expect(litTick().exists()).toBe(false)
    expect(litNumbers()).toHaveLength(0)
  })

  it('Drag Arrows in Test lights nothing, before or after dragging', async () => {
    await open('dragArrows', 'test')
    expect(litTick().exists()).toBe(false)
    expect(litNumbers()).toHaveLength(0)
    await setHands('3:15')
    expect(litTick().exists()).toBe(false)
    expect(litNumbers()).toHaveLength(0)
  })
})

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
})

const button = (text: string) => wrapper.findAll('button').find((b) => b.text() === text)
const dotClasses = () => wrapper.findAll('.dot').map((d) => d.classes()[1])
/** Off every Level step, so never the right Answer. */
const WRONG = '12:01'

describe('Round screen, Set Time in Teach', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }))
  afterEach(() => vi.useRealTimers())

  it('shows no popup and no Set correct answer before a wrong try', async () => {
    await open('setTime', 'teach')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(button(t('teach.setCorrect'))).toBeUndefined()
  })

  it('after a wrong Answer, shows the correct time with a teaching line; Got it keeps the digits', async () => {
    await open('setTime', 'teach')
    const correct = shownTime()
    await answer(WRONG)
    const popup = wrapper.get('[role="dialog"]')
    expect(popup.get('h2').text()).toBe(t('teach.wrongTitle'))
    expect(popup.find('svg.clock').exists()).toBe(true)
    expect(popup.find('[data-lit-tick]').exists()).toBe(false)
    expect(popup.find('.c-num.lit').exists()).toBe(false)
    expect(popup.get('.big-time').text()).toBe(correct)
    const [h, m] = correct.split(':').map(Number) as [number, number]
    const mistake = describeMistake(clockTime(h, m), clockTime(12, 1))
    expect(popup.get('#wrong-why').text()).toBe(t(`teach.mistakes.${mistake.kind}`, mistake.params))

    await button(t('teach.gotIt'))!.trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(wrapper.get(`[aria-label="${t('round.hours')}"]`).text()).toBe('12')
    expect(wrapper.get(`[aria-label="${t('round.minutes')}"]`).text()).toBe('01')
    expect(wrapper.text()).toContain(t('round.progress', { n: 1, total: 10 }))
    // Nothing about the Hint stays in the layout.
    expect(button(t('teach.setCorrect'))).toBeUndefined()
    expect(wrapper.text()).not.toContain(correct)
  })

  it('Escape closes the popup and a second wrong try opens it again; a Task fixed after Got it ends helped', async () => {
    await open('setTime', 'teach')
    const correct = shownTime()
    await answer(WRONG)
    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(wrapper.get(`[aria-label="${t('round.minutes')}"]`).text()).toBe('01')

    await answer(WRONG)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    await button(t('teach.gotIt'))!.trigger('click')

    // The Player clears both boxes and types the right time.
    for (const box of ['round.minutes', 'round.hours']) {
      await wrapper.get(`[aria-label="${t(box)}"]`).trigger('click')
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))
    }
    await answer(correct)
    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(dotClasses().slice(0, 2)).toEqual(['help', 'now'])
  })

  it('Set correct answer in the popup fills the digits; after Submit the Task ends helped (yellow)', async () => {
    await open('setTime', 'teach')
    const correct = shownTime()
    await answer(WRONG)
    await button(t('teach.setCorrect'))!.trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
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
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
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

  it('shows no popup and no Set correct answer before a wrong try', async () => {
    await open('dragArrows', 'teach')
    expect(wrapper.get('h1').text()).toBe(t('round.setHands'))
    expect(handsLabel()).toBe(CLOCK_DRAG)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(button(t('teach.setCorrect'))).toBeUndefined()
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
    expect(button(t('teach.setCorrect'))).toBeUndefined()
  })

  it('the scrim closes the popup and a second wrong try opens it again; a Task fixed after Got it ends helped', async () => {
    await open('dragArrows', 'teach')
    const correct = target()
    const wrong = wrongFor(correct)
    await setHands(wrong)
    await submitHands()
    await wrapper.get('.scrim').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(handsLabel()).toBe(handsAt(wrong))

    await submitHands()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    await button(t('teach.gotIt'))!.trigger('click')

    await setHands(correct)
    await submitHands()
    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(dotClasses().slice(0, 2)).toEqual(['help', 'now'])
  })

  it('Set correct answer in the popup turns the hands to the Hint; after Submit the Task ends helped (yellow)', async () => {
    await open('dragArrows', 'teach')
    const correct = target()
    await submitHands()
    await button(t('teach.setCorrect'))!.trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
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
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(dotClasses().slice(0, 2)).toEqual(['help', 'now'])
  })

  it('dragging after Set correct answer moves the hands straight away, without the animation', async () => {
    await open('dragArrows', 'teach')
    await submitHands()
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

/** Taps a tray number, then a slot. */
async function place(number: number, slot: number) {
  await wrapper.get(`.tray [data-number="${number}"]`).trigger('click')
  await wrapper.get(`.board [data-slot="${slot}"]`).trigger('click')
}

/** The wrong-drop popup, and the Round's own face (the popup draws a small face too). */
const popup = () => wrapper.find('[role="dialog"]')
const board = () => wrapper.get('.board')

describe('Round screen, Drag Hours in Teach', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }))
  afterEach(() => vi.useRealTimers())

  it('shows an empty face, the tray of 1–12 and 12 grey dots', async () => {
    await open('dragHours', 'teach')
    expect(wrapper.get('h1').text()).toBe(t('numbers.heading'))
    const tray = wrapper.findAll('.tray .tile').map((b) => Number(b.text()))
    expect([...tray].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(wrapper.findAll('[data-slot] .c-slot')).toHaveLength(12)
    expect(dotClasses()).toEqual(Array(12).fill(undefined))
    expect(wrapper.text()).toContain(
      `${t('numbers.progress', { n: 0, total: 12 })} · ${t('modes.teach.name')}`,
    )
  })

  it('a wrong drop opens the popup with the right slot lit and the neighbour line', async () => {
    await open('dragHours', 'teach')
    expect(popup().exists()).toBe(false)
    await place(12, 4)
    expect(popup().get('h2').text()).toBe(t('teach.wrongTitle'))
    expect(popup().get('#wrong-why').text()).toBe(
      t('numbers.between', { number: 12, before: 11, after: 1 }),
    )
    expect(popup().get('[data-slot="12"]').classes()).toContain('good')
    expect(
      popup()
        .findAll('[data-slot]')
        .map((g) => g.text()),
    ).toEqual(['1', '11', '12'])
    expect(wrapper.get('.tray [data-number="12"]').classes()).toContain('marked')
    expect(board().find('[data-slot="4"] .c-slot').exists()).toBe(true)
  })

  it('Got it, Escape and the scrim close the popup; a new wrong drop opens it again', async () => {
    await open('dragHours', 'teach')
    await place(12, 4)
    await button(t('teach.gotIt'))!.trigger('click')
    expect(popup().exists()).toBe(false)
    expect(wrapper.find('.tray [data-number="12"]').exists()).toBe(true)
    await place(12, 4)
    await popup().trigger('keydown', { key: 'Escape' })
    expect(popup().exists()).toBe(false)
    await place(12, 5)
    await wrapper.get('.scrim').trigger('click')
    expect(popup().exists()).toBe(false)
    expect(board().find('[data-slot="12"] .c-slot').exists()).toBe(true)
  })

  it('a number fixed after Got it still counts as helped', async () => {
    await open('dragHours', 'teach')
    await place(12, 4)
    await button(t('teach.gotIt'))!.trigger('click')
    await place(12, 12)
    expect(dotClasses()[11]).toBe('help')
  })

  it('locks a right drop on the face, opens no popup and colours its dot', async () => {
    await open('dragHours', 'teach')
    await place(7, 4)
    await button(t('teach.gotIt'))!.trigger('click')
    await place(7, 7)
    await place(3, 3)
    expect(popup().exists()).toBe(false)
    expect(board().get('[data-slot="7"]').text()).toBe('7')
    expect(wrapper.find('.tray [data-number="7"]').exists()).toBe(false)
    expect(dotClasses()[6]).toBe('help')
    expect(dotClasses()[2]).toBe('ok')
    expect(wrapper.text()).toContain(t('numbers.progress', { n: 2, total: 12 }))
  })

  it('opens the Summary once all 12 are placed', async () => {
    const { router } = await open('dragHours', 'teach')
    for (let n = 1; n <= 12; n++) await place(n, n)
    expect(router.currentRoute.value.name).toBe('round')
    vi.runAllTimers()
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('summary'))
  })
})

describe('Round screen, Drag Hours Set correct answer', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }))
  afterEach(() => vi.useRealTimers())

  it('puts the number on its slot, flashes it green and closes the popup', async () => {
    await open('dragHours', 'teach')
    await place(12, 4)
    await button(t('teach.setCorrect'))!.trigger('click')
    expect(popup().exists()).toBe(false)
    expect(board().get('[data-slot="12"]').text()).toBe('12')
    expect(board().get('[data-slot="12"]').classes()).toContain('flash')
    expect(wrapper.find('.tray [data-number="12"]').exists()).toBe(false)
    expect(dotClasses()[11]).toBe('help')
    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(board().get('[data-slot="12"]').classes()).not.toContain('flash')
  })

  it('counts the number it placed as Wrong in the Summary', async () => {
    const { router } = await open('dragHours', 'teach')
    for (let n = 1; n <= 10; n++) await place(n, n)
    await place(12, 11)
    await button(t('teach.setCorrect'))!.trigger('click')
    await place(11, 11)
    vi.runAllTimers()
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('summary'))
    expect(usePlayStore().summary).toMatchObject({
      rightCount: 11,
      wrong: [{ answer: 12, firstAnswer: 11 }],
    })
  })

  it('never opens in Test', async () => {
    await open('dragHours', 'test')
    await place(12, 4)
    expect(popup().exists()).toBe(false)
  })
})

describe('Round screen, Drag Minutes in Teach', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }))
  afterEach(() => vi.useRealTimers())

  it('shows an empty face with Hour Badges, and a tray of 5–60', async () => {
    await open('dragMinutes', 'teach')
    const tray = wrapper.findAll('.tray .tile').map((b) => Number(b.text()))
    expect([...tray].sort((a, b) => a - b)).toEqual([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60])
    expect(wrapper.findAll('.hour-badge')).toHaveLength(12)
    expect(dotClasses()).toEqual(Array(12).fill(undefined))
  })

  it('a wrong drop opens the popup in minutes, with Hour Badges, wrapping round the top', async () => {
    await open('dragMinutes', 'teach')
    await place(2, 5)
    expect(popup().get('#wrong-why').text()).toBe(
      t('numbers.between', { number: 10, before: 5, after: 15 }),
    )
    expect(popup().findAll('.hour-badge')).toHaveLength(12)
    await button(t('teach.gotIt'))!.trigger('click')
    await place(12, 5)
    expect(popup().get('#wrong-why').text()).toBe(
      t('numbers.between', { number: 60, before: 55, after: 5 }),
    )
    expect(popup().get('[data-slot="12"]').text()).toBe('60')
    expect(popup().get('[data-slot="12"]').classes()).toContain('good')
  })

  it('Set correct answer places the minute, as helped', async () => {
    await open('dragMinutes', 'teach')
    await place(12, 4)
    await button(t('teach.setCorrect'))!.trigger('click')
    expect(board().get('[data-slot="12"] .c-tile-num').text()).toBe('60')
    expect(dotClasses()[11]).toBe('help')
  })
})

const submitButton = () => button(t('numbers.submit'))
const placedAt = (slot: number) => wrapper.get(`[data-slot="${slot}"]`).text()

describe('Round screen, Drag Hours in Test', () => {
  it('takes a wrong drop with no hint, and counts placed numbers with neutral dots', async () => {
    await open('dragHours', 'test')
    await place(12, 4)
    expect(placedAt(4)).toBe('12')
    expect(popup().exists()).toBe(false)
    expect(dotClasses()).toEqual(['placed', ...Array(11).fill(undefined)])
    expect(wrapper.text()).toContain(
      `${t('numbers.placedCount', { n: 1, total: 12 })} · ${t('modes.test.name')}`,
    )
  })

  it('swaps two numbers on the face, and takes one back to the tray', async () => {
    await open('dragHours', 'test')
    await place(12, 4)
    await place(3, 9)
    await wrapper.get('[data-slot="4"]').trigger('click')
    await wrapper.get('[data-slot="9"]').trigger('click')
    expect(placedAt(4)).toBe('3')
    expect(placedAt(9)).toBe('12')
    await wrapper.get('[data-slot="9"]').trigger('click')
    await wrapper.get('.tray').trigger('click')
    expect(wrapper.find('.tray [data-number="12"]').exists()).toBe(true)
    expect(placedAt(9)).toBe('')
  })

  it('shows Submit only once all 12 are placed, then opens the Summary', async () => {
    const { router } = await open('dragHours', 'test')
    for (let n = 1; n <= 11; n++) await place(n, n)
    expect(submitButton()).toBeUndefined()
    await place(12, 12)
    await submitButton()!.trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('summary'))
    expect(usePlayStore().summary).toMatchObject({ rightCount: 12, total: 12 })
  })
})

describe('Round screen, Drag Minutes in Test', () => {
  it('takes a wrong minute with no popup, keeping the Hour Badges', async () => {
    await open('dragMinutes', 'test')
    await place(12, 4)
    expect(placedAt(4)).toBe('60')
    expect(popup().exists()).toBe(false)
    expect(wrapper.findAll('.hour-badge').map((b) => b.text())).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ])
  })

  it('swaps two minutes on the face, and takes one back to the tray', async () => {
    await open('dragMinutes', 'test')
    await place(12, 4)
    await place(3, 9)
    await wrapper.get('[data-slot="4"]').trigger('click')
    await wrapper.get('[data-slot="9"]').trigger('click')
    expect(placedAt(4)).toBe('15')
    expect(placedAt(9)).toBe('60')
    await wrapper.get('[data-slot="9"]').trigger('click')
    await wrapper.get('.tray').trigger('click')
    expect(wrapper.get('.tray [data-number="12"]').text()).toBe('60')
    expect(placedAt(9)).toBe('')
  })

  it('shows Submit once all 12 minutes are placed, then opens a Drag Minutes Summary', async () => {
    const { router } = await open('dragMinutes', 'test')
    for (let n = 1; n <= 11; n++) await place(n, n === 4 ? 5 : n === 5 ? 4 : n)
    expect(submitButton()).toBeUndefined()
    await place(12, 12)
    expect(wrapper.findAll('.hour-badge')).toHaveLength(12)
    await submitButton()!.trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('summary'))
    expect(usePlayStore().summary).toMatchObject({ game: 'dragMinutes', rightCount: 10, total: 12 })
  })
})

describe('Round screen, Mode icon on the progress line', () => {
  const cases: [Game, Mode][] = [
    ['dragHours', 'teach'],
    ['dragArrows', 'test'],
    ['setTime', 'teach'],
    ['setTime', 'test'],
  ]
  it.each(cases)('%s in %s shows the Mode icon just before the Mode name', async (game, mode) => {
    await open(game, mode)
    const line = wrapper.get('.task-no').element
    const icon = line.querySelector('svg')!
    expect(icon.classList).toContain(mode)
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    expect(icon.nextSibling?.textContent?.trim()).toBe(t(`modes.${mode}.name`))
  })
})
