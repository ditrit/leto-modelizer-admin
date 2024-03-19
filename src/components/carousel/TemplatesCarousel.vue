<template>
  <q-carousel
    v-model="slide"
    swipeable
    animated
    control-type="flat"
    control-color="primary"
    navigation
    padding
    arrows
    height="200px"
    class="text-primary rounded-borders carousel"
  >
    <q-carousel-slide
      v-for="(schema, index) in schemas"
      :key="`${templateId}_${schema}`"
      :name="index+1"
      class="column no-wrap flex-center"
    >
      <div v-viewer>
        <template-schema-img
          :id="templateId"
          :index="index"
          width="100px"
        />
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script setup>
import TemplateSchemaImg from 'components/img/TemplateSchemaImg.vue';
import { ref } from 'vue';

const slide = ref(1);

defineProps({
  templateId: {
    type: String,
    required: true,
  },
  schemas: {
    type: Array,
    default: () => [],
  },
});
</script>
