<script setup lang="ts">
/**
 * The Privacy Page's text in one language, one text per language (`privacy.*` in i18n). The app
 * screen (PrivacyView, /privacy-policy) shows it in the interface language with a Back button; the
 * static privacy/index.html for Google Play shows it in English and in Ukrainian with a link to the
 * game (src/privacyStatic.ts). The way back goes in the `back` slot.
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

/** Each section is a `<key>Title` heading and a `<key>` paragraph. */
const SECTIONS = ['noData', 'onDevice', 'noAds', 'children'] as const
const ISSUES_LABEL = ISSUES_URL.replace(/^https:\/\//, '')

const { t: translate } = useI18n()
const t = (key: string) => translate(key, {}, { locale: props.locale })

const subheading = computed(() => `h${props.headingLevel + 1}`)
const updated = computed(() => formatPrivacyDate(props.locale))
</script>

<template>
  <article class="privacy" :lang="locale">
    <header>
      <component :is="`h${headingLevel}`" class="title">{{ t('privacy.title') }}</component>
      <p class="game">{{ t('app.name') }}</p>
      <p class="updated">
        {{ t('privacy.updated') }} <time :datetime="PRIVACY_UPDATED">{{ updated }}</time>
      </p>
    </header>

    <section v-for="key in SECTIONS" :key="key">
      <component :is="subheading">{{ t(`privacy.${key}Title`) }}</component>
      <p>{{ t(`privacy.${key}`) }}</p>
    </section>

    <section>
      <component :is="subheading">{{ t('privacy.contactTitle') }}</component>
      <p>{{ t('privacy.contactIntro') }}</p>
      <ul>
        <li>
          {{ t('privacy.email') }}
          <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
        </li>
        <li>
          GitHub:
          <a :href="ISSUES_URL">{{ ISSUES_LABEL }}</a>
        </li>
      </ul>
    </section>

    <section>
      <component :is="subheading">{{ t('privacy.developerTitle') }}</component>
      <p class="author">{{ t('privacy.createdBy') }}</p>
    </section>

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
  font-size: clamp(17px, 1.9vw, 19px);
  font-size: clamp(17px, 1.9cqi, 19px);
  line-height: 1.45;
}
.title {
  margin: 0;
  font-size: clamp(32px, 4.7vw, 48px);
  font-size: clamp(32px, 4.7cqi, 48px);
  font-weight: 900;
  line-height: 1.08;
}
.game {
  margin: 6px 0 0;
  font-size: clamp(18px, 2vw, 21px);
  font-size: clamp(18px, 2cqi, 21px);
  font-weight: 700;
}
.updated {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 15px;
}
h2,
h3 {
  margin: 0 0 4px;
  font-size: clamp(19px, 2.1vw, 22px);
  font-size: clamp(19px, 2.1cqi, 22px);
  font-weight: 800;
  line-height: 1.25;
}
p {
  margin: 0;
}
ul {
  margin: 6px 0 0;
  padding-left: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
a {
  color: inherit;
  font-weight: 700;
  text-underline-offset: 3px;
  overflow-wrap: anywhere;
}
.author {
  font-weight: 700;
}

@media (--phone) {
  .back > :slotted(.btn) {
    width: 100%;
  }
}
</style>
