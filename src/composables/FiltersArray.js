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

export { userFilters };
