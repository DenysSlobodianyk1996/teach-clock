<script setup lang="ts">
/**
 * The Footer of Welcome and Settings: a plain bar after the screen's content, never sticky.
 * App.vue shows it outside <main>, so the <footer> is the page's contentinfo landmark.
 */
import { useI18n } from 'vue-i18n'
import { CONTACT_EMAIL, CONTACT_SUBJECT } from '@/config'
import { PRIVACY_PAGE } from '@/static/privacy'

const { t } = useI18n()

// Base-relative, so it works under /teach-clock/ on Pages and at / in the Android App.
const privacyHref = `${import.meta.env.BASE_URL}${PRIVACY_PAGE}`
const contactHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`
</script>

<template>
  <footer class="footer">
    <nav class="links">
      <!-- The static Privacy Page, bundled with the app: it opens offline and in the Android App. -->
      <a :href="privacyHref">{{ t('footer.privacy') }}</a>
      <a :href="contactHref">{{ t('footer.contact') }}</a>
    </nav>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  padding: 8px 20px 12px;
  border-top: 1px solid var(--line);
}
.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 20px;
}
.links a {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: var(--muted);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.links a:hover {
  color: var(--text);
}
</style>
