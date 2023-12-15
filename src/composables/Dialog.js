import { onMounted, onUnmounted, ref } from 'vue';
import DialogEvent from 'src/composables/DialogEvent';

/**
 * Composable that sets up specific dialog referenced by key.
 * @param {string} key - Dialog event key.
 * @param {CallableFunction} onOpen - Function to call to retrieve data from event.
 * @returns {{show: Ref<boolean>}} Object with ref boolean to open or close dialog.
 */
export function useDialog(key, onOpen) {
  const show = ref(false);
  let dialogEventSubscription;

  /**
   * Function to manage open/close dialog event.
   * @param {object} event - Dialog event.
   */
  function onDialogEvent(event) {
    if (event.key !== key) {
      return;
    }

    if (event.type === 'close') {
      show.value = false;
      return;
    }

    show.value = true;

    if (onOpen) {
      onOpen(event);
    }
  }

  onMounted(() => {
    dialogEventSubscription = DialogEvent.subscribe(onDialogEvent);
  });

  onUnmounted(() => {
    dialogEventSubscription.unsubscribe();
  });

  return { show };
}
