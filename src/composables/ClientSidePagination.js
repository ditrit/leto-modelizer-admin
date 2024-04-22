import {
  ref,
  computed,
  watch,
} from 'vue';

/**
 * Composable that provides all values for client side pagination.
 * @param {Array} items - Items that need to be paginated.
 * @returns {object} Object with all pagination values, each value is either a ref or a computed.
 */
export function useClientSidePagination(items) {
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const paginatedItems = computed(() => {
    const start = (currentPage.value * itemsPerPage.value) - itemsPerPage.value;
    const end = (itemsPerPage.value * currentPage.value);

    return items.slice(start, end);
  });

  const pages = computed(() => Math.ceil(items.length / itemsPerPage.value));

  watch(() => itemsPerPage.value, async () => {
    currentPage.value = 1;
  });

  return {
    paginatedItems,
    pages,
    currentPage,
    itemsPerPage,
  };
}
