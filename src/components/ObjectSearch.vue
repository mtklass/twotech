<template>
  <div class="objectSearch">
    <VueSelect
      label="lowerCaseName"
      :use-guessing-engine="true"
      :options="objects"
      v-model="selectedObject"
      @change="selectObject"
      placeholder="Search"
    >
      <template v-slot:option="option">
        <ObjectImage :object="option"/>
        {{option.name}}
      </template>
    </VueSelect>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GameObject from '../models/GameObject';

import VueSelect from './Select';
import ObjectImage from './ObjectImage';
import BrowserStorage from '../models/BrowserStorage';

export default {
  components: {
    VueSelect,
    ObjectImage,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const hideUncraftable = ref(
      BrowserStorage.getItem('ObjectBrowser.hideUncraftable') !== null
        ? BrowserStorage.getItem('ObjectBrowser.hideUncraftable') === 'true'
        : true
    );

    const selectedObject = ref(GameObject.find(route.params.id));
    const objects = computed(() => GameObject.byNameLength(hideUncraftable.value));

    watch(
      () => route.params.id,
      (newId) => {
        selectedObject.value = GameObject.find(newId);
      }
    );

    const selectObject = (object) => {
      if (object === selectedObject.value) return;
      router.push(object ? object.url() : '/');
    };

    return {
      selectedObject,
      objects,
      selectObject,
    };
  },
};
</script>

<style>
.objectSearch {
  margin-top: 20px;
}
.objectSearch .v-select .dropdown-toggle {
  background-color: #222;
  border: 2px solid #777;
}

.objectSearch .dropdown.v-select .dropdown-toggle * {
  color: #dcdcdc;
}

.objectSearch .dropdown.v-select .dropdown-menu {
  border: solid #777;
  background-color: #222;
  border-width: 0px 2px 2px 2px;
}

.objectSearch .dropdown.v-select .dropdown-menu li a {
  color: #dcdcdc;
}

.objectSearch .dropdown.v-select .dropdown-menu li.highlight > a {
  background-color: #333;
}

.objectSearch .dropdown.v-select .image {
  width: 35px;
  height: 35px;
}
</style>
