<template>
  <v-sheet class="mx-auto" theme="dark">
    <v-form @submit.prevent="submit">
      <v-container class="ga-0">
        <!-- Slot count filter -->
        <v-row class="mt-n6 mb-n14">
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

        <!-- Clothing type filter -->
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
            <v-btn :disabled="instaFilter" class="search-submit mt-2" type="submit" color="#blue" active-color="#bbb" button-disabled-opacity="0.26" block>Filter</v-btn>
          </v-col>
          <v-col cols="5">
            <div class="objectCraftableSelection">
              <v-switch color="primary" label="Only craftable" v-model="localHideUncraftable" @update:modelValue="updateHideUncraftable" />
            </div>
          </v-col>
        </v-row>

        <!-- Column selection controls -->
        <v-row justify="center" class="mt-4">
          <v-col cols="4">
            <v-switch color="primary" v-model="showNumSlotsColumn" label="Show Slots Column" />
          </v-col>
          <v-col cols="4">
            <v-switch color="primary" v-model="showSlotSizeColumn" label="Show Slot Size Column" />
          </v-col>
          <v-col cols="4">
            <v-switch color="primary" v-model="showClothingTypeColumn" label="Show Clothing Type Column" />
          </v-col>
        </v-row>

        <!-- Data Table -->
        <v-row>
          <v-data-table
            theme="dark"
            :items-per-page-options="[10, 20, 30, 40, 50]"
            :items="filtered_items"
            :headers="tableHeaders"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-center">
                  <v-list>
                    <v-list-item class="nostyle" :to="extraObjectData.find(o => o.name === item['Object']).url">
                      <div class="image-container">
                        <ObjectImage :object="extraObjectData.find(o => o.name === item['Object'])" />
                        {{ item['Object'] }}
                      </div>
                    </v-list-item>
                  </v-list>
                </td>

                <!-- Conditionally render columns -->
                <td v-if="showNumSlotsColumn">{{ item['Slots'] }}</td>
                <td v-if="showSlotSizeColumn">{{ item['Slot Size'] }}</td>
                <td v-if="showClothingTypeColumn">{{ item['Clothing Type'] }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-row>
      </v-container>
    </v-form>
  </v-sheet>
</template>

<script>
import { ref, computed, watch } from "vue";
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

    // New column visibility toggles
    const showNumSlotsColumn = ref(true);
    const showSlotSizeColumn = ref(true);
    const showClothingTypeColumn = ref(true);

    // Dynamically compute table headers based on selected columns
    const tableHeaders = computed(() => {
      const headers = [
        { title: 'Object' },
      ];

      if (showNumSlotsColumn.value) {
        headers.push({ title: 'Slots' });
      }
      if (showSlotSizeColumn.value) {
        headers.push({ title: 'Slot Size' });
      }
      if (showClothingTypeColumn.value) {
        headers.push({ title: 'Clothing Type' });
      }

      return headers;
    });

    const displayed_data = (object, colsToShow) => {
      const biome_names = ["Grasslands", "Swamps", "Yellow Prairies", "Badlands", "Tundra", "Desert", "Jungle", "Deep Water", "Flower Fields", "Shallow Water"];
      let dataToDisplay = {
        "Object": object.name,
      };
      for (let col of colsToShow) {
        if (col === "Slots") dataToDisplay["Slots"] = object.numSlots;
        if (col === "Slot Size") dataToDisplay["Slot Size"] = object.slotSize;
        if (col === "Clothing Type") dataToDisplay["Clothing Type"] = object.clothingType;
        if (col === "Craftable") dataToDisplay["Craftable"] = object.craftable;
        if (col === "Spawns In") dataToDisplay["Spawns In"] = object.biomes?.map(b=>biome_names[b.id]);
        if (col === "Immediate Food") dataToDisplay["Immediate Food"] = object.immediateFood;
        if (col === "Bonus Food") dataToDisplay["Bonus Food"] = object.bonusFood;
        if (col === "Total Food") dataToDisplay["Total Food"] = object.totalFood;
        if (col === "Uses") dataToDisplay["Uses"] = object.numUses;
        if (col === "Use Chance") dataToDisplay["Use Chance"] = object.useChance;
        if (col === "Insulation") dataToDisplay["Insulation"] = object.insulation;
        if (col === "Deadly From") dataToDisplay["Deadly From"] = object.deadlyDistance;
        if (col === "Use Distance") dataToDisplay["Use Distance"] = object.useDistance;
        if (col === "Item Size") dataToDisplay["Item Size"] = object.size;
        if (col === "Min Pickup Age") dataToDisplay["Min Pickup Age"] = object.minPickupAge;
        if (col === "Speed") dataToDisplay["Speed"] = object.speedMult;
        if (col === "Movement Type") dataToDisplay["Movement Type"] = object.moveType;
      }
      return dataToDisplay;
    };

    const defaultColsToShow = ["Object", "Slots", "Slot Size", "Clothing Type"];
    const filtered_items = ref(GameObject.allObjects().filter(o => localHideUncraftable.value ? o.craftable : true).map(o => displayed_data(o, defaultColsToShow)));

    const updateHideUncraftable = () => {
      props.toggleHideUncraftable();
    };

    const submitIfAuto = (event) => {
      if (instaFilter.value) {
        setupSubmit(event);
      }
    };

    const setupSubmit = (_event) => {
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

      let colsToShow = ["Object"];
      if (showNumSlotsColumn.value) colsToShow.push("Slots");
      if (showSlotSizeColumn.value) colsToShow.push("Slot Size");
      if (showClothingTypeColumn.value) colsToShow.push("Clothing Type");

      const results = GameObject.filter(filters).map(o => displayed_data(o, colsToShow));
      filtered_items.value = results;
    };

    watch(() => props.hideUncraftable, (newVal) => {
      localHideUncraftable.value = newVal;
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
      showNumSlotsColumn,
      showSlotSizeColumn,
      showClothingTypeColumn,
      tableHeaders,
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
  overflow: hidden;
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
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.text-center {
  text-align: center;
}
</style>
