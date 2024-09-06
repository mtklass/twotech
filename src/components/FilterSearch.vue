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
            <v-checkbox density="compact" class="filterCheckbox" v-model="showNumSlots" label="Slots" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showSlotSize" label="Slot Size" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showClothingType" label="Clothing Type" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showDifficulty" label="Difficulty" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showCraftable" label="Craftable" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showSpawnsIn" label="Spawns In" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showImmediateFood" label="Immediate Food" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showBonusFood" label="Bonus Food" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showTotalFood" label="Total Food" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showUses" label="Uses" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showUseChance" label="Use Chance" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showInsulation" label="Insulation" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showDeadlyFrom" label="Deadly From" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showUseDistance" label="Use Distance" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showItemSize" label="Item Size" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showMinPickupAge" label="Min Pickup Age" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showSpeed" label="Speed" />
            <v-checkbox density="compact" class="filterCheckbox" v-model="showMovementType" label="Movement Type" />
        </v-row>

        <!-- Data Table -->
        <v-row>
          <v-data-table
            theme="dark"
            :items-per-page-options="[10, 20, 30, 40, 50]"
            :items="filtered_items"
            :headers="tableHeaders"
            height="90vh"
            fixed-header
          >
            <!-- Render the Object column with special handling for ObjectImage -->
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-center" style="width: 170px; min-width: 170px; max-width: 170px">
                  <v-list>
                    <v-list-item class="nostyle" :to="extraObjectData.find(o => o.name === item.Object).url">
                      <div class="image-container">
                        <ObjectImage :object="extraObjectData.find(o => o.name === item.Object)" />
                        {{ item.Object }}
                      </div>
                    </v-list-item>
                  </v-list>
                </td>

                <!-- Loop through the selected fields to dynamically render the <td> with static width -->
                <td v-for="header in visibleHeaders" :key="header.key" :style="{ width: header.width }">
                  <div class="text-wrapper">{{ item[header.key] }}</div>
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
    const showNumSlots = ref(true);
    const showSlotSize = ref(true);
    const showClothingType = ref(true);
    const showDifficulty = ref(true);
    const showCraftable = ref(false);
    const showSpawnsIn = ref(true);
    const showImmediateFood = ref(false);
    const showBonusFood = ref(false);
    const showTotalFood = ref(false);
    const showUses = ref(false);
    const showUseChance = ref(false);
    const showInsulation = ref(false);
    const showDeadlyFrom = ref(false);
    const showUseDistance = ref(false);
    const showItemSize = ref(false);
    const showMinPickupAge = ref(false);
    const showSpeed = ref(false);
    const showMovementType = ref(false);

    // Define the full set of headers/columns
    const allHeaders = [
      { title: "Slots", key: "Slots", visible: showNumSlots, width: '80px' },
      { title: "Slot Size", key: "Slot Size", visible: showSlotSize, width: '80px' },
      { title: "Clothing Type", key: "Clothing Type", visible: showClothingType, width: '100px' },
      { title: "Difficulty", key: "Difficulty", visible: showDifficulty, width: '100px' },
      { title: "Craftable", key: "Craftable", visible: showCraftable, width: '100px' },
      { title: "Spawns In", key: "Spawns In", visible: showSpawnsIn, width: '200px' },
      { title: "Immediate Food", key: "Immediate Food", visible: showImmediateFood, width: '80px' },
      { title: "Bonus Food", key: "Bonus Food", visible: showBonusFood, width: '80px' },
      { title: "Total Food", key: "Total Food", visible: showTotalFood, width: '80px' },
      { title: "Uses", key: "Uses", visible: showUses, width: '80px' },
      { title: "Use Chance", key: "Use Chance", visible: showUseChance, width: '80px' },
      { title: "Insulation", key: "Insulation", visible: showInsulation, width: '80px' },
      { title: "Deadly From", key: "Deadly From", visible: showDeadlyFrom, width: '80px' },
      { title: "Use Distance", key: "Use Distance", visible: showUseDistance, width: '80px' },
      { title: "Item Size", key: "Item Size", visible: showItemSize, width: '80px' },
      { title: "Min Pickup Age", key: "Min Pickup Age", visible: showMinPickupAge, width: '80px' },
      { title: "Speed", key: "Speed", visible: showSpeed, width: '80px' },
      { title: "Movement Type", key: "Movement Type", visible: showMovementType, width: '80px' },
    ];

    // Dynamically compute the headers based on the column visibility
    const tableHeaders = computed(() => [
      { title: "Object", key: "Object" }, // Object column always visible
      ...allHeaders.filter((header) => header.visible.value),
    ]);

    const visibleHeaders = computed(() => allHeaders.filter((header) => header.visible.value));

    const displayed_data = (object) => {
      return {
        "Object": object.name,
        "Slots": object.numSlots || 0,
        "Slot Size": object.slotSize,
        "Clothing Type": object.clothingType || "None",
        "Craftable": object.craftable || false,
        "Difficulty": object.difficulty || 0.0,
        "Spawns In": object.biomes.join(", "),
        "Immediate Food": object.immediateFood || 0,
        "Bonus Food": object.bonusFood || 0,
        "Total Food": object.totalFood || 0,
        "Uses": object.numUses || 0,
        "Use Chance": object.useChance,
        "Insulation": object.insulation,
        "Deadly From": object.deadlyDistance,
        "Use Distance": object.useDistance,
        "Item Size": object.size,
        "Min Pickup Age": object.minPickupAge,
        "Speed": object.speedMult,
        "Movement Type": object.moveType
      };
    };

    const filtered_items = ref(
      GameObject.allObjects()
        .filter(o => localHideUncraftable.value ? o.craftable : true)
        .map(o => displayed_data(o))
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

      const results = GameObject.filter(filters).map(o => displayed_data(o));
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
      tableHeaders,
      visibleHeaders,
      showNumSlots,
      showSlotSize,
      showClothingType,
      showDifficulty,
      showCraftable,
      showSpawnsIn,
      showImmediateFood,
      showBonusFood,
      showTotalFood,
      showUses,
      showUseChance,
      showInsulation,
      showDeadlyFrom,
      showUseDistance,
      showItemSize,
      showMinPickupAge,
      showSpeed,
      showMovementType,
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

.text-wrapper {
  word-break: break-word;
  white-space: normal;
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

.filterCheckbox {
  margin-left: 8px;
  margin-right: 8px;
}

</style>

<style>
.v-checkbox .v-icon {
  color: white !important;
}
.v-checkbox .v-input--selection-controls__input {
  border: 2px solid white !important;
  border-radius: 4px;
}
.v-checkbox .v-input--selection-controls__input--checked {
  background-color: white !important;
}
</style>
