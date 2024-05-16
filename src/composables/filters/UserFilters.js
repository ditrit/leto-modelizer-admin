// example pour User filters si duplication dans Sonar

import StringFilter from 'src/composables/filters/StringFilter';
import PaginationFilters from 'src/composables/filters/PaginationFilters'; // à créer

export default [
  ...PaginationFilters, // à créer
  new StringFilter('name', 'name'),
  new StringFilter('login', 'login'),
  new StringFilter('email', 'email'),
];
