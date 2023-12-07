<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        {{ $t('ErrorNotFoundPage.text.title') }}
      </div>

      <div
        class="text-h2"
        style="opacity:.4"
      >
        {{ $t('ErrorNotFoundPage.text.content') }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="primary"
        unelevated
        to="/"
        :label="$t('ErrorNotFoundPage.text.goToHome')"
        no-caps
      />
    </div>
  </div>
</template>
