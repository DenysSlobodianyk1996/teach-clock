<script setup lang="ts">
/**
 * The Privacy Page inside the app, in the interface language. The same text is also built into the
 * static `privacy.html` for Google Play's listing (src/privacy.ts).
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { CONTACT_EMAIL, PRIVACY_UPDATED, WEB_APP_URL } from '@/config'
import { formatPrivacyDate } from '@/privacy'
import { goBack } from '@/router'

const { t, locale } = useI18n()
const router = useRouter()

const updated = computed(() => formatPrivacyDate(locale.value === 'en' ? 'en' : 'uk'))
</script>

<template>
  <article class="privacy">
    <h1>{{ t('privacy.title') }}</h1>
    <p class="lead">{{ t('privacy.intro') }}</p>
    <ul>
      <li>{{ t('privacy.nothingSent') }}</li>
      <li>{{ t('privacy.onDevice') }}</li>
      <li>{{ t('privacy.results') }}</li>
      <li>
        {{ t('privacy.webVersion') }}
        <!-- In the Android App an outside link opens in the system browser. -->
        <a :href="WEB_APP_URL" target="_blank" rel="noopener">{{ WEB_APP_URL }}</a>
      </li>
      <li>
        {{ t('privacy.questions') }}
        <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
      </li>
    </ul>
    <p class="updated">
      {{ t('privacy.updated') }} <time :datetime="PRIVACY_UPDATED">{{ updated }}</time>
    </p>
    <div>
      <button class="btn" type="button" @click="goBack(router)">{{ t('privacy.back') }}</button>
    </div>
  </article>
</template>

<style scoped>
.privacy {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: min(100%, 720px);
  margin: 0 auto;
  padding: clamp(8px, 4cqi, 40px) clamp(20px, 6cqi, 64px) 40px;
}
h1 {
  margin: 0;
  font-size: clamp(32px, 4.7cqi, 48px);
  font-weight: 900;
  line-height: 1.08;
}
.lead {
  margin: 0;
  font-size: clamp(18px, 2cqi, 21px);
  font-weight: 700;
}
ul {
  margin: 0;
  padding-left: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: clamp(17px, 1.9cqi, 19px);
  line-height: 1.45;
}
a {
  color: inherit;
  font-weight: 700;
  text-underline-offset: 3px;
  overflow-wrap: anywhere;
}
.updated {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
}

@media (--phone) {
  .btn {
    width: 100%;
  }
}
</style>
