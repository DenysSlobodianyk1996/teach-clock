// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { checkPermissions, listPermissions } from '../check-android-permissions.ts'

const manifest = (...permissions: string[]) => `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="app.teachclockforkids">
${permissions.join('\n')}
  <application android:label="@string/app_name" />
</manifest>`

const uses = (name: string) => `  <uses-permission android:name="${name}" />`

describe('listPermissions', () => {
  it('lists every requested permission, including the sdk-23 form and multi-line tags', () => {
    const xml = manifest(
      uses('android.permission.INTERNET'),
      `  <uses-permission-sdk-23 android:name="android.permission.CAMERA" />`,
      `  <uses-permission\n      android:name="android.permission.VIBRATE"\n      android:maxSdkVersion="30" />`,
    )
    expect(listPermissions(xml)).toEqual([
      'android.permission.INTERNET',
      'android.permission.CAMERA',
      'android.permission.VIBRATE',
    ])
  })

  it('ignores declared (not requested) permissions', () => {
    const xml = manifest(
      `  <permission android:name="app.teachclockforkids.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION" android:protectionLevel="signature" />`,
      uses('android.permission.INTERNET'),
    )
    expect(listPermissions(xml)).toEqual(['android.permission.INTERNET'])
  })
})

describe('checkPermissions', () => {
  it('passes the manifest Capacitor gives us', () => {
    const xml = manifest(
      uses('android.permission.INTERNET'),
      uses('app.teachclockforkids.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'),
    )
    expect(checkPermissions(xml).forbidden).toEqual([])
  })

  it.each([
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.ACCESS_COARSE_LOCATION',
    'android.permission.ACCESS_BACKGROUND_LOCATION',
    'com.google.android.gms.permission.AD_ID',
  ])('fails on %s', (name) => {
    const xml = manifest(uses('android.permission.INTERNET'), uses(name))
    expect(checkPermissions(xml).forbidden).toEqual([name])
  })

  it('skips a permission marked tools:node="remove"', () => {
    const xml = manifest(
      `  <uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove" />`,
    )
    expect(checkPermissions(xml).forbidden).toEqual([])
  })
})
