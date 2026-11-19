import { describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import {
  AppUpdateAvailability,
  AppUpdateResultCode,
  type AppUpdateInfo,
} from '@capawesome/capacitor-app-update'
import { createAppRouter } from '@/router'
import { playUpdateOffer, type PlayUpdates } from '../playUpdate'

const UPDATE: AppUpdateInfo = {
  currentVersionName: '1.0.0',
  currentVersionCode: '50',
  availableVersionCode: '51',
  updateAvailability: AppUpdateAvailability.UPDATE_AVAILABLE,
  immediateUpdateAllowed: true,
}
const NO_UPDATE: AppUpdateInfo = {
  ...UPDATE,
  availableVersionCode: undefined,
  updateAvailability: AppUpdateAvailability.UPDATE_NOT_AVAILABLE,
  immediateUpdateAllowed: false,
}

/** A fake Play that answers `info` and records each time its update screen opens. */
function fakePlay(info: () => Promise<AppUpdateInfo>) {
  return {
    getAppUpdateInfo: vi.fn(info),
    performImmediateUpdate: vi.fn(async () => ({ code: AppUpdateResultCode.CANCELED })),
  } satisfies PlayUpdates
}

async function routerOn(path: string) {
  setActivePinia(createPinia())
  const router = createAppRouter(createMemoryHistory())
  await router.push(path)
  return router
}

describe("Play's update screen in the Android App", () => {
  it('opens on Welcome when Play has a newer version', async () => {
    const play = fakePlay(async () => UPDATE)
    await playUpdateOffer(await routerOn('/'), play)()
    expect(play.performImmediateUpdate).toHaveBeenCalledTimes(1)
  })

  it('stays closed when there is nothing newer', async () => {
    const play = fakePlay(async () => NO_UPDATE)
    await playUpdateOffer(await routerOn('/'), play)()
    expect(play.performImmediateUpdate).not.toHaveBeenCalled()
  })

  it('stays closed when Play does not allow an immediate update', async () => {
    const play = fakePlay(async () => ({ ...UPDATE, immediateUpdateAllowed: false }))
    await playUpdateOffer(await routerOn('/'), play)()
    expect(play.performImmediateUpdate).not.toHaveBeenCalled()
  })

  it('finishes an update Play had started before the app was closed', async () => {
    const play = fakePlay(async () => ({
      ...UPDATE,
      updateAvailability: AppUpdateAvailability.UPDATE_IN_PROGRESS,
    }))
    await playUpdateOffer(await routerOn('/'), play)()
    expect(play.performImmediateUpdate).toHaveBeenCalledTimes(1)
  })

  it('asks once per start: after the Player closes it, coming back does not ask again', async () => {
    const play = fakePlay(async () => UPDATE)
    const offer = playUpdateOffer(await routerOn('/'), play)
    await offer()
    await offer()
    expect(play.performImmediateUpdate).toHaveBeenCalledTimes(1)
  })

  it('never opens off Welcome and Settings, so no Round is cut off', async () => {
    const play = fakePlay(async () => UPDATE)
    await playUpdateOffer(await routerOn('/privacy-policy'), play)()
    expect(play.getAppUpdateInfo).not.toHaveBeenCalled()
    expect(play.performImmediateUpdate).not.toHaveBeenCalled()
  })

  it('does not open if the Player left Welcome while Play was answering', async () => {
    const router = await routerOn('/')
    const play = fakePlay(async () => {
      await router.push('/privacy-policy')
      return UPDATE
    })
    await playUpdateOffer(router, play)()
    expect(play.performImmediateUpdate).not.toHaveBeenCalled()
  })

  it('ignores Play errors (not installed from Play, offline) and tries again next time', async () => {
    const play = fakePlay(async () => UPDATE)
    play.getAppUpdateInfo.mockRejectedValueOnce(new Error('Install Error(-10): not owned'))
    const offer = playUpdateOffer(await routerOn('/'), play)
    await expect(offer()).resolves.toBeUndefined()
    expect(play.performImmediateUpdate).not.toHaveBeenCalled()
    await offer()
    expect(play.performImmediateUpdate).toHaveBeenCalledTimes(1)
  })
})
