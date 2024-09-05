<template>
  <v-sheet class="mx-auto" theme="dark">
    <v-form @submit.prevent="submit">
      <v-container class="ga-0">
        <v-row class="mt-n6 mb-n14">
          <!-- Slot count filter -->
          <v-col cols="3">
            <v-switch color="primary" v-model="numSlotsEnabled" label="Slots" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!numSlotsEnabled" v-model="numSlotsMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!numSlotsEnabled" v-model="numSlotsMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>
        <!-- Slot size filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="slotSizeEnabled" label="Slot size" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!slotSizeEnabled" v-model="slotSizeMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!slotSizeEnabled" v-model="slotSizeMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>
        <!-- Slot size filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="clothingTypeEnabled" label="Clothing Type" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <v-switch label="Head" :disabled="!clothingTypeEnabled" v-model="clothingTypeHeadEnabled" @update:modelValue="submitIfAuto()"/>
              </v-col>
              <v-col>
                <v-switch label="Top" :disabled="!clothingTypeEnabled" v-model="clothingTypeTopEnabled" @update:modelValue="submitIfAuto()"/>
              </v-col>
              <v-col>
                <v-switch width="120px" label="Bottom" :disabled="!clothingTypeEnabled" v-model="clothingTypeBottomEnabled" @update:modelValue="submitIfAuto()"/>
              </v-col>
              <v-col>
                <v-switch label="Shoe" :disabled="!clothingTypeEnabled" v-model="clothingTypeShoeEnabled" @update:modelValue="submitIfAuto()"/>
              </v-col>
              <v-col>
                <v-switch label="Pack" :disabled="!clothingTypeEnabled" v-model="clothingTypePackEnabled" @update:modelValue="submitIfAuto()"/>
              </v-col>
              <v-col>
                <v-switch label="None" :disabled="!clothingTypeEnabled" v-model="clothingTypeNoneEnabled" @update:modelValue="submitIfAuto()"/>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- Insta-filter, Filter, and Hide uncraftable controls -->
        <v-row justify="center">
          <v-col cols="4" class="d-flex justify-end">
            <v-switch color="primary" label="Insta-filter" v-model="instaFilter" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col cols="3">
            <v-btn :disabled="instaFilter" class="search-submit mt-2" type="submit" color=#blue active-color=#bbb button-disabled-opacity="0.26" block>Filter</v-btn>
          </v-col>
          <v-col cols="5">
            <div class="objectCraftableSelection">
              <v-switch color="primary" label="Only craftable" v-model="localHideUncraftable" @update:modelValue="updateHideUncraftable" />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-data-table
            theme="dark"
            :items-per-page-options="[10,20,30,40,50]"
            :items="filtered_items">
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-center">
                  <v-list>
                    <v-list-item class="nostyle" :to="extraObjectData.find(o => o.name === item['Object']).url">
                      <div class="image-container">
                        <ObjectImage
                          :object="extraObjectData.find(o => o.name === item['Object'])"
                        />
                        {{ item['Object'] }}
                      </div>
                    </v-list-item>
                  </v-list>
                </td>
                <td>{{ item['Difficulty'] }}</td>
                <td>{{ item['Slots'] }}</td>
                <td>{{ item['Slot Size'] }}</td>
                <td>{{ item['Clothing Type'] }}</td>
                <td>{{ item['Craftable'] }}</td>
                <td>{{ item['Spawns In']?.join(', ') }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-row>
      </v-container>
    </v-form>
  </v-sheet>
</template>

<script>
import { ref, watch } from "vue";
import GameObject from '../models/GameObject';
import ObjectImage from "./ObjectImage";
import BrowserStorage from '../models/BrowserStorage';


export default {
  components: {
    ObjectImage,
  },
  props: {
    hideUncraftable: Boolean,
    toggleHideUncraftable: Function,
  },
  setup(props, { emit }) {
    const instaFilter = ref(true);
    const localHideUncraftable = ref(props.hideUncraftable); // Local reference to hideUncraftable
    const extraObjectData = GameObject.allExtraObjectsData().map(obj_data => { return {...obj_data, url: GameObject.find(obj_data.id).url()} });

    const numSlotsEnabled = ref(false);
    const numSlotsMin = ref(0);
    const numSlotsMax = ref(27);

    const slotSizeEnabled = ref(false);
    const slotSizeMin = ref(0);
    const slotSizeMax = ref(3);

    const clothingTypeEnabled = ref(false);
    const clothingTypeHeadEnabled = ref(true);
    const clothingTypeTopEnabled = ref(true);
    const clothingTypeBottomEnabled = ref(true);
    const clothingTypeShoeEnabled = ref(true);
    const clothingTypePackEnabled = ref(true);
    const clothingTypeNoneEnabled = ref(true);

    const displayed_data = (object) => {
      const biome_names = ["Grasslands", "Swamps", "Yellow Prairies", "Badlands", "Tundra", "Desert", "Jungle", "Deep Water", "Flower Fields", "Shallow Water"];
      return {
          "Object": object.name,
          "Difficulty": object.difficulty,
          "Slots": object.numSlots,
          "Slot Size": object.slotSize,
          "Clothing Type": object.clothingType,
          "Craftable": object.craftable,
          "Spawns In": object.biomes?.map(b=>biome_names[b.id]),
        }
    }

    const filtered_items = ref(GameObject.allObjects().filter(o => localHideUncraftable.value ? o.craftable : true).map(o => displayed_data(o)));

    const updateHideUncraftable = () => {
      props.toggleHideUncraftable();
    };

    const submitIfAuto = (event) => {
      if (instaFilter.value) {
        setupSubmit(event);
      }
    }

    const setupSubmit = (_event) => {
      // console.log("event = ", JSON.stringify(event.target.elements));
      // We need to construct some filters to send to GameObject.js's filter() function
      let filters = [];
      if (localHideUncraftable.value) {
        filters.push({
          name: "hideUncraftable",
          toggled: true,
        })
      }
      if (numSlotsEnabled.value) {
        filters.push({
          name: "numSlots",
          min: numSlotsMin.value,
          max: numSlotsMax.value,
        });
      }
      if (slotSizeEnabled.value) {
        filters.push({
          name: "slotSize",
          min: slotSizeMin.value,
          max: slotSizeMax.value,
        });
      }
      if (clothingTypeEnabled.value) {
        filters.push({
          name: "clothingType",
          includeHeadItems: clothingTypeHeadEnabled.value,
          includeTopItems: clothingTypeTopEnabled.value,
          includeBottomItems: clothingTypeBottomEnabled.value,
          includeShoeItems: clothingTypeShoeEnabled.value,
          includePackItems: clothingTypePackEnabled.value,
          includeNoneItems: clothingTypeNoneEnabled.value,
        })
      }
      console.time("Filtering");
      const results = GameObject.filter(filters).map(o => {
        return displayed_data(o);
      });
      console.timeEnd("Filtering");
      filtered_items.value = results;
    };

    watch(() => props.hideUncraftable, (newVal) => {
      localHideUncraftable.value = newVal; // Watch the parent value and update locally
      setupSubmit();
    });

    return {
      instaFilter,
      setupSubmit,
      submitIfAuto,
      filtered_items,
      numSlotsEnabled,
      numSlotsMin,
      numSlotsMax,
      slotSizeEnabled,
      slotSizeMin,
      slotSizeMax,
      clothingTypeEnabled,
      clothingTypeHeadEnabled,
      clothingTypeTopEnabled,
      clothingTypeBottomEnabled,
      clothingTypeShoeEnabled,
      clothingTypePackEnabled,
      clothingTypeNoneEnabled,
      extraObjectData,
      localHideUncraftable,
      updateHideUncraftable,
    }
  },
  methods: {
    async submit(event) {
      this.setupSubmit(event);
    },
  }
}
</script>

<style lang="scss" scoped>
.search-submit {
  color: #fff;
  background-color: #999;

  &:hover {
    background-color: #bbb;
  }

  &[disabled] {
    opacity: 0.26;
    cursor: not-allowed;
  }
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Ensure the image stays within the bounds */

  height: 80px;
  width: 160px;

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #333;
  border: 1px solid transparent;
}

.image-container img {
  max-height: 100%; /* Scale down the image to fit the container */
  max-width: 100%; /* Ensure it doesn't overflow horizontally */
  object-fit: contain; /* Keep the aspect ratio */
}


.text-center {
  text-align: center;
}
</style>