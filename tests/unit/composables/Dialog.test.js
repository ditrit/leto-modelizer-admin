import { mount } from '@vue/test-utils';
import { useDialog } from 'src/composables/Dialog';
import DialogEvent from 'src/composables/events/DialogEvent';
import { vi } from 'vitest';

vi.mock('src/composables/events/DialogEvent');

describe('Test: Dialog', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  /**
   * Mount component with composable.
   * @param {Function} callback - Callback used by the component.
   */
  function mountComponent(callback = undefined) {
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    DialogEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = mount({
      template: '<div id="dialog" v-if="show"></div>',
      components: { useDialog },
      setup() {
        return useDialog('test', callback);
      },
    });

    wrapper.vm.show = false;
  }

  describe('Test function: onDialogEvent', () => {
    it('should not open dialog when the key is invalid', () => {
      mountComponent();

      DialogEvent.next({ key: 'invalid' });

      expect(wrapper.vm.show).toBeFalsy();
    });

    it('should open dialog when the key is valid', () => {
      mountComponent(() => {
        expect(wrapper.vm.show).toBeTruthy();
      });

      DialogEvent.next({ key: 'test' });
    });

    it('should close dialog when the key is valid and event type is close', () => {
      mountComponent(() => {
        expect(wrapper.vm.show).toBeFalsy();
      });

      wrapper.vm.show = true;

      DialogEvent.next({ key: 'test', type: 'close' });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DialogEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe DialogEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
