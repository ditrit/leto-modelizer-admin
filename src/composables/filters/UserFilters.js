import StringFilter from 'src/composables/filters/StringFilter';
import PageFilter from 'src/composables/filters/PageFilter';
import CountFilter from 'src/composables/filters/CountFilter';

export default [
  new PageFilter(),
  new CountFilter(),
  new StringFilter('name', 'name', 'name'),
  new StringFilter('login', 'login', 'login'),
  new StringFilter('email', 'email', 'email'),
];
