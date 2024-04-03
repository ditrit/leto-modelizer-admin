<template>
  <q-table
    class="shadow-5"
    table-header-class="bg-grey-3"
    row-key="id"
    :pagination="pagination"
    :columns="columns"
    :rows="templates"
    data-cy="templates_table"
  >
    <template #header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            flat
            round
            dense
            size="sm"
            color="primary"
            :icon="props.expand ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'"
            @click="props.expand = !props.expand"
          />
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          <template v-if="col.name === 'icon'">
            <template-avatar
              v-if="col.value"
              :id="props.row.id"
            />
          </template>
          <template v-else-if="col.name === 'documentationUrl'">
            <a
              :href="col.value"
              target="_blank"
            >
              {{ col.value }}
            </a>
          </template>
          <template v-else-if="col.name === 'type'">
            {{ $t(`TemplateTypes.text.${col.value}`) }}
          </template>
          <template v-else>
            {{ col.value }}
          </template>
        </q-td>
      </q-tr>
      <q-tr
        v-show="props.expand"
        :props="props"
      >
        <q-td
          colspan="100%"
        >
          <div class="flex justify-center">
            <templates-carousel
              :template-id="props.row.id.toString()"
              :schemas="props.row.schemas"
              style="max-width: 250px"
            />
          </div>
        </q-td>
      </q-tr>
    </template>
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm">
        <q-icon
          size="2em"
          :name="$t('TemplatesTable.icon.noData')"
        />
        <span>
          {{ $t('TemplatesTable.text.noData') }}
        </span>
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TemplateAvatar from 'components/avatar/TemplateAvatar.vue';
import TemplatesCarousel from 'components/carousel/TemplatesCarousel.vue';

defineProps({
  templates: {
    type: Array,
    required: true,
  },
});

const { t } = useI18n();
const pagination = ref({
  rowsPerPage: 0, // infinite
});
const columns = ref([{
  name: 'icon',
  required: true,
  label: t('TemplatesTable.text.iconColumn'),
  align: 'left',
  field: 'icon',
  classes: 'template-icon',
}, {
  name: 'name',
  required: true,
  label: t('TemplatesTable.text.nameColumn'),
  align: 'left',
  field: 'name',
  classes: 'template-name',
}, {
  name: 'type',
  required: true,
  label: t('TemplatesTable.text.typeColumn'),
  align: 'left',
  field: 'type',
  classes: 'template-type',
}, {
  name: 'description',
  required: true,
  label: t('TemplatesTable.text.descriptionColumn'),
  align: 'left',
  field: 'description',
  classes: 'template-description',
}, {
  name: 'plugins',
  required: true,
  label: t('TemplatesTable.text.pluginsColumn'),
  align: 'left',
  field: 'plugins',
  classes: 'template-plugins',
}, {
  name: 'documentationUrl',
  required: true,
  label: t('TemplatesTable.text.documentationUrlColumn'),
  align: 'left',
  field: 'documentationUrl',
  classes: 'template-documentationUrl',
}]);
</script>
