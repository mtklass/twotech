<template>
  <div class="objectSearch">
    <VueSelect
      ref="VueSelectElem"
      label="lowerCaseName"
      :use-guessing-engine="true"
      :options="objects"
      v-model="selectedObject"
      @change="selectObject"
      :placeholder="placeholderVal"
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
    const VueSelectElem = ref(null);
    const placeholderVal = ref("Search");

    const hideUncraftable = ref(
      BrowserStorage.getItem('ObjectBrowser.hideUncraftable') !== null
        ? BrowserStorage.getItem('ObjectBrowser.hideUncraftable') === 'true'
        : true
    );
    const selectedObject = ref(GameObject.find(route.params.id));
    const objects = computed(() => GameObject.byNameLength(hideUncraftable.value));

    watch(
      (route, (to, from) => {
        VueSelectElem.value.search = "";
        if (Object.keys(route.params).length <= 0) {
          VueSelectElem.value.search = "";
          VueSelectElem.value.mutableValue = "";
          placeholderVal.value = "Search";
        } else {
          let newSelectedObject = GameObject.find(route?.params?.id.split('-')[0]);
          selectedObject.value = GameObject.find(route?.params?.id.split('-')[0]);
          VueSelectElem.value.search = newSelectedObject.name;
          VueSelectElem.value.mutableValue = newSelectedObject.name;
        }
      }),
    );

    const selectObject = (object) => {
      if (object === selectedObject.value) return;
      router.push(object ? object.url() : '/');
    };

    return {
      selectedObject,
      objects,
      selectObject,
      VueSelectElem,
      placeholderVal
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
