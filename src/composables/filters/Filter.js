class Filter {
  constructor(filterName, serverName, queryName, defaultValue) {
    this.filterName = filterName;
    this.serverName = serverName;
    this.queryName = queryName;
    this.defaultValue = defaultValue;
  }

  getFilterValue(value) {
    return value;
  }

  getValueFromUrl(value) {
    return value;
  }

  isDefaultValue(value) {
    return value?.length === 0 || !value;
  }
}

export default Filter;
