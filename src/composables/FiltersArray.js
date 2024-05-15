const defaultFilters = [
  {
    filterName: 'page',
    queryName: 'page',
    defaultValue: 0,
    getFilterValue: (value) => (value >= 1 ? value - 1 : null),
    getValueFromUrl: (value) => parseInt(value, 10) || 0,
    isDefaultValue: (value) => value <= 1,
  },
  {
    filterName: 'count',
    queryName: 'size',
    defaultValue: 10,
    getFilterValue: (value) => (value !== 10 ? value : null),
    getValueFromUrl: (value) => parseInt(value, 10) || 10,
    isDefaultValue: (value) => value === 10,
  },
];

const userFilters = [
  {
    filterName: 'name',
    queryName: 'name',
    defaultValue: '',
    getFilterValue: (value) => `lk_*${value}*`,
    getValueFromUrl: (value) => value,
    isDefaultValue: (value) => value?.length === 0 || !value,
  },
  {
    filterName: 'login',
    queryName: 'login',
    defaultValue: '',
    getFilterValue: (value) => `lk_*${value}*`,
    getValueFromUrl: (value) => value,
    isDefaultValue: (value) => value?.length === 0 || !value,
  },
  {
    filterName: 'email',
    queryName: 'email',
    defaultValue: '',
    getFilterValue: (value) => `lk_*${value}*`,
    getValueFromUrl: (value) => value,
    isDefaultValue: (value) => value?.length === 0 || !value,
  },
  ...defaultFilters,
];

const permissionFilters = [
  {
    filterName: 'entity',
    queryName: 'entity',
    defaultValue: '',
    getFilterValue: (value) => value,
    getValueFromUrl: (value) => value,
    isDefaultValue: (value) => value?.length === 0 || !value,
  },
  {
    filterName: 'action',
    queryName: 'action',
    defaultValue: '',
    getFilterValue: (value) => `lk_*${value}*`,
    getValueFromUrl: (value) => value,
    isDefaultValue: (value) => value?.length === 0 || !value,
  },
  {
    filterName: 'libraryId',
    queryName: 'libraryId',
    defaultValue: '',
    getFilterValue: (value) => `lk_*${value}*`,
    getValueFromUrl: (value) => value,
    isDefaultValue: (value) => value?.length === 0 || !value,
  },
  ...defaultFilters,
];

/**
 * Generate access control filters depending on sub type.
 * @param {string} subType - Sub type.
 * @returns {Array} Access control filters array.
 */
function getAccessControlFilters(subType = '') {
  const types = ['group', 'role'];
  const filterObject = {
    defaultValue: '',
    getFilterValue: (value) => `lk_*${value}*`,
    getValueFromUrl: (value) => value,
    isDefaultValue: (value) => value?.length === 0 || !value,
  };

  if (types.includes(subType)) {
    filterObject.filterName = 'parentName';
    filterObject.queryName = 'parentName';
  } else {
    filterObject.filterName = 'name';
    filterObject.queryName = 'name';
  }

  return [filterObject, ...defaultFilters];
}

const accessControlFilters = [
  {
    filterName: 'name',
    queryName: 'name',
    defaultValue: '',
    getFilterValue: (value) => `lk_*${value}*`,
    getValueFromUrl: (value) => value,
    isDefaultValue: (value) => value?.length === 0 || !value,
  },
  ...defaultFilters,
];

export {
  userFilters,
  permissionFilters,
  accessControlFilters,
  getAccessControlFilters,
};
