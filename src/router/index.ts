import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'

declare module 'vue-router' {
  interface RouteMeta {
    /** What must exist before this screen can open. */
    needs?: 'name' | 'round'
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
      { path: '/:pathMatch(.*)*', redirect: { name: 'welcome' } },
    ],
  })

  router.beforeEach((to) => {
    if (!to.meta.needs) return true
    if (!usePlayerStore().name) return { name: 'welcome' }
    if (to.meta.needs === 'round' && !usePlayStore().round) return { name: 'settings' }
    return true
  })

  return router
}
