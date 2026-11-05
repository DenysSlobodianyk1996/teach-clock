import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'

declare module 'vue-router' {
  interface RouteMeta {
    /** What must exist before this screen can open. */
    needs?: 'name' | 'round' | 'summary'
  }
}

export function createAppRouter(
  history: RouterHistory = createWebHistory(import.meta.env.BASE_URL),
) {
  const router = createRouter({
    history,
    routes: [
      { path: '/', name: 'welcome', component: () => import('@/views/WelcomeView.vue') },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { needs: 'name' },
      },
      {
        path: '/round',
        name: 'round',
        component: () => import('@/views/RoundView.vue'),
        meta: { needs: 'round' },
      },
      {
        path: '/summary',
        name: 'summary',
        component: () => import('@/views/SummaryView.vue'),
        meta: { needs: 'summary' },
      },
      { path: '/:pathMatch(.*)*', redirect: { name: 'welcome' } },
    ],
  })

  router.beforeEach((to, from) => {
    // Leaving a Round in play (browser Back, a typed URL) asks first, like the Leave button.
    // The Leave button throws the Round away before navigating, so it passes.
    const play = usePlayStore()
    if (from.name === 'round' && play.round && !play.summary && to.name !== 'round') {
      play.askingToLeave = true
      return false
    }
    if (!to.meta.needs) return true
    if (!usePlayerStore().name) return { name: 'welcome' }
    if (to.meta.needs === 'name') return true
    const { round, summary } = play
    if (!round) return { name: 'settings' }
    // A Round only moves forward: once finished it shows its Summary, and not before.
    if (to.meta.needs === 'round' && summary) return { name: 'summary' }
    if (to.meta.needs === 'summary' && !summary) return { name: 'round' }
    return true
  })

  return router
}
