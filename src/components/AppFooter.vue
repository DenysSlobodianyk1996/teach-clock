<script setup lang="ts">
/**
 * The Footer of Welcome and Settings: a plain bar after the screen's content, never sticky.
 * App.vue shows it outside <main>, so the <footer> is the page's contentinfo landmark.
 */
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { CONTACT_EMAIL, CONTACT_SUBJECT } from '@/config'
import { isAndroidApp, supportUrl } from '@/platform'
import SupportButton from './SupportButton.vue'

const { t } = useI18n()

const contactHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`
</script>

<template>
  <footer class="footer">
    <nav class="links">
      <!-- An app screen in both builds, so it also opens offline and in the Android App. -->
      <RouterLink :to="{ name: 'privacy' }">{{ t('footer.privacy') }}</RouterLink>
      <a :href="contactHref">{{ t('footer.contact') }}</a>
    </nav>
    <!-- Web App only: Google Play forbids outside payments. No https:// link set, no button. -->
    <SupportButton v-if="!isAndroidApp && supportUrl" :url="supportUrl" />
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
