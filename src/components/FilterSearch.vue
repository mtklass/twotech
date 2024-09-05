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
        Columns to Show
        </v-row>
        <v-row justify="center" class="mt-4">
          <v-col>
            <v-switch color="primary" v-model="showNumSlotsColumn" label="Slots" />
          </v-col>
          <v-col>
            <v-switch color="primary" v-model="showSlotSizeColumn" label="Slot Size" />
          </v-col>
          <v-col>
            <v-switch color="primary" v-model="showClothingTypeColumn" label="Clothing Type" />
          </v-col>
          <v-col>
            <v-switch color="primary" v-model="showDifficultyColumn" label="Difficulty" />
          </v-col>
          <v-col>
            <v-switch color="primary" v-model="showCraftableColumn" label="Craftable" />
          </v-col>
          <v-col>
            <v-switch color="primary" v-model="showSpawnsInColumn" label="Spawns In" />
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
            <!-- Render the Object column with special handling for ObjectImage -->
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-center">
                  <v-list>
                    <v-list-item class="nostyle" :to="extraObjectData.find(o => o.name === item.Object).url">
                      <div class="image-container">
                        <ObjectImage :object="extraObjectData.find(o => o.name === item.Object)" />
                        {{ item.Object }}
                      </div>
                    </v-list-item>
                  </v-list>
                </td>

                <!-- Loop through the selected fields to dynamically render the <td> -->
                <td v-for="header in visibleHeaders" :key="header.key">
                  {{ item[header.key] }}
                </td>
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
    const showDifficultyColumn = ref(true);
    const showCraftableColumn = ref(false);
    const showSpawnsInColumn = ref(true);

    // Define the full set of headers/columns
    const allHeaders = [
      { title: "Slots", key: "Slots", visible: showNumSlotsColumn },
      { title: "Slot Size", key: "Slot Size", visible: showSlotSizeColumn },
      { title: "Clothing Type", key: "Clothing Type", visible: showClothingTypeColumn },
      { title: "Difficulty", key: "Difficulty", visible: showDifficultyColumn },
      { title: "Craftable", key: "Craftable", visible: showCraftableColumn },
      { title: "Spawns In", key: "Spawns In", visible: showSpawnsInColumn },
    ];

    // Dynamically compute the headers based on the column visibility
    const tableHeaders = computed(() => [
      { title: "Object", key: "Object" }, // Object column always visible
      ...allHeaders.filter((header) => header.visible.value),
    ]);

    const visibleHeaders = computed(() => allHeaders.filter((header) => header.visible.value));

    // // Dynamically compute table headers based on selected columns
    // const tableHeaders = computed(() => {
    //   const headers = [
    //     { title: 'Object', key: 'object' },
    //   ];

    //   if (showNumSlotsColumn.value) {
    //     headers.push({ title: 'Slots' });
    //   }
    //   if (showSlotSizeColumn.value) {
    //     headers.push({ title: 'Slot Size' });
    //   }
    //   if (showClothingTypeColumn.value) {
    //     headers.push({ title: 'Clothing Type' });
    //   }

    //   return headers;
    // });

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
        if (col === "Difficulty") dataToDisplay["Difficulty"] = object.difficulty;
        if (col === "Spawns In") dataToDisplay["Spawns In"] = object.biomes.join(", ");
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

    const filtered_items = ref(
      GameObject.allObjects()
        .filter(o => localHideUncraftable.value ? o.craftable : true)
        .map(o => displayed_data(o, visibleHeaders.value.map(h => h.key)))
    );

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
      showDifficultyColumn,
      showCraftableColumn,
      showSpawnsInColumn,
      tableHeaders,
      visibleHeaders,
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
