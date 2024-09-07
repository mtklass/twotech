<template>
  <v-sheet class="mx-auto" theme="dark">
    <v-form @submit.prevent="submit">
      <v-container class="ga-0">
        <!-- Slot Count filter -->
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

        <!-- Slot Size filter -->
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

        <!-- Clothing Type filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="clothingTypeEnabled" label="Clothing Type" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-btn-toggle density="compact" :disabled="!clothingTypeEnabled" v-model="clothingTypeValues" variant="outlined" divided multiple @update:modelValue="submitIfAuto()">
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
            <v-switch color="primary" v-model="difficultyEnabled" label="Difficulty" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!difficultyEnabled" v-model="difficultyMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!difficultyEnabled" v-model="difficultyMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Spawns In filter -->
        <!-- This may need to be double-tall to allow for all the options. Maybe not using v-col will be enough -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="spawnsInEnabled" label="Spawns In" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-btn-toggle :disabled="!spawnsInEnabled" v-model="spawnsInValues" variant="outlined" divided multiple @update:modelValue="submitIfAuto()">
              <v-btn v-tippy="{content: biome.name, theme: 'twotech', animation: 'scale'}" v-for="biome in biomes" :key="biome.id">
                <BiomeImage :biome="biome" />
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <!-- Immediate Food filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="immediateFoodEnabled" label="Immediate Food" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!immediateFoodEnabled" v-model="immediateFoodMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!immediateFoodEnabled" v-model="immediateFoodMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Bonus Food filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="bonusFoodEnabled" label="Bonus Food" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!bonusFoodEnabled" v-model="bonusFoodMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!bonusFoodEnabled" v-model="bonusFoodMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Total Food filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="totalFoodEnabled" label="Total Food" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!totalFoodEnabled" v-model="totalFoodMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!totalFoodEnabled" v-model="totalFoodMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Uses filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="usesEnabled" label="Uses" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!usesEnabled" v-model="usesMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!usesEnabled" v-model="usesMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Use Chance filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="useChanceEnabled" label="Use Chance" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!useChanceEnabled" v-model="useChanceMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!useChanceEnabled" v-model="useChanceMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Insulation filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="insulationEnabled" label="Insulation" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!insulationEnabled" v-model="insulationMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!insulationEnabled" v-model="insulationMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Deadly From filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="deadlyFromEnabled" label="Deadly From" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!deadlyFromEnabled" v-model="deadlyFromMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!deadlyFromEnabled" v-model="deadlyFromMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Use Distance filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="useDistanceEnabled" label="Use Distance" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!useDistanceEnabled" v-model="useDistanceMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!useDistanceEnabled" v-model="useDistanceMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Item size filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="itemSizeEnabled" label="Item size" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!itemSizeEnabled" v-model="itemSizeMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!itemSizeEnabled" v-model="itemSizeMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Min Pickup Age filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="minPickupAgeEnabled" label="Min Pickup Age" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!minPickupAgeEnabled" v-model="minPickupAgeMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!minPickupAgeEnabled" v-model="minPickupAgeMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Speed filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="speedEnabled" label="Speed" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!speedEnabled" v-model="speedMin" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!speedEnabled" v-model="speedMax" density="compact" @update:modelValue="submitIfAuto()"/>
          </v-col>
        </v-row>

        <!-- Movement Type filter -->
        <!-- This may need to be double-tall to allow for all the options. Maybe not using v-col will be enough -->
        <v-row class="mt-n14 mb-n14">
          <v-col cols="3">
            <v-switch color="primary" v-model="movementTypeEnabled" label="Movement Type" @update:modelValue="submitIfAuto()"></v-switch>
          </v-col>
          <v-col>
            <v-btn-toggle density="compact" :disabled="!movementTypeEnabled" v-model="movementTypeValues" variant="outlined" divided multiple @update:modelValue="submitIfAuto()">
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

        <!-- TODO: Movement Type filter, similar to clothing, an OR of all the different options -->

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
import Biome from '../models/Biome';
import ObjectImage from "./ObjectImage";
import BiomeImage from './BiomeImage';
import BrowserStorage from '../models/BrowserStorage';
import '../css/tippy.css'
import 'tippy.js/animations/perspective.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/animations/shift-toward.css'


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
    const numSlotsEnabled = ref(false);
    const numSlotsMin = ref(0);
    const numSlotsMax = ref(27);
    // Slot Size filter data
    const slotSizeEnabled = ref(false);
    const slotSizeMin = ref(0);
    const slotSizeMax = ref(3);
    // Clothing Type filter data
    const clothingTypeEnabled = ref(false);
    // Array to be used with v-btn-group
    // Order here is Head, Top, Bottom, Shoe, Pack, None
    const clothingTypeValues = ref([0, 1, 2, 3, 4, 5]);
    // Difficulty filter data
    const difficultyEnabled = ref(false);
    const difficultyMin = ref(0.0);
    const difficultyMax = ref(3.0);
    // Spawns In filter data
    const spawnsInEnabled = ref(false);
    // Array to be used with v-btn-group
    // Order here is "Grasslands", "Swamps", "Yellow Prairies", "Badlands", "Tundra", "Desert", "Jungle", "Deep Water", "Flower Fields", "Shallow Water"
    const spawnsInValues = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const biomes = computed(() => Biome.biomes());
    // Immediate Food filter data
    const immediateFoodEnabled = ref(false);
    const immediateFoodMin = ref(0);
    const immediateFoodMax = ref(10);
    // Bonus Food filter data
    const bonusFoodEnabled = ref(false);
    const bonusFoodMin = ref(0);
    const bonusFoodMax = ref(20);
    // Total Food filter data
    const totalFoodEnabled = ref(false);
    const totalFoodMin = ref(0);
    const totalFoodMax = ref(25);
    // Uses filter data
    const usesEnabled = ref(false);
    const usesMin = ref(0);
    const usesMax = ref(100);
    // Use Chance filter data
    const useChanceEnabled = ref(false);
    const useChanceMin = ref(0.0);
    const useChanceMax = ref(1.0);
    // Insulation filter data
    const insulationEnabled = ref(false);
    const insulationMin = ref(0);
    const insulationMax = ref(10);
    // Deadly From filter data
    const deadlyFromEnabled = ref(false);
    const deadlyFromMin = ref(0);
    const deadlyFromMax = ref(5);
    // Use Distance filter data
    const useDistanceEnabled = ref(false);
    const useDistanceMin = ref(0);
    const useDistanceMax = ref(5);
    // Item Size filter data
    const itemSizeEnabled = ref(false);
    const itemSizeMin = ref(0.5);
    const itemSizeMax = ref(3);
    // Min Pickup Age filter data
    const minPickupAgeEnabled = ref(false);
    const minPickupAgeMin = ref(0);
    const minPickupAgeMax = ref(20);
    // Speed filter data
    const speedEnabled = ref(false);
    const speedMin = ref(0);
    const speedMax = ref(3);
    // Movement Type filter data
    const movementTypeEnabled = ref(false);
    const movementTypeValues = ref([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    // Column visibility toggles
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

    let filterTimeout = null; // Track the timeout

    const updateHideUncraftable = () => {
      props.toggleHideUncraftable();
    };

    const submitIfAuto = (event) => {
      if (instaFilter.value) {
        setupSubmit(event);
      }
    };

    const setupSubmit = async (_event) => {
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
