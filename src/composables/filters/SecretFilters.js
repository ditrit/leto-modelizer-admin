import StringFilter from 'src/composables/filters/StringFilter';
import PageFilter from 'src/composables/filters/PageFilter';
import CountFilter from 'src/composables/filters/CountFilter';

export default [
  new PageFilter(),
  new CountFilter(),
  new StringFilter('key', 'key', 'key'),
];
