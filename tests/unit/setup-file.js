// vitest.setup.ts'
import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';
import Vue3Sanitize from 'vue-3-sanitize';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes from 'src/router/routes';

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  messages,
});

const router = createRouter({
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

config.global.plugins = [router, i18n, Vue3Sanitize];
