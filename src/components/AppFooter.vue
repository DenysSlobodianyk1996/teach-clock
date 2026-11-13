<script setup lang="ts">
/**
 * The Footer of Welcome and Settings: a plain bar after the screen's content, never sticky.
 * Inside <main> a <footer> is no landmark by default, so it says it is the page footer.
 */
import { useI18n } from 'vue-i18n'
import { CONTACT_EMAIL, CONTACT_SUBJECT } from '@/config'

const { t } = useI18n()

// The Privacy Page is static HTML in public/, served next to the app under its base.
const privacyHref = `${import.meta.env.BASE_URL}privacy.html`
const contactHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`
</script>

<template>
  <footer class="footer" role="contentinfo">
    <nav class="links">
      <a :href="privacyHref" target="_blank" rel="noopener">{{ t('footer.privacy') }}</a>
      <a :href="contactHref">{{ t('footer.contact') }}</a>
    </nav>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px 24px;
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
