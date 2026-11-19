<script setup lang="ts">
/**
 * The Privacy Page's text in one language. The app screen (PrivacyView) shows it in the interface
 * language with a Back button; the static privacy.html for Google Play shows it in Ukrainian and in
 * English with a link to the game (src/privacyStatic.ts). The way back goes in the `back` slot.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CONTACT_EMAIL, ISSUES_URL } from '@/config'
import { formatPrivacyDate, PRIVACY_UPDATED, type PrivacyLocale } from '@/privacy'

const props = withDefaults(
  defineProps<{
    locale: PrivacyLocale
    /** 1 for the page's first language; the static page's second language is a 2. */
    headingLevel?: 1 | 2
  }>(),
  { headingLevel: 1 },
)

const { t: translate } = useI18n()
const t = (key: string) => translate(key, {}, { locale: props.locale })

const updated = computed(() => formatPrivacyDate(props.locale))
</script>

<template>
  <article class="privacy" :lang="locale">
    <component :is="`h${headingLevel}`" class="title">{{ t('privacy.title') }}</component>
    <p class="lead">{{ t('privacy.intro') }}</p>
    <ul>
      <li>{{ t('privacy.nothingSent') }}</li>
      <li>{{ t('privacy.onDevice') }}</li>
      <li>{{ t('privacy.results') }}</li>
      <li>
        {{ t('privacy.questions') }}
        <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
        {{ t('privacy.or') }}
        <a :href="ISSUES_URL">{{ ISSUES_URL.replace('https://', '') }}</a>
      </li>
    </ul>
    <p class="author">{{ t('privacy.createdBy') }}</p>
    <p class="updated">
      {{ t('privacy.updated') }} <time :datetime="PRIVACY_UPDATED">{{ updated }}</time>
    </p>
    <div class="back">
      <slot name="back" :label="t('privacy.back')" />
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
  padding: clamp(8px, 4vw, 40px) clamp(20px, 6vw, 64px) 40px;
  padding: clamp(8px, 4cqi, 40px) clamp(20px, 6cqi, 64px) 40px;
}
.title {
  margin: 0;
  font-size: clamp(32px, 4.7vw, 48px);
  font-size: clamp(32px, 4.7cqi, 48px);
  font-weight: 900;
  line-height: 1.08;
}
.lead {
  margin: 0;
  font-size: clamp(18px, 2vw, 21px);
  font-size: clamp(18px, 2cqi, 21px);
  font-weight: 700;
}
ul {
  margin: 0;
  padding-left: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: clamp(17px, 1.9vw, 19px);
  font-size: clamp(17px, 1.9cqi, 19px);
  line-height: 1.45;
}
a {
  color: inherit;
  font-weight: 700;
  text-underline-offset: 3px;
  overflow-wrap: anywhere;
}
.author {
  margin: 0;
  font-size: clamp(17px, 1.9vw, 19px);
  font-size: clamp(17px, 1.9cqi, 19px);
  font-weight: 700;
}
.updated {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
}

@media (--phone) {
  .back > :slotted(.btn) {
    width: 100%;
  }
}
</style>
