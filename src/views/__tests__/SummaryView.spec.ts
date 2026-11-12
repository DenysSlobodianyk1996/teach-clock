import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import SummaryView from '../SummaryView.vue'
import { mountScreen } from '@/test/mountScreen'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'
import { clockTime, formatClockTime } from '@/game/clockTime'
import { currentTask, type ClockRound } from '@/game/round'
import type { Level, Mode } from '@/game/settings'
import { seededRandom } from '@/game/tasks'
import { t } from '@/test/i18n'

/** Plays a Set Time Round, answering the first `wrong` Tasks with 12:59 (fixed at once in Teach). */
function playRound(mode: Mode, wrong: number, level: Level = 15) {
  return () => {
    usePlayerStore().setName('Оля')
    const play = usePlayStore()
    Object.assign(play.settings, { game: 'setTime', mode, level })
    play.startRound(seededRandom(9))
    for (let i = 0; i < 10; i++) {
      const answer = currentTask(play.round!)!.answer
      if (i < wrong) play.submitAnswer(clockTime(12, 59))
      if (mode === 'test' && i < wrong) continue
      play.submitAnswer(answer)
    }
  }
}

/** Drag Hours in Test: fills the face with 4 and 5 swapped, or perfectly, then submits. */
function submitDragHours(swap: boolean) {
  return () => {
    usePlayerStore().setName('Оля')
    const play = usePlayStore()
    Object.assign(play.settings, { game: 'dragHours', mode: 'test' })
    play.startRound(seededRandom(9))
    for (let n = 1; n <= 12; n++) play.dropNumber(n, swap && n === 4 ? 5 : swap && n === 5 ? 4 : n)
    play.submitPlacements()
  }
}

/** Places every number, the first `wrong` of them after a drop on the slot two along. */
function playDragHours(wrong: number) {
  return () => {
    usePlayerStore().setName('Оля')
    const play = usePlayStore()
    play.settings.game = 'dragHours'
    play.startRound(seededRandom(9))
    for (let n = 1; n <= 12; n++) {
      if (n <= wrong) play.dropNumber(n, ((n + 1) % 12) + 1)
      play.dropNumber(n, n)
    }
  }
}

const tasks = () => (usePlayStore().round as ClockRound).tasks
const button = (wrapper: VueWrapper, text: string) =>
  wrapper.findAll('button').find((b) => b.text() === text)!

