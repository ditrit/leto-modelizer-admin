<template>
  <q-dialog
    v-model="show"
    persistent
  >
    <q-card>
      <q-card-section class="flex row justify-center">
        <span class="text-h6 text-center">
          {{ $t('RedirectDialog.text.title') }}
        </span>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section
          class="row text-center"
          data-cy="redirect_warning"
        >
          {{ $t('RedirectDialog.text.content') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            :label="$t('RedirectDialog.text.redirect')"
            type="submit"
            color="positive"
            data-cy="button_redirect"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialog } from 'src/composables/Dialog';

const { show } = useDialog('redirect');

/**
 * Redirect to leto-modelizer.
 */
function onSubmit() {
  window.location.href = process.env.LETO_MODELIZER_URL;
}

</script>
