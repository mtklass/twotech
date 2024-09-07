<template>
  <v-sheet class="mx-auto" theme="dark">
    <v-form @submit.prevent="submit">
      <v-container class="ga-0">
        <!-- Slot Count filter -->
        <v-row class="mt-n6 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="numSlotsEnabled" label="Slots" @update:modelValue="saveAndSubmit('numSlotsEnabled', numSlotsEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!numSlotsEnabled" v-model="numSlotsMin" density="compact" @update:modelValue="saveAndSubmit('numSlotsMin', numSlotsMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!numSlotsEnabled" v-model="numSlotsMax" density="compact" @update:modelValue="saveAndSubmit('numSlotsMax', numSlotsMax)" />
          </v-col>
        </v-row>

        <!-- Slot Size filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="slotSizeEnabled" label="Slot size" @update:modelValue="saveAndSubmit('slotSizeEnabled', slotSizeEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!slotSizeEnabled" v-model="slotSizeMin" density="compact" @update:modelValue="saveAndSubmit('slotSizeMin', slotSizeMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!slotSizeEnabled" v-model="slotSizeMax" density="compact" @update:modelValue="saveAndSubmit('slotSizeMax', slotSizeMax)" />
          </v-col>
        </v-row>

        <!-- Clothing Type filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="clothingTypeEnabled" label="Clothing Type" @update:modelValue="saveAndSubmit('clothingTypeEnabled', clothingTypeEnabled)" />
          </v-col>
          <v-col>
            <v-btn-toggle density="compact" :disabled="!clothingTypeEnabled" v-model="clothingTypeValues" variant="outlined" divided multiple @update:modelValue="saveAndSubmit('clothingTypeValues', clothingTypeValues)">
              <v-btn slim>Head</v-btn>
              <v-btn slim>Top</v-btn>
              <v-btn slim>Bottom</v-btn>
              <v-btn slim>Shoe</v-btn>
              <v-btn slim>Pack</v-btn>
              <v-btn slim>None</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <!-- Difficulty filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="difficultyEnabled" label="Difficulty" @update:modelValue="saveAndSubmit('difficultyEnabled', difficultyEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!difficultyEnabled" v-model="difficultyMin" density="compact" @update:modelValue="saveAndSubmit('difficultyMin', difficultyMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!difficultyEnabled" v-model="difficultyMax" density="compact" @update:modelValue="saveAndSubmit('difficultyMax', difficultyMax)" />
          </v-col>
        </v-row>

        <!-- Spawns In filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="spawnsInEnabled" label="Spawns In" @update:modelValue="saveAndSubmit('spawnsInEnabled', spawnsInEnabled)" />
          </v-col>
          <v-col>
            <v-btn-toggle :disabled="!spawnsInEnabled" v-model="spawnsInValues" variant="outlined" divided multiple @update:modelValue="saveAndSubmit('spawnsInValues', spawnsInValues)">
              <v-btn v-tippy="{content: biome.name, theme: 'twotech', animation: 'scale'}" v-for="biome in biomes" :key="biome.id">
                <BiomeImage :biome="biome" />
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <!-- Immediate Food filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="immediateFoodEnabled" label="Immediate Food" @update:modelValue="saveAndSubmit('immediateFoodEnabled', immediateFoodEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!immediateFoodEnabled" v-model="immediateFoodMin" density="compact" @update:modelValue="saveAndSubmit('immediateFoodMin', immediateFoodMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!immediateFoodEnabled" v-model="immediateFoodMax" density="compact" @update:modelValue="saveAndSubmit('immediateFoodMax', immediateFoodMax)" />
          </v-col>
        </v-row>

        <!-- Bonus Food filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="bonusFoodEnabled" label="Bonus Food" @update:modelValue="saveAndSubmit('bonusFoodEnabled', bonusFoodEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!bonusFoodEnabled" v-model="bonusFoodMin" density="compact" @update:modelValue="saveAndSubmit('bonusFoodMin', bonusFoodMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!bonusFoodEnabled" v-model="bonusFoodMax" density="compact" @update:modelValue="saveAndSubmit('bonusFoodMax', bonusFoodMax)" />
          </v-col>
        </v-row>

        <!-- Total Food filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="totalFoodEnabled" label="Total Food" @update:modelValue="saveAndSubmit('totalFoodEnabled', totalFoodEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!totalFoodEnabled" v-model="totalFoodMin" density="compact" @update:modelValue="saveAndSubmit('totalFoodMin', totalFoodMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!totalFoodEnabled" v-model="totalFoodMax" density="compact" @update:modelValue="saveAndSubmit('totalFoodMax', totalFoodMax)" />
          </v-col>
        </v-row>

        <!-- Uses filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="usesEnabled" label="Uses" @update:modelValue="saveAndSubmit('usesEnabled', usesEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!usesEnabled" v-model="usesMin" density="compact" @update:modelValue="saveAndSubmit('usesMin', usesMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!usesEnabled" v-model="usesMax" density="compact" @update:modelValue="saveAndSubmit('usesMax', usesMax)" />
          </v-col>
        </v-row>

        <!-- Use Chance filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="useChanceEnabled" label="Use Chance" @update:modelValue="saveAndSubmit('useChanceEnabled', useChanceEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!useChanceEnabled" v-model="useChanceMin" density="compact" @update:modelValue="saveAndSubmit('useChanceMin', useChanceMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!useChanceEnabled" v-model="useChanceMax" density="compact" @update:modelValue="saveAndSubmit('useChanceMax', useChanceMax)" />
          </v-col>
        </v-row>

        <!-- Insulation filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="insulationEnabled" label="Insulation" @update:modelValue="saveAndSubmit('insulationEnabled', insulationEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!insulationEnabled" v-model="insulationMin" density="compact" @update:modelValue="saveAndSubmit('insulationMin', insulationMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!insulationEnabled" v-model="insulationMax" density="compact" @update:modelValue="saveAndSubmit('insulationMax', insulationMax)" />
          </v-col>
        </v-row>

        <!-- Deadly From filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="deadlyFromEnabled" label="Deadly From" @update:modelValue="saveAndSubmit('deadlyFromEnabled', deadlyFromEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!deadlyFromEnabled" v-model="deadlyFromMin" density="compact" @update:modelValue="saveAndSubmit('deadlyFromMin', deadlyFromMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!deadlyFromEnabled" v-model="deadlyFromMax" density="compact" @update:modelValue="saveAndSubmit('deadlyFromMax', deadlyFromMax)" />
          </v-col>
        </v-row>

        <!-- Use Distance filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="useDistanceEnabled" label="Use Distance" @update:modelValue="saveAndSubmit('useDistanceEnabled', useDistanceEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!useDistanceEnabled" v-model="useDistanceMin" density="compact" @update:modelValue="saveAndSubmit('useDistanceMin', useDistanceMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!useDistanceEnabled" v-model="useDistanceMax" density="compact" @update:modelValue="saveAndSubmit('useDistanceMax', useDistanceMax)" />
          </v-col>
        </v-row>

        <!-- Item size filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="itemSizeEnabled" label="Item size" @update:modelValue="saveAndSubmit('itemSizeEnabled', itemSizeEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!itemSizeEnabled" v-model="itemSizeMin" density="compact" @update:modelValue="saveAndSubmit('itemSizeMin', itemSizeMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!itemSizeEnabled" v-model="itemSizeMax" density="compact" @update:modelValue="saveAndSubmit('itemSizeMax', itemSizeMax)" />
          </v-col>
        </v-row>

        <!-- Min Pickup Age filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="minPickupAgeEnabled" label="Min Pickup Age" @update:modelValue="saveAndSubmit('minPickupAgeEnabled', minPickupAgeEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!minPickupAgeEnabled" v-model="minPickupAgeMin" density="compact" @update:modelValue="saveAndSubmit('minPickupAgeMin', minPickupAgeMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!minPickupAgeEnabled" v-model="minPickupAgeMax" density="compact" @update:modelValue="saveAndSubmit('minPickupAgeMax', minPickupAgeMax)" />
          </v-col>
        </v-row>

        <!-- Speed filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="speedEnabled" label="Speed" @update:modelValue="saveAndSubmit('speedEnabled', speedEnabled)" />
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!speedEnabled" v-model="speedMin" density="compact" @update:modelValue="saveAndSubmit('speedMin', speedMin)" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!speedEnabled" v-model="speedMax" density="compact" @update:modelValue="saveAndSubmit('speedMax', speedMax)" />
          </v-col>
        </v-row>

        <!-- Movement Type filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="movementTypeEnabled" label="Movement Type" @update:modelValue="saveAndSubmit('movementTypeEnabled', movementTypeEnabled)" />
          </v-col>
          <v-col>
            <v-btn-toggle density="compact" :disabled="!movementTypeEnabled" v-model="movementTypeValues" variant="outlined" divided multiple @update:modelValue="saveAndSubmit('movementTypeValues', movementTypeValues)">
              <v-btn slim>None</v-btn>
              <v-btn slim>Chase</v-btn>
              <v-btn slim>Flee</v-btn>
              <v-btn slim>Random</v-btn>
              <v-btn slim>North</v-btn>
              <v-btn slim>South</v-btn>
              <v-btn slim>East</v-btn>
              <v-btn slim>West</v-btn>
              <v-btn slim>Find</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <!-- Insta-filter, Filter, and Hide uncraftable controls -->
        <v-row justify="center mb-n8">
          <v-col cols="4" class="d-flex justify-end">
            <v-switch color="primary" label="Insta-filter" v-model="instaFilter" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col cols="3">
            <v-btn :disabled="instaFilter" class="light-button mt-2" type="submit" color="#blue" active-color="#bbb" button-disabled-opacity="0.26" block>Filter</v-btn>
          </v-col>
          <v-col cols="5">
            <div class="objectCraftableSelection">
              <v-switch color="primary" label="Only craftable" v-model="localHideUncraftable" @update:modelValue="updateHideUncraftable" />
            </div>
          </v-col>
        </v-row>

        <!-- Control resets -->
        <v-row justify="center mt-n8 mb-4">
          <v-btn class="light-button" @click="setFiltersToDefaults()">Reset Filters</v-btn>
          <v-btn class="light-button" @click="setColumnsToDefaults()">Reset Columns</v-btn>
        </v-row>

        <!-- Column selection controls -->
        <v-row justify="center" class="mt-4">
        Columns to Show
        </v-row>
        <v-row justify="center" class="mt-4">
          <v-checkbox density="compact" class="filterCheckbox" v-model="showNumSlots" label="Slots" @update:modelValue="saveControlState('showNumSlots', showNumSlots)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showSlotSize" label="Slot Size" @update:modelValue="saveControlState('showSlotSize', showSlotSize)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showClothingType" label="Clothing Type" @update:modelValue="saveControlState('showClothingType', showClothingType)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showDifficulty" label="Difficulty" @update:modelValue="saveControlState('showDifficulty', showDifficulty)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showCraftable" label="Craftable" @update:modelValue="saveControlState('showCraftable', showCraftable)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showSpawnsIn" label="Spawns In" @update:modelValue="saveControlState('showSpawnsIn', showSpawnsIn)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showImmediateFood" label="Immediate Food" @update:modelValue="saveControlState('showImmediateFood', showImmediateFood)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showBonusFood" label="Bonus Food" @update:modelValue="saveControlState('showBonusFood', showBonusFood)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showTotalFood" label="Total Food" @update:modelValue="saveControlState('showTotalFood', showTotalFood)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showUses" label="Uses" @update:modelValue="saveControlState('showUses', showUses)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showUseChance" label="Use Chance" @update:modelValue="saveControlState('showUseChance', showUseChance)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showInsulation" label="Insulation" @update:modelValue="saveControlState('showInsulation', showInsulation)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showDeadlyFrom" label="Deadly From" @update:modelValue="saveControlState('showDeadlyFrom', showDeadlyFrom)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showUseDistance" label="Use Distance" @update:modelValue="saveControlState('showUseDistance', showUseDistance)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showItemSize" label="Item Size" @update:modelValue="saveControlState('showItemSize', showItemSize)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showMinPickupAge" label="Min Pickup Age" @update:modelValue="saveControlState('showMinPickupAge', showMinPickupAge)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showSpeed" label="Speed" @update:modelValue="saveControlState('showSpeed', showSpeed)" />
          <v-checkbox density="compact" class="filterCheckbox" v-model="showMovementType" label="Movement Type" @update:modelValue="saveControlState('showMovementType', showMovementType)" />
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
                <td class="text-center" style="width: 230px; min-width: 230px; max-width: 230px">
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
import { ref, computed, watch, onMounted } from "vue";
import GameObject from '../models/GameObject';
import Biome from '../models/Biome';
import ObjectImage from "./ObjectImage";
import BiomeImage from './BiomeImage';
import BrowserStorage from '../models/BrowserStorage';
import '../css/tippy.css'
import 'tippy.js/animations/perspective.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/animations/shift-toward.css'

// Define the default values for the filters
const DEFAULT_NUM_SLOTS = { enabled: false, min: 0, max: 27 };
const DEFAULT_SLOT_SIZE = { enabled: false, min: 0, max: 3 };
const DEFAULT_CLOTHING_TYPE = { enabled: false, values: [0, 1, 2, 3, 4, 5] };
const DEFAULT_DIFFICULTY = { enabled: false, min: 0.0, max: 3.0 };
const DEFAULT_SPAWNS_IN = { enabled: false, values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] };
const DEFAULT_IMMEDIATE_FOOD = { enabled: false, min: 0, max: 10 };
const DEFAULT_BONUS_FOOD = { enabled: false, min: 0, max: 20 };
const DEFAULT_TOTAL_FOOD = { enabled: false, min: 0, max: 25 };
const DEFAULT_USES = { enabled: false, min: 0, max: 100 };
const DEFAULT_USE_CHANCE = { enabled: false, min: 0.0, max: 1.0 };
const DEFAULT_INSULATION = { enabled: false, min: 0, max: 10 };
const DEFAULT_DEADLY_FROM = { enabled: false, min: 0, max: 5 };
const DEFAULT_USE_DISTANCE = { enabled: false, min: 0, max: 5 };
const DEFAULT_ITEM_SIZE = { enabled: false, min: 0.5, max: 3 };
const DEFAULT_MIN_PICKUP_AGE = { enabled: false, min: 0, max: 20 };
const DEFAULT_SPEED = { enabled: false, min: 0, max: 3 };
const DEFAULT_MOVEMENT_TYPE = { enabled: false, values: [0, 1, 2, 3, 4, 5, 6, 7, 8] };

const DEFAULT_COLUMNS = {
  showNumSlots: true,
  showSlotSize: true,
  showClothingType: true,
  showDifficulty: true,
  showCraftable: false,
  showSpawnsIn: true,
  showImmediateFood: false,
  showBonusFood: false,
  showTotalFood: false,
  showUses: false,
  showUseChance: false,
  showInsulation: false,
  showDeadlyFrom: false,
  showUseDistance: false,
  showItemSize: false,
  showMinPickupAge: false,
  showSpeed: false,
  showMovementType: false,
};

export default {
  components: {
    ObjectImage,
    BiomeImage,
  },
  props: {
    hideUncraftable: Boolean,
    toggleHideUncraftable: Function,
  },
  setup(props, { emit }) {
    const instaFilter = ref(true);
    const localHideUncraftable = ref(props.hideUncraftable); // Local reference to hideUncraftable
    const extraObjectData = GameObject.allExtraObjectsData().map(obj_data => { return {...obj_data, url: GameObject.find(obj_data.id).url()} });

    // Num Slots filter data
    const numSlotsEnabled = ref(DEFAULT_NUM_SLOTS.enabled);
    const numSlotsMin = ref(DEFAULT_NUM_SLOTS.min);
    const numSlotsMax = ref(DEFAULT_NUM_SLOTS.max);
    // Slot Size filter data
    const slotSizeEnabled = ref(DEFAULT_SLOT_SIZE.enabled);
    const slotSizeMin = ref(DEFAULT_SLOT_SIZE.min);
    const slotSizeMax = ref(DEFAULT_SLOT_SIZE.max);
    // Clothing Type filter data
    const clothingTypeEnabled = ref(DEFAULT_CLOTHING_TYPE.enabled);
    const clothingTypeValues = ref(DEFAULT_CLOTHING_TYPE.values);
    // Difficulty filter data
    const difficultyEnabled = ref(DEFAULT_DIFFICULTY.enabled);
    const difficultyMin = ref(DEFAULT_DIFFICULTY.min);
    const difficultyMax = ref(DEFAULT_DIFFICULTY.max);
    // Spawns In filter data
    const spawnsInEnabled = ref(DEFAULT_SPAWNS_IN.enabled);
    const spawnsInValues = ref(DEFAULT_SPAWNS_IN.values);
    const biomes = computed(() => Biome.biomes());
    // Immediate Food filter data
    const immediateFoodEnabled = ref(DEFAULT_IMMEDIATE_FOOD.enabled);
    const immediateFoodMin = ref(DEFAULT_IMMEDIATE_FOOD.min);
    const immediateFoodMax = ref(DEFAULT_IMMEDIATE_FOOD.max);
    // Bonus Food filter data
    const bonusFoodEnabled = ref(DEFAULT_BONUS_FOOD.enabled);
    const bonusFoodMin = ref(DEFAULT_BONUS_FOOD.min);
    const bonusFoodMax = ref(DEFAULT_BONUS_FOOD.max);
    // Total Food filter data
    const totalFoodEnabled = ref(DEFAULT_TOTAL_FOOD.enabled);
    const totalFoodMin = ref(DEFAULT_TOTAL_FOOD.min);
    const totalFoodMax = ref(DEFAULT_TOTAL_FOOD.max);
    // Uses filter data
    const usesEnabled = ref(DEFAULT_USES.enabled);
    const usesMin = ref(DEFAULT_USES.min);
    const usesMax = ref(DEFAULT_USES.max);
    // Use Chance filter data
    const useChanceEnabled = ref(DEFAULT_USE_CHANCE.enabled);
    const useChanceMin = ref(DEFAULT_USE_CHANCE.min);
    const useChanceMax = ref(DEFAULT_USE_CHANCE.max);
    // Insulation filter data
    const insulationEnabled = ref(DEFAULT_INSULATION.enabled);
    const insulationMin = ref(DEFAULT_INSULATION.min);
    const insulationMax = ref(DEFAULT_INSULATION.max);
    // Deadly From filter data
    const deadlyFromEnabled = ref(DEFAULT_DEADLY_FROM.enabled);
    const deadlyFromMin = ref(DEFAULT_DEADLY_FROM.min);
    const deadlyFromMax = ref(DEFAULT_DEADLY_FROM.max);
    // Use Distance filter data
    const useDistanceEnabled = ref(DEFAULT_USE_DISTANCE.enabled);
    const useDistanceMin = ref(DEFAULT_USE_DISTANCE.min);
    const useDistanceMax = ref(DEFAULT_USE_DISTANCE.max);
    // Item Size filter data
    const itemSizeEnabled = ref(DEFAULT_ITEM_SIZE.enabled);
    const itemSizeMin = ref(DEFAULT_ITEM_SIZE.min);
    const itemSizeMax = ref(DEFAULT_ITEM_SIZE.max);
    // Min Pickup Age filter data
    const minPickupAgeEnabled = ref(DEFAULT_MIN_PICKUP_AGE.enabled);
    const minPickupAgeMin = ref(DEFAULT_MIN_PICKUP_AGE.min);
    const minPickupAgeMax = ref(DEFAULT_MIN_PICKUP_AGE.max);
    // Speed filter data
    const speedEnabled = ref(DEFAULT_SPEED.enabled);
    const speedMin = ref(DEFAULT_SPEED.min);
    const speedMax = ref(DEFAULT_SPEED.max);
    // Movement Type filter data
    const movementTypeEnabled = ref(DEFAULT_MOVEMENT_TYPE.enabled);
    const movementTypeValues = ref(DEFAULT_MOVEMENT_TYPE.values);

    // Column visibility toggles
    const showNumSlots = ref(DEFAULT_COLUMNS.showNumSlots);
    const showSlotSize = ref(DEFAULT_COLUMNS.showSlotSize);
    const showClothingType = ref(DEFAULT_COLUMNS.showClothingType);
    const showDifficulty = ref(DEFAULT_COLUMNS.showDifficulty);
    const showCraftable = ref(DEFAULT_COLUMNS.showCraftable);
    const showSpawnsIn = ref(DEFAULT_COLUMNS.showSpawnsIn);
    const showImmediateFood = ref(DEFAULT_COLUMNS.showImmediateFood);
    const showBonusFood = ref(DEFAULT_COLUMNS.showBonusFood);
    const showTotalFood = ref(DEFAULT_COLUMNS.showTotalFood);
    const showUses = ref(DEFAULT_COLUMNS.showUses);
    const showUseChance = ref(DEFAULT_COLUMNS.showUseChance);
    const showInsulation = ref(DEFAULT_COLUMNS.showInsulation);
    const showDeadlyFrom = ref(DEFAULT_COLUMNS.showDeadlyFrom);
    const showUseDistance = ref(DEFAULT_COLUMNS.showUseDistance);
    const showItemSize = ref(DEFAULT_COLUMNS.showItemSize);
    const showMinPickupAge = ref(DEFAULT_COLUMNS.showMinPickupAge);
    const showSpeed = ref(DEFAULT_COLUMNS.showSpeed);
    const showMovementType = ref(DEFAULT_COLUMNS.showMovementType);

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
      { title: "Object", key: "Object", visible: true, width: '230px' }, // Object column always visible
      ...allHeaders.filter((header) => header.visible.value),
    ]);

    const visibleHeaders = computed(() => allHeaders.filter((header) => header.visible.value));

    // Save control state to BrowserStorage
    const saveControlState = (key, value) => {
      BrowserStorage.setItem(key, JSON.stringify(value));
    };

    // Load control state from BrowserStorage on mounted
    const loadControlState = (key, refValue, defaultValue) => {
      const savedValue = BrowserStorage.getItem(key);
      if (savedValue !== null) {
        refValue.value = JSON.parse(savedValue);
      } else {
        refValue.value = defaultValue;
      }
    };

    // Function that saves control state and triggers submit if necessary
    const saveAndSubmit = (key, value) => {
      saveControlState(key, value);
      setupSubmit();
    };

    const setFiltersToDefaults = () => {
      // Num Slots
      numSlotsEnabled.value = DEFAULT_NUM_SLOTS.enabled;
      numSlotsMin.value = DEFAULT_NUM_SLOTS.min;
      numSlotsMax.value = DEFAULT_NUM_SLOTS.max;
      saveControlState('numSlotsEnabled', DEFAULT_NUM_SLOTS.enabled);
      saveControlState('numSlotsMin', DEFAULT_NUM_SLOTS.min);
      saveControlState('numSlotsMax', DEFAULT_NUM_SLOTS.max);

      // Slot Size
      slotSizeEnabled.value = DEFAULT_SLOT_SIZE.enabled;
      slotSizeMin.value = DEFAULT_SLOT_SIZE.min;
      slotSizeMax.value = DEFAULT_SLOT_SIZE.max;
      saveControlState('slotSizeEnabled', DEFAULT_SLOT_SIZE.enabled);
      saveControlState('slotSizeMin', DEFAULT_SLOT_SIZE.min);
      saveControlState('slotSizeMax', DEFAULT_SLOT_SIZE.max);

      // Clothing Type
      clothingTypeEnabled.value = DEFAULT_CLOTHING_TYPE.enabled;
      clothingTypeValues.value = DEFAULT_CLOTHING_TYPE.values;
      saveControlState('clothingTypeEnabled', DEFAULT_CLOTHING_TYPE.enabled);
      saveControlState('clothingTypeValues', DEFAULT_CLOTHING_TYPE.values);

      // Difficulty
      difficultyEnabled.value = DEFAULT_DIFFICULTY.enabled;
      difficultyMin.value = DEFAULT_DIFFICULTY.min;
      difficultyMax.value = DEFAULT_DIFFICULTY.max;
      saveControlState('difficultyEnabled', DEFAULT_DIFFICULTY.enabled);
      saveControlState('difficultyMin', DEFAULT_DIFFICULTY.min);
      saveControlState('difficultyMax', DEFAULT_DIFFICULTY.max);

      // Spawns In
      spawnsInEnabled.value = DEFAULT_SPAWNS_IN.enabled;
      spawnsInValues.value = DEFAULT_SPAWNS_IN.values;
      saveControlState('spawnsInEnabled', DEFAULT_SPAWNS_IN.enabled);
      saveControlState('spawnsInValues', DEFAULT_SPAWNS_IN.values);

      // Immediate Food
      immediateFoodEnabled.value = DEFAULT_IMMEDIATE_FOOD.enabled;
      immediateFoodMin.value = DEFAULT_IMMEDIATE_FOOD.min;
      immediateFoodMax.value = DEFAULT_IMMEDIATE_FOOD.max;
      saveControlState('immediateFoodEnabled', DEFAULT_IMMEDIATE_FOOD.enabled);
      saveControlState('immediateFoodMin', DEFAULT_IMMEDIATE_FOOD.min);
      saveControlState('immediateFoodMax', DEFAULT_IMMEDIATE_FOOD.max);

      // Bonus Food
      bonusFoodEnabled.value = DEFAULT_BONUS_FOOD.enabled;
      bonusFoodMin.value = DEFAULT_BONUS_FOOD.min;
      bonusFoodMax.value = DEFAULT_BONUS_FOOD.max;
      saveControlState('bonusFoodEnabled', DEFAULT_BONUS_FOOD.enabled);
      saveControlState('bonusFoodMin', DEFAULT_BONUS_FOOD.min);
      saveControlState('bonusFoodMax', DEFAULT_BONUS_FOOD.max);

      // Total Food
      totalFoodEnabled.value = DEFAULT_TOTAL_FOOD.enabled;
      totalFoodMin.value = DEFAULT_TOTAL_FOOD.min;
      totalFoodMax.value = DEFAULT_TOTAL_FOOD.max;
      saveControlState('totalFoodEnabled', DEFAULT_TOTAL_FOOD.enabled);
      saveControlState('totalFoodMin', DEFAULT_TOTAL_FOOD.min);
      saveControlState('totalFoodMax', DEFAULT_TOTAL_FOOD.max);

      // Uses
      usesEnabled.value = DEFAULT_USES.enabled;
      usesMin.value = DEFAULT_USES.min;
      usesMax.value = DEFAULT_USES.max;
      saveControlState('usesEnabled', DEFAULT_USES.enabled);
      saveControlState('usesMin', DEFAULT_USES.min);
      saveControlState('usesMax', DEFAULT_USES.max);

      // Use Chance
      useChanceEnabled.value = DEFAULT_USE_CHANCE.enabled;
      useChanceMin.value = DEFAULT_USE_CHANCE.min;
      useChanceMax.value = DEFAULT_USE_CHANCE.max;
      saveControlState('useChanceEnabled', DEFAULT_USE_CHANCE.enabled);
      saveControlState('useChanceMin', DEFAULT_USE_CHANCE.min);
      saveControlState('useChanceMax', DEFAULT_USE_CHANCE.max);

      // Insulation
      insulationEnabled.value = DEFAULT_INSULATION.enabled;
      insulationMin.value = DEFAULT_INSULATION.min;
      insulationMax.value = DEFAULT_INSULATION.max;
      saveControlState('insulationEnabled', DEFAULT_INSULATION.enabled);
      saveControlState('insulationMin', DEFAULT_INSULATION.min);
      saveControlState('insulationMax', DEFAULT_INSULATION.max);

      // Deadly From
      deadlyFromEnabled.value = DEFAULT_DEADLY_FROM.enabled;
      deadlyFromMin.value = DEFAULT_DEADLY_FROM.min;
      deadlyFromMax.value = DEFAULT_DEADLY_FROM.max;
      saveControlState('deadlyFromEnabled', DEFAULT_DEADLY_FROM.enabled);
      saveControlState('deadlyFromMin', DEFAULT_DEADLY_FROM.min);
      saveControlState('deadlyFromMax', DEFAULT_DEADLY_FROM.max);

      // Use Distance
      useDistanceEnabled.value = DEFAULT_USE_DISTANCE.enabled;
      useDistanceMin.value = DEFAULT_USE_DISTANCE.min;
      useDistanceMax.value = DEFAULT_USE_DISTANCE.max;
      saveControlState('useDistanceEnabled', DEFAULT_USE_DISTANCE.enabled);
      saveControlState('useDistanceMin', DEFAULT_USE_DISTANCE.min);
      saveControlState('useDistanceMax', DEFAULT_USE_DISTANCE.max);

      // Item Size
      itemSizeEnabled.value = DEFAULT_ITEM_SIZE.enabled;
      itemSizeMin.value = DEFAULT_ITEM_SIZE.min;
      itemSizeMax.value = DEFAULT_ITEM_SIZE.max;
      saveControlState('itemSizeEnabled', DEFAULT_ITEM_SIZE.enabled);
      saveControlState('itemSizeMin', DEFAULT_ITEM_SIZE.min);
      saveControlState('itemSizeMax', DEFAULT_ITEM_SIZE.max);

      // Min Pickup Age
      minPickupAgeEnabled.value = DEFAULT_MIN_PICKUP_AGE.enabled;
      minPickupAgeMin.value = DEFAULT_MIN_PICKUP_AGE.min;
      minPickupAgeMax.value = DEFAULT_MIN_PICKUP_AGE.max;
      saveControlState('minPickupAgeEnabled', DEFAULT_MIN_PICKUP_AGE.enabled);
      saveControlState('minPickupAgeMin', DEFAULT_MIN_PICKUP_AGE.min);
      saveControlState('minPickupAgeMax', DEFAULT_MIN_PICKUP_AGE.max);

      // Speed
      speedEnabled.value = DEFAULT_SPEED.enabled;
      speedMin.value = DEFAULT_SPEED.min;
      speedMax.value = DEFAULT_SPEED.max;
      saveControlState('speedEnabled', DEFAULT_SPEED.enabled);
      saveControlState('speedMin', DEFAULT_SPEED.min);
      saveControlState('speedMax', DEFAULT_SPEED.max);

      // Movement Type
      movementTypeEnabled.value = DEFAULT_MOVEMENT_TYPE.enabled;
      movementTypeValues.value = DEFAULT_MOVEMENT_TYPE.values;
      saveControlState('movementTypeEnabled', DEFAULT_MOVEMENT_TYPE.enabled);
      saveControlState('movementTypeValues', DEFAULT_MOVEMENT_TYPE.values);
    };

    const setColumnsToDefaults = () => {
      // Show Num Slots
      showNumSlots.value = DEFAULT_COLUMNS.showNumSlots;
      saveControlState('showNumSlots', DEFAULT_COLUMNS.showNumSlots);

      // Show Slot Size
      showSlotSize.value = DEFAULT_COLUMNS.showSlotSize;
      saveControlState('showSlotSize', DEFAULT_COLUMNS.showSlotSize);

      // Show Clothing Type
      showClothingType.value = DEFAULT_COLUMNS.showClothingType;
      saveControlState('showClothingType', DEFAULT_COLUMNS.showClothingType);

      // Show Difficulty
      showDifficulty.value = DEFAULT_COLUMNS.showDifficulty;
      saveControlState('showDifficulty', DEFAULT_COLUMNS.showDifficulty);

      // Show Craftable
      showCraftable.value = DEFAULT_COLUMNS.showCraftable;
      saveControlState('showCraftable', DEFAULT_COLUMNS.showCraftable);

      // Show Spawns In
      showSpawnsIn.value = DEFAULT_COLUMNS.showSpawnsIn;
      saveControlState('showSpawnsIn', DEFAULT_COLUMNS.showSpawnsIn);

      // Show Immediate Food
      showImmediateFood.value = DEFAULT_COLUMNS.showImmediateFood;
      saveControlState('showImmediateFood', DEFAULT_COLUMNS.showImmediateFood);

      // Show Bonus Food
      showBonusFood.value = DEFAULT_COLUMNS.showBonusFood;
      saveControlState('showBonusFood', DEFAULT_COLUMNS.showBonusFood);

      // Show Total Food
      showTotalFood.value = DEFAULT_COLUMNS.showTotalFood;
      saveControlState('showTotalFood', DEFAULT_COLUMNS.showTotalFood);

      // Show Uses
      showUses.value = DEFAULT_COLUMNS.showUses;
      saveControlState('showUses', DEFAULT_COLUMNS.showUses);

      // Show Use Chance
      showUseChance.value = DEFAULT_COLUMNS.showUseChance;
      saveControlState('showUseChance', DEFAULT_COLUMNS.showUseChance);

      // Show Insulation
      showInsulation.value = DEFAULT_COLUMNS.showInsulation;
      saveControlState('showInsulation', DEFAULT_COLUMNS.showInsulation);

      // Show Deadly From
      showDeadlyFrom.value = DEFAULT_COLUMNS.showDeadlyFrom;
      saveControlState('showDeadlyFrom', DEFAULT_COLUMNS.showDeadlyFrom);

      // Show Use Distance
      showUseDistance.value = DEFAULT_COLUMNS.showUseDistance;
      saveControlState('showUseDistance', DEFAULT_COLUMNS.showUseDistance);

      // Show Item Size
      showItemSize.value = DEFAULT_COLUMNS.showItemSize;
      saveControlState('showItemSize', DEFAULT_COLUMNS.showItemSize);

      // Show Min Pickup Age
      showMinPickupAge.value = DEFAULT_COLUMNS.showMinPickupAge;
      saveControlState('showMinPickupAge', DEFAULT_COLUMNS.showMinPickupAge);

      // Show Speed
      showSpeed.value = DEFAULT_COLUMNS.showSpeed;
      saveControlState('showSpeed', DEFAULT_COLUMNS.showSpeed);

      // Show Movement Type
      showMovementType.value = DEFAULT_COLUMNS.showMovementType;
      saveControlState('showMovementType', DEFAULT_COLUMNS.showMovementType);
    };

    // Load all saved states on mount
    onMounted(() => {
      loadControlState('numSlotsEnabled', numSlotsEnabled, false);
      loadControlState('numSlotsMin', numSlotsMin, 0);
      loadControlState('numSlotsMax', numSlotsMax, 27);
      loadControlState('slotSizeEnabled', slotSizeEnabled, false);
      loadControlState('slotSizeMin', slotSizeMin, 0);
      loadControlState('slotSizeMax', slotSizeMax, 3);
      loadControlState('clothingTypeEnabled', clothingTypeEnabled, false);
      loadControlState('clothingTypeValues', clothingTypeValues, [0, 1, 2, 3, 4, 5]);
      loadControlState('difficultyEnabled', difficultyEnabled, false);
      loadControlState('difficultyMin', difficultyMin, 0.0);
      loadControlState('difficultyMax', difficultyMax, 3.0);
      loadControlState('spawnsInEnabled', spawnsInEnabled, false);
      loadControlState('spawnsInValues', spawnsInValues, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      loadControlState('immediateFoodEnabled', immediateFoodEnabled, false);
      loadControlState('immediateFoodMin', immediateFoodMin, 0);
      loadControlState('immediateFoodMax', immediateFoodMax, 10);
      loadControlState('bonusFoodEnabled', bonusFoodEnabled, false);
      loadControlState('bonusFoodMin', bonusFoodMin, 0);
      loadControlState('bonusFoodMax', bonusFoodMax, 20);
      loadControlState('totalFoodEnabled', totalFoodEnabled, false);
      loadControlState('totalFoodMin', totalFoodMin, 0);
      loadControlState('totalFoodMax', totalFoodMax, 25);
      loadControlState('usesEnabled', usesEnabled, false);
      loadControlState('usesMin', usesMin, 0);
      loadControlState('usesMax', usesMax, 100);
      loadControlState('useChanceEnabled', useChanceEnabled, false);
      loadControlState('useChanceMin', useChanceMin, 0.0);
      loadControlState('useChanceMax', useChanceMax, 1.0);
      loadControlState('insulationEnabled', insulationEnabled, false);
      loadControlState('insulationMin', insulationMin, 0);
      loadControlState('insulationMax', insulationMax, 10);
      loadControlState('deadlyFromEnabled', deadlyFromEnabled, false);
      loadControlState('deadlyFromMin', deadlyFromMin, 0);
      loadControlState('deadlyFromMax', deadlyFromMax, 5);
      loadControlState('useDistanceEnabled', useDistanceEnabled, false);
      loadControlState('useDistanceMin', useDistanceMin, 0);
      loadControlState('useDistanceMax', useDistanceMax,  5);
      loadControlState('itemSizeEnabled', itemSizeEnabled, false);
      loadControlState('itemSizeMin', itemSizeMin, 0.5);
      loadControlState('itemSizeMax', itemSizeMax, 3);
      loadControlState('minPickupAgeEnabled', minPickupAgeEnabled, false);
      loadControlState('minPickupAgeMin', minPickupAgeMin, 0);
      loadControlState('minPickupAgeMax', minPickupAgeMax, 20);
      loadControlState('speedEnabled', speedEnabled, false);
      loadControlState('speedMin', speedMin, 0);
      loadControlState('speedMax', speedMax, 3);
      loadControlState('movementTypeEnabled', movementTypeEnabled, false);
      loadControlState('movementTypeValues', movementTypeValues, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
      
      loadControlState('showNumSlots', showNumSlots, true);
      loadControlState('showSlotSize', showSlotSize, true);
      loadControlState('showClothingType', showClothingType, true);
      loadControlState('showDifficulty', showDifficulty, true);
      loadControlState('showCraftable', showCraftable, false);
      loadControlState('showSpawnsIn', showSpawnsIn, true);
      loadControlState('showImmediateFood', showImmediateFood, false);
      loadControlState('showBonusFood', showBonusFood, false);
      loadControlState('showTotalFood', showTotalFood, false);
      loadControlState('showUses', showUses, false);
      loadControlState('showUseChance', showUseChance, false);
      loadControlState('showInsulation', showInsulation, false);
      loadControlState('showDeadlyFrom', showDeadlyFrom, false);
      loadControlState('showUseDistance', showUseDistance, false);
      loadControlState('showItemSize', showItemSize, false);
      loadControlState('showMinPickupAge', showMinPickupAge, false);
      loadControlState('showSpeed', showSpeed, false);
      loadControlState('showMovementType', showMovementType, false);

      setupSubmit();
    });

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

    let filterTimeout = null; // Track the timeout

    const updateHideUncraftable = () => {
      props.toggleHideUncraftable();
    };

    const submitIfAuto = (event) => {
      if (instaFilter.value) {
        setupSubmit(event);
      }
    };

    const setupSubmit = async (event) => {
      if (event) event.preventDefault();
      // Clear the previous timeout if another filter change happens before the previous one finishes
      if (filterTimeout) {
        clearTimeout(filterTimeout);
        filtered_items.value = []; // Clear the current results while waiting for the new results
      }

      // Set a new timeout to defer the filtering process
      filterTimeout = setTimeout(() => {
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
            includeHeadItems: clothingTypeValues.value.includes(0),
            includeTopItems: clothingTypeValues.value.includes(1),
            includeBottomItems: clothingTypeValues.value.includes(2),
            includeShoeItems: clothingTypeValues.value.includes(3),
            includePackItems: clothingTypeValues.value.includes(4),
            includeNoneItems: clothingTypeValues.value.includes(5),
          })
        }
        if (difficultyEnabled.value) {
          filters.push({
            name: "difficulty",
            min: difficultyMin.value,
            max: difficultyMax.value,
          });
        }
        if (spawnsInEnabled.value) {
          filters.push({
            name: "spawnsIn",
            includeGrasslands: spawnsInValues.value.includes(0),
            includeSwamps: spawnsInValues.value.includes(1),
            includeYellowPraries: spawnsInValues.value.includes(2),
            includeBadlands: spawnsInValues.value.includes(3),
            includeTundra: spawnsInValues.value.includes(4),
            includeDesert: spawnsInValues.value.includes(5),
            includeJungle: spawnsInValues.value.includes(6),
            includeDeepWater: spawnsInValues.value.includes(7),
            includeFlowerFields: spawnsInValues.value.includes(8),
            includeShallowWater: spawnsInValues.value.includes(9),
          })
        }
        if (immediateFoodEnabled.value) {
          filters.push({
            name: "immediateFood",
            min: immediateFoodMin.value,
            max: immediateFoodMax.value,
          });
        }
        if (bonusFoodEnabled.value) {
          filters.push({
            name: "bonusFood",
            min: bonusFoodMin.value,
            max: bonusFoodMax.value,
          });
        }
        if (totalFoodEnabled.value) {
          filters.push({
            name: "totalFood",
            min: totalFoodMin.value,
            max: totalFoodMax.value,
          });
        }
        if (usesEnabled.value) {
          filters.push({
            name: "uses",
            min: usesMin.value,
            max: usesMax.value,
          });
        }
        if (useChanceEnabled.value) {
          filters.push({
            name: "useChance",
            min: useChanceMin.value,
            max: useChanceMax.value,
          });
        }
        if (insulationEnabled.value) {
          filters.push({
            name: "insulation",
            min: insulationMin.value,
            max: insulationMax.value,
          });
        }
        if (deadlyFromEnabled.value) {
          filters.push({
            name: "deadlyFrom",
            min: deadlyFromMin.value,
            max: deadlyFromMax.value,
          });
        }
        if (useDistanceEnabled.value) {
          filters.push({
            name: "useDistance",
            min: useDistanceMin.value,
            max: useDistanceMax.value,
          });
        }
        if (itemSizeEnabled.value) {
          filters.push({
            name: "itemSize",
            min: itemSizeMin.value,
            max: itemSizeMax.value,
          });
        }
        if (minPickupAgeEnabled.value) {
          filters.push({
            name: "minPickupAge",
            min: minPickupAgeMin.value,
            max: minPickupAgeMax.value,
          });
        }
        if (speedEnabled.value) {
          filters.push({
            name: "speed",
            min: speedMin.value,
            max: speedMax.value,
          });
        }
        if (movementTypeEnabled.value) {
          filters.push({
            name: "movementType",
            includeNone: movementTypeValues.value.includes(0),
            includeChase: movementTypeValues.value.includes(1),
            includeFlee: movementTypeValues.value.includes(2),
            includeRandom: movementTypeValues.value.includes(3),
            includeNorth: movementTypeValues.value.includes(4),
            includeSouth: movementTypeValues.value.includes(5),
            includeEast: movementTypeValues.value.includes(6),
            includeWest: movementTypeValues.value.includes(7),
            includeFind: movementTypeValues.value.includes(8),
          })
        }

        const results = GameObject.filter(filters).map(o => displayed_data(o));
        filtered_items.value = results;
      }, 0);
    };

    watch(() => props.hideUncraftable, (newVal) => {
      localHideUncraftable.value = newVal;
      setupSubmit();
    });

    return {
      instaFilter,
      setupSubmit,
      submitIfAuto,
      saveAndSubmit,
      saveControlState,
      setFiltersToDefaults,
      setColumnsToDefaults,
      filtered_items,

      numSlotsEnabled,
      numSlotsMin,
      numSlotsMax,
      slotSizeEnabled,
      slotSizeMin,
      slotSizeMax,
      clothingTypeEnabled,
      clothingTypeValues,
      difficultyEnabled,
      difficultyMin,
      difficultyMax,
      biomes,
      spawnsInEnabled,
      spawnsInValues,
      movementTypeEnabled,
      movementTypeValues,
      immediateFoodEnabled,
      immediateFoodMin,
      immediateFoodMax,
      bonusFoodEnabled,
      bonusFoodMin,
      bonusFoodMax,
      totalFoodEnabled,
      totalFoodMin,
      totalFoodMax,
      usesEnabled,
      usesMin,
      usesMax,
      useChanceEnabled,
      useChanceMin,
      useChanceMax,
      insulationEnabled,
      insulationMin,
      insulationMax,
      deadlyFromEnabled,
      deadlyFromMin,
      deadlyFromMax,
      useDistanceEnabled,
      useDistanceMin,
      useDistanceMax,
      itemSizeEnabled,
      itemSizeMin,
      itemSizeMax,
      minPickupAgeEnabled,
      minPickupAgeMin,
      minPickupAgeMax,
      speedEnabled,
      speedMin,
      speedMax,
      movementTypeEnabled,
      movementTypeValues,

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
.light-button {
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

.v-btn .biomeImage {
  background-size: cover;
  width: 30px; /* or whatever size fits */
  height: 30px;
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