describe('Summary screen', () => {
  it('cheers the Player and gives the headline with the Settings played', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playRound('test', 2))
    expect(wrapper.get('h1').text()).toBe(t('summary.headline', { right: 8, total: 10 }))
    expect(wrapper.get('.details').text()).toBe(
      [
        t('summary.cheer', { name: 'Оля' }),
        t('games.setTime.name'),
        t('modes.test.name'),
        t('levels.15.name'),
      ].join(' · '),
    )
    expect(wrapper.findAll('.dots .dot.ok')).toHaveLength(8)
  })

  it('shows Right Tasks as small clocks', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playRound('test', 2))
    const right = wrapper.get('[aria-labelledby="right-title"]')
    expect(right.get('h2').text()).toBe(`${t('summary.right')} · 8`)
    expect(right.findAll('li > span').map((span) => span.text())).toEqual(
      tasks()
        .slice(2)
        .map((task) => formatClockTime(task.answer)),
    )
    expect(right.findAll('li svg.clock')).toHaveLength(8)
  })

  it('in Test, pairs each wrong Task’s Answer with the correct clock', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playRound('test', 2))
    const wrong = wrapper.get('[aria-labelledby="wrong-title"]')
    expect(wrong.get('h2').text()).toBe(`${t('summary.wrong')} · 2`)
    expect(wrong.findAll('li .sr-only').map((span) => span.text())).toEqual(
      tasks()
        .slice(0, 2)
        .map((task) =>
          t('summary.pair', {
            caption: t('summary.yourAnswer'),
            first: '12:59',
            answer: formatClockTime(task.answer),
          }),
        ),
    )
    expect(wrong.findAll('li svg.clock')).toHaveLength(4)
    expect(wrapper.find('[data-lit-tick]').exists()).toBe(false)
    expect(wrapper.find('.c-num.lit').exists()).toBe(false)
  })

  it('shows each pair as the Player’s answer, a decorative arrow, then the correct clock', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playRound('test', 1))
    const pair = wrapper.get('[aria-labelledby="wrong-title"] li')
    const parts = pair.findAll(':scope > [aria-hidden="true"]')
    expect(parts.map((part) => part.classes()[0])).toEqual(['side', 'arrow', 'side'])
    expect(parts[0]!.get('s').text()).toBe('12:59')
    expect(parts[2]!.get('b').text()).toBe(formatClockTime(tasks()[0]!.answer))
  })

  it('in Teach, lists helped Tasks under Wrong with the first try', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playRound('teach', 1))
    expect(wrapper.get('h1').text()).toBe(t('summary.headline', { right: 9, total: 10 }))
    expect(wrapper.get('[aria-labelledby="wrong-title"] li .sr-only').text()).toBe(
      t('summary.pair', {
        caption: t('summary.firstTry'),
        first: '12:59',
        answer: formatClockTime(tasks()[0]!.answer),
      }),
    )
  })

  it('after a perfect Round, says there are no mistakes and nudges to a smaller Level', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playRound('test', 0, 15))
    expect(wrapper.find('[aria-labelledby="wrong-title"]').exists()).toBe(false)
    expect(wrapper.get('.perfect-note').text()).toBe(
      `${t('summary.perfect')} ${t('summary.tryLevel', { level: t('levels.5.name') })}`,
    )
  })

  it('at the smallest Level, nudges to another Game or Mode instead', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playRound('test', 0, 1))
    expect(wrapper.get('.perfect-note').text()).toBe(
      `${t('summary.perfect')} ${t('summary.tryOther')}`,
    )
  })

  it('celebrates with confetti', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playRound('test', 2))
    expect(wrapper.get('svg.confetti').attributes('aria-hidden')).toBe('true')
  })

  it('for Drag Hours, lists numbers and shows where a helped number was first dropped', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', playDragHours(1))
    expect(wrapper.get('h1').text()).toBe(t('summary.headline', { right: 11, total: 12 }))
    const right = wrapper.findAll('[aria-labelledby="right-title"] li').map((li) => li.text())
    expect(right).toEqual(['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    const pair = wrapper.get('[aria-labelledby="wrong-title"] li')
    expect(pair.get('.sr-only').text()).toBe(
      `${t('summary.numberFirst', { caption: t('summary.firstTry'), number: 1, slot: 3 })}. ${t('numbers.between', { number: 1, before: 12, after: 2 })}`,
    )
    expect(pair.findAll('[data-slot="3"]')).toHaveLength(1)
    expect(pair.findAll('[data-slot="1"]')).toHaveLength(1)
  })

  it('for Drag Hours in Test, shows the Player’s face next to the correct one', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', submitDragHours(true))
    expect(wrapper.get('h1').text()).toBe(t('summary.numbersHeadline', { right: 10, total: 12 }))
    const [mine, correct] = wrapper.findAll('.face-card')
    expect(mine!.get('svg').attributes('aria-label')).toBe(
      t('summary.yourFaceLabel', { numbers: '4, 5' }),
    )
    expect(mine!.get('[data-slot="4"]').text()).toBe('5')
    expect(mine!.findAll('.marked').map((g) => g.attributes('data-slot'))).toEqual(['4', '5'])
    expect(correct!.get('[data-slot="4"]').text()).toBe('4')
    expect(correct!.findAll('.good').map((g) => g.text())).toEqual(['4', '5'])
    expect(correct!.findAll('li').map((li) => li.text())).toEqual([
      t('numbers.between', { number: 4, before: 3, after: 5 }),
      t('numbers.between', { number: 5, before: 4, after: 6 }),
    ])
    expect(wrapper.find('[aria-labelledby="wrong-title"]').exists()).toBe(false)
  })

  it('for a perfect Drag Hours Test, says so under the two faces', async () => {
    const { wrapper } = await mountScreen(SummaryView, '/summary', submitDragHours(false))
    expect(wrapper.find('.marked').exists()).toBe(false)
    expect(wrapper.get('.perfect-note').text()).toBe(
      `${t('summary.perfect')} ${t('summary.tryOther')}`,
    )
  })

  it('plays again with the same Settings', async () => {
    const { wrapper, router } = await mountScreen(SummaryView, '/summary', playRound('test', 2))
    await button(wrapper, t('summary.playAgain')).trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('round'))
    expect(usePlayStore().round).toMatchObject({ game: 'setTime', mode: 'test', current: 0 })
  })

  it('goes back to Settings and drops the Round', async () => {
    const { wrapper, router } = await mountScreen(SummaryView, '/summary', playRound('test', 2))
    await button(wrapper, t('summary.toSettings')).trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('settings'))
    expect(usePlayStore().round).toBeNull()
  })
})
