<template>
  <v-form @submit.prevent="submit">
    <v-sheet class="mx-auto" theme="dark">
      <v-container class="ga-0">
        <!-- Filter control -->
        <v-row align-content="center">
          <v-col cols="10">
            <v-select
              class="mb-n6"
              label="Filters"
              :items="filterNames"
              v-model="activeFilters"
              @update:modelValue="saveAndSubmit('activeFilters', activeFilters, true)"
              multiple
            ></v-select>
          </v-col>
          <v-col align-self="center" cols="2">
            <v-btn class="light-button" color="#0066cc" @click="setFiltersToDefaults()">Reset</v-btn>
          </v-col>
        </v-row>

        <!-- Blocks Walking filter -->
        <v-row class="mt-n3" v-if="activeFilters.includes('blocksWalking')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Blocks Walking</v-btn>
          </v-col>
          <v-col>
            <v-btn-toggle color="#366b7d" density="compact" v-model="blocksWalkingValues" divided multiple @update:modelValue="saveAndSubmit('blocksWalkingValues', blocksWalkingValues, true)">
              <v-btn
                v-for="(type, index) in ['True', 'False']"
                :key="index"
                slim
                :variant="blocksWalkingValues.includes(index) ? 'elevated' : 'outlined'"
              >
                {{ type }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('blocksWalking')"></v-btn>
          </v-col>
        </v-row>

        <!-- Clothing Type filter -->
        <v-row class="mt-n3" v-if="activeFilters.includes('clothingType')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Clothing Type</v-btn>
          </v-col>
          <v-col>
            <v-btn-toggle color="#366b7d" density="compact" v-model="clothingTypeValues" divided multiple @update:modelValue="saveAndSubmit('clothingTypeValues', clothingTypeValues, true)">
              <v-btn
                v-for="(type, index) in ['Head', 'Top', 'Bottom', 'Shoe', 'Pack', 'None']"
                :key="index"
                slim
                :variant="clothingTypeValues.includes(index) ? 'elevated' : 'outlined'"
              >
                {{ type }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('clothingType')"></v-btn>
          </v-col>
        </v-row>

        <!-- Deadly From filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('deadlyFrom')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Deadly From</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="deadlyFromMin" density="compact" @update:modelValue="saveAndSubmit('deadlyFromMin', deadlyFromMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="deadlyFromMax" density="compact" @update:modelValue="saveAndSubmit('deadlyFromMax', deadlyFromMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('deadlyFrom')"></v-btn>
          </v-col>
        </v-row>

        <!-- Difficulty filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('difficulty')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Difficulty</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="difficultyMin" density="compact" @update:modelValue="saveAndSubmit('difficultyMin', difficultyMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="difficultyMax" density="compact" @update:modelValue="saveAndSubmit('difficultyMax', difficultyMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('difficulty')"></v-btn>
          </v-col>
        </v-row>

        <!-- Food - Bonus filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('bonusFood')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Food - Bonus</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="bonusFoodMin" density="compact" @update:modelValue="saveAndSubmit('bonusFoodMin', bonusFoodMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="bonusFoodMax" density="compact" @update:modelValue="saveAndSubmit('bonusFoodMax', bonusFoodMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('bonusFood')"></v-btn>
          </v-col>
        </v-row>

        <!-- Food - Immediate filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('immediateFood')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Food - Immediate</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="immediateFoodMin" density="compact" @update:modelValue="saveAndSubmit('immediateFoodMin', immediateFoodMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="immediateFoodMax" density="compact" @update:modelValue="saveAndSubmit('immediateFoodMax', immediateFoodMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('immediateFood')"></v-btn>
          </v-col>
        </v-row>

        <!-- Food - Total filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('totalFood')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Food - Total</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="totalFoodMin" density="compact" @update:modelValue="saveAndSubmit('totalFoodMin', totalFoodMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="totalFoodMax" density="compact" @update:modelValue="saveAndSubmit('totalFoodMax', totalFoodMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('totalFood')"></v-btn>
          </v-col>
        </v-row>

        <!-- Insulation filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('insulation')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Insulation</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="insulationMin" density="compact" @update:modelValue="saveAndSubmit('insulationMin', insulationMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="insulationMax" density="compact" @update:modelValue="saveAndSubmit('insulationMax', insulationMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('insulation')"></v-btn>
          </v-col>
        </v-row>

        <!-- Item size filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('itemSize')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Item Size</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="itemSizeMin" density="compact" @update:modelValue="saveAndSubmit('itemSizeMin', itemSizeMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="itemSizeMax" density="compact" @update:modelValue="saveAndSubmit('itemSizeMax', itemSizeMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('itemSize')"></v-btn>
          </v-col>
        </v-row>

        <!-- Min Pickup Age filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('minPickupAge')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Min Pickup Age</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="minPickupAgeMin" density="compact" @update:modelValue="saveAndSubmit('minPickupAgeMin', minPickupAgeMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="minPickupAgeMax" density="compact" @update:modelValue="saveAndSubmit('minPickupAgeMax', minPickupAgeMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('minPickupAge')"></v-btn>
          </v-col>
        </v-row>

        <!-- Movement Type filter -->
        <v-row class="mt-n3" v-if="activeFilters.includes('movementType')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Movement Type</v-btn>
          </v-col>
          <v-col>
            <v-btn-toggle color="#366b7d" density="compact" v-model="movementTypeValues" divided multiple @update:modelValue="saveAndSubmit('movementTypeValues', movementTypeValues, true)">
              <v-btn
                v-for="(type, index) in ['None', 'Chase', 'Flee', 'Random', 'North', 'South', 'East', 'West', 'Find']"
                :key="index"
                slim
                :variant="movementTypeValues.includes(index) ? 'elevated' : 'outlined'"
              >
                {{ type }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('movementType')"></v-btn>
          </v-col>
        </v-row>

        <!-- Permanent filter -->
        <v-row class="mt-n3" v-if="activeFilters.includes('permanent')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Permanent</v-btn>
          </v-col>
          <v-col>
            <v-btn-toggle color="#366b7d" density="compact" v-model="permanentValues" divided multiple @update:modelValue="saveAndSubmit('permanentValues', permanentValues, true)">
              <v-btn
                v-for="(type, index) in ['True', 'False']"
                :key="index"
                slim
                :variant="permanentValues.includes(index) ? 'elevated' : 'outlined'"
              >
                {{ type }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('permanent')"></v-btn>
          </v-col>
        </v-row>

        <!-- Slot Count filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('numSlots')" align-content="center">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Slots</v-btn>
          </v-col>
          <v-col align-self="center">
            <v-text-field hide-details class="custom-text-field" label="Min" v-model="numSlotsMin" density="compact" @update:modelValue="saveAndSubmit('numSlotsMin', numSlotsMin, true)" />
          </v-col>
          <v-col align-self="center">
            <v-text-field hide-details class="custom-text-field" label="Max" v-model="numSlotsMax" density="compact" @update:modelValue="saveAndSubmit('numSlotsMax', numSlotsMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('numSlots')"></v-btn>
          </v-col>
        </v-row>

        <!-- Slot Size filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('slotSize')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Slot Size</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="slotSizeMin" density="compact" @update:modelValue="saveAndSubmit('slotSizeMin', slotSizeMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="slotSizeMax" density="compact" @update:modelValue="saveAndSubmit('slotSizeMax', slotSizeMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('slotSize')"></v-btn>
          </v-col>
        </v-row>

        <!-- Spawns In filter -->
        <v-row class="mt-n3" v-if="activeFilters.includes('spawnsIn')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Spawns In</v-btn>
          </v-col>
          <v-col>
            <v-btn-toggle color="#366b7d" v-model="spawnsInValues" divided multiple @update:modelValue="saveAndSubmit('spawnsInValues', spawnsInValues, true)">
              <v-btn
                v-tippy="{content: biome.name, theme: 'twotech', animation: 'scale'}"
                v-for="(biome, index) in biomes"
                :key="biome.id"
                :variant="spawnsInValues.includes(index) ? 'elevated' : 'outlined'"
              >
                <BiomeImage :biome="biome" />
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('spawnsIn')"></v-btn>
          </v-col>
        </v-row>

        <!-- Speed filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('speed')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Speed</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="speedMin" density="compact" @update:modelValue="saveAndSubmit('speedMin', speedMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="speedMax" density="compact" @update:modelValue="saveAndSubmit('speedMax', speedMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('speed')"></v-btn>
          </v-col>
        </v-row>

        <!-- Use Chance filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('useChance')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Use Chance</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="useChanceMin" density="compact" @update:modelValue="saveAndSubmit('useChanceMin', useChanceMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="useChanceMax" density="compact" @update:modelValue="saveAndSubmit('useChanceMax', useChanceMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('useChance')"></v-btn>
          </v-col>
        </v-row>

        <!-- Use Distance filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('useDistance')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Use Distance</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="useDistanceMin" density="compact" @update:modelValue="saveAndSubmit('useDistanceMin', useDistanceMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="useDistanceMax" density="compact" @update:modelValue="saveAndSubmit('useDistanceMax', useDistanceMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('useDistance')"></v-btn>
          </v-col>
        </v-row>

        <!-- Uses filter -->
        <v-row  class="mt-n5 mb-n5" v-if="activeFilters.includes('uses')">
          <v-col align-self="center" cols="2">
            <v-btn density="compact" variant="text" disabled="true">Uses</v-btn>
          </v-col>
          <v-col>
            <v-text-field hide-details label="Min" v-model="usesMin" density="compact" @update:modelValue="saveAndSubmit('usesMin', usesMin, true)" />
          </v-col>
          <v-col>
            <v-text-field hide-details label="Max" v-model="usesMax" density="compact" @update:modelValue="saveAndSubmit('usesMax', usesMax, true)" />
          </v-col>
          <v-col cols="1">
            <v-btn slim icon="mdi-close" color="#aa0909" density="comfortable" @click="removeFilter('uses')"></v-btn>
          </v-col>
        </v-row>

        <!-- Insta-filter, Filter, and Hide uncraftable controls -->
        <v-row justify="center mb-n8" dense>
          <v-col cols="4" class="d-flex justify-end">
            <v-switch color="primary" label="Insta-filter" v-model="instaFilter" @update:modelValue="saveAndSubmit('instaFilter', instaFilter, true)"></v-switch>
          </v-col>
          <v-col cols="3">
            <v-btn :disabled="instaFilter" class="light-button mt-2" type="submit" color="primary" active-color="#bbb" button-disabled-opacity="0.26" block>Filter</v-btn>
          </v-col>
          <v-col cols="5">
            <div class="objectCraftableSelection">
              <v-switch color="primary" label="Only craftable" v-model="localHideUncraftable" @update:modelValue="updateHideUncraftable" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <br />
    <v-sheet class="mx-auto" theme="dark">
      <v-container>
        <!-- Column selection controls -->
        <!-- <v-row justify="center" class="mt-4">
        Columns to Show
        </v-row> -->
        <!-- Column control -->
        <v-row align-content="center">
          <v-col cols="10">
            <v-select
              class="mb-n6"
              label="Columns"
              :items="allHeaders"
              v-model="selectedHeaderControls"
              @update:modelValue="updateTableHeaders()"
              multiple
            ></v-select>
          </v-col>
          <v-col align-self="center" cols="2">
            <v-btn class="light-button" color="#0066cc" @click="setColumnsToDefaults()">Reset</v-btn>
          </v-col>
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
                    <v-list-item class="nostyle" :to="extraObjectData.find(o => o.name === item.object).url">
                      <div class="image-container">
                        <ObjectImage :object="extraObjectData.find(o => o.name === item.object)" />
                        {{ item.object }}
                      </div>
                    </v-list-item>
                  </v-list>
                </td>

                <!-- Loop through the selected fields to dynamically render the <td> with static width -->
                <td v-for="header in visibleHeaders" :key="header.value" :style="{ width: header.width }">
                  <div v-if="header.value === 'insulation'" class="text-wrapper">{{ item[header.value] }}%</div>
                  <div v-else class="text-wrapper">{{ item[header.value] }}</div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-row>
      </v-container>
    </v-sheet>
  </v-form>
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
const DEFAULT_DIFFICULTY = { enabled: false, min: 0.0, max: 1.0 };
const DEFAULT_SPAWNS_IN = { enabled: false, values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] };
const DEFAULT_IMMEDIATE_FOOD = { enabled: false, min: 0, max: 10 };
const DEFAULT_BONUS_FOOD = { enabled: false, min: 0, max: 20 };
const DEFAULT_TOTAL_FOOD = { enabled: false, min: 0, max: 25 };
const DEFAULT_USES = { enabled: false, min: 0, max: 100 };
const DEFAULT_USE_CHANCE = { enabled: false, min: 0.0, max: 1.0 };
const DEFAULT_INSULATION = { enabled: false, min: 0, max: 100 };
const DEFAULT_DEADLY_FROM = { enabled: false, min: 0, max: 5 };
const DEFAULT_USE_DISTANCE = { enabled: false, min: 0, max: 5 };
const DEFAULT_ITEM_SIZE = { enabled: false, min: 0.5, max: 3 };
const DEFAULT_MIN_PICKUP_AGE = { enabled: false, min: 0, max: 20 };
const DEFAULT_SPEED = { enabled: false, min: 0, max: 3 };
const DEFAULT_MOVEMENT_TYPE = { enabled: false, values: [0, 1, 2, 3, 4, 5, 6, 7, 8] };
const DEFAULT_BLOCKS_WALKING = { enabled: false, includeTrueFalse: [0, 1] };
const DEFAULT_PERMANENT = { enabled: false, includeTrueFalse: [0, 1] };

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
    const numSlotsMin = ref(DEFAULT_NUM_SLOTS.min);
    const numSlotsMax = ref(DEFAULT_NUM_SLOTS.max);
    // Slot Size filter data
    const slotSizeMin = ref(DEFAULT_SLOT_SIZE.min);
    const slotSizeMax = ref(DEFAULT_SLOT_SIZE.max);
    // Clothing Type filter data
    const clothingTypeValues = ref(DEFAULT_CLOTHING_TYPE.values);
    // Difficulty filter data
    const difficultyMin = ref(DEFAULT_DIFFICULTY.min);
    const difficultyMax = ref(DEFAULT_DIFFICULTY.max);
    // Spawns In filter data
    const spawnsInValues = ref(DEFAULT_SPAWNS_IN.values);
    const biomes = computed(() => Biome.biomes());
    // Immediate Food filter data
    const immediateFoodMin = ref(DEFAULT_IMMEDIATE_FOOD.min);
    const immediateFoodMax = ref(DEFAULT_IMMEDIATE_FOOD.max);
    // Bonus Food filter data
    const bonusFoodMin = ref(DEFAULT_BONUS_FOOD.min);
    const bonusFoodMax = ref(DEFAULT_BONUS_FOOD.max);
    // Total Food filter data
    const totalFoodMin = ref(DEFAULT_TOTAL_FOOD.min);
    const totalFoodMax = ref(DEFAULT_TOTAL_FOOD.max);
    // Uses filter data
    const usesMin = ref(DEFAULT_USES.min);
    const usesMax = ref(DEFAULT_USES.max);
    // Use Chance filter data
    const useChanceMin = ref(DEFAULT_USE_CHANCE.min);
    const useChanceMax = ref(DEFAULT_USE_CHANCE.max);
    // Insulation filter data
    const insulationMin = ref(DEFAULT_INSULATION.min);
    const insulationMax = ref(DEFAULT_INSULATION.max);
    // Deadly From filter data
    const deadlyFromMin = ref(DEFAULT_DEADLY_FROM.min);
    const deadlyFromMax = ref(DEFAULT_DEADLY_FROM.max);
    // Use Distance filter data
    const useDistanceMin = ref(DEFAULT_USE_DISTANCE.min);
    const useDistanceMax = ref(DEFAULT_USE_DISTANCE.max);
    // Item Size filter data
    const itemSizeMin = ref(DEFAULT_ITEM_SIZE.min);
    const itemSizeMax = ref(DEFAULT_ITEM_SIZE.max);
    // Min Pickup Age filter data
    const minPickupAgeMin = ref(DEFAULT_MIN_PICKUP_AGE.min);
    const minPickupAgeMax = ref(DEFAULT_MIN_PICKUP_AGE.max);
    // Speed filter data
    const speedMin = ref(DEFAULT_SPEED.min);
    const speedMax = ref(DEFAULT_SPEED.max);
    // Movement Type filter data
    const movementTypeValues = ref(DEFAULT_MOVEMENT_TYPE.values);
    // Blocks Walking filter data
    const blocksWalkingValues = ref(DEFAULT_BLOCKS_WALKING.includeTrueFalse);
    // Permanent filter data
    const permanentValues = ref(DEFAULT_PERMANENT.includeTrueFalse);

    const filterNames = [
      { title: "Blocks Walking", value: "blocksWalking" },
      { title: "Clothing Type", value: "clothingType" },
      { title: "Deadly From", value: "deadlyFrom" },
      { title: "Difficulty", value: "difficulty" },
      { title: "Food - Bonus", value: "bonusFood" },
      { title: "Food - Immediate", value: "immediateFood" },
      { title: "Food - Total", value: "totalFood" },
      { title: "Insulation", value: "insulation" },
      { title: "Item Size", value: "itemSize" },
      { title: "Min Pickup Age", value: "minPickupAge" },
      { title: "Movement Type", value: "movementType" },
      { title: "Permanent", value: "permanent" },
      { title: "Slot Size", value: "slotSize" },
      { title: "Slots", value: "numSlots" },
      { title: "Spawns In", value: "spawnsIn" },
      { title: "Speed", value: "speed" },
      { title: "Use Chance", value: "useChance" },
      { title: "Use Distance", value: "useDistance" },
      { title: "Uses", value: "uses" },
    ];
    const activeFilters = ref([]);

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
    const showBlocksWalking = ref(DEFAULT_COLUMNS.showBlocksWalking);
    const showPermanent = ref(DEFAULT_COLUMNS.showPermanent);

    // Define the full set of headers/columns
    const allHeaders = [
      { title: 'Blocks Walking', key: 'Blocks Walking', value: 'blocksWalking', visible: showBlocksWalking, width: '80px', sortable: true },
      { title: 'Clothing Type', key: 'Clothing Type', value: 'clothingType', visible: showClothingType, width: '100px', sortable: true },
      { title: 'Craftable', key: 'Craftable', value: 'craftable', visible: showCraftable, width: '100px', sortable: true },
      { title: 'Deadly From', key: 'Deadly From', value: 'deadlyFrom', visible: showDeadlyFrom, width: '80px', sortable: true },
      { title: 'Difficulty', key: 'Difficulty', value: 'difficulty', visible: showDifficulty, width: '100px', sortable: true },
      { title: 'Food - Bonus', key: 'Bonus Food', value: 'bonusFood', visible: showBonusFood, width: '80px', sortable: true },
      { title: 'Food - Immediate', key: 'Immediate Food', value: 'immediateFood', visible: showImmediateFood, width: '80px', sortable: true },
      { title: 'Food - Total', key: 'Total Food', value: 'totalFood', visible: showTotalFood, width: '80px', sortable: true },
      { title: 'Insulation', key: 'Insulation', value: 'insulation', visible: showInsulation, width: '80px', sortable: true },
      { title: 'Item Size', key: 'Item Size', value: 'itemSize', visible: showItemSize, width: '80px', sortable: true },
      { title: 'Min Pickup Age', key: 'Min Pickup Age', value: 'minPickupAge', visible: showMinPickupAge, width: '80px', sortable: true },
      { title: 'Movement Type', key: 'Movement Type', value: 'movementType', visible: showMovementType, width: '80px', sortable: true },
      { title: 'Permanent', key: 'Permanent', value: 'permanent', visible: showPermanent, width: '80px', sortable: true },
      { title: 'Slots', key: 'Slots', value: 'numSlots', visible: showNumSlots, width: '80px', sortable: true },
      { title: 'Slot Size', key: 'Slot Size', value: 'slotSize', visible: showSlotSize, width: '80px', sortable: true },
      { title: 'Spawns In', key: 'Spawns In', value: 'spawnsIn', visible: showSpawnsIn, width: '200px', sortable: true },
      { title: 'Speed', key: 'Speed', value: 'speed', visible: showSpeed, width: '80px', sortable: true },
      { title: 'Use Chance', key: 'Use Chance', value: 'useChance', visible: showUseChance, width: '80px', sortable: true },
      { title: 'Use Distance', key: 'Use Distance', value: 'useDistance', visible: showUseDistance, width: '80px', sortable: true },
      { title: 'Uses', key: 'Uses', value: 'uses', visible: showUses, width: '80px', sortable: true },
    ];

    // Dynamically compute the headers based on the column visibility
    const tableHeaders = computed(() => [
      { title: 'Object', key: 'Object', value: 'object', visible: true, width: '230px', sortable: true }, // Object column always visible
      ...allHeaders.filter((header) => headerControls.value[header.value].control.value === true),
    ]);

    const visibleHeaders = computed(() => {
      let ret = allHeaders.filter((header) => {
        return headerControls.value[header.value].control.value === true;
      });
      return ret;
    });

    const selectedHeaderControls = ref(allHeaders.filter(h => h.visible.value === true).map(h => h.value));

    const headerControls = computed(() => {
      return {
        numSlots: {name: 'showNumSlots', control: showNumSlots },
        slotSize: {name: 'showSlotSize', control: showSlotSize},
        clothingType: {name: 'showClothingType', control: showClothingType},
        difficulty: {name: 'showDifficulty', control: showDifficulty},
        craftable: {name: 'showCraftable', control: showCraftable},
        spawnsIn: {name: 'showSpawnsIn', control: showSpawnsIn},
        immediateFood: {name: 'showImmediateFood', control: showImmediateFood},
        bonusFood: {name: 'showBonusFood', control: showBonusFood},
        totalFood: {name: 'showTotalFood', control: showTotalFood},
        uses: {name: 'showUses', control: showUses},
        useChance: {name: 'showUseChance', control: showUseChance},
        insulation: {name: 'showInsulation', control: showInsulation},
        deadlyFrom: {name: 'showDeadlyFrom', control: showDeadlyFrom},
        useDistance: {name: 'showUseDistance', control: showUseDistance},
        itemSize: {name: 'showItemSize', control: showItemSize},
        minPickupAge: {name: 'showMinPickupAge', control: showMinPickupAge},
        speed: {name: 'showSpeed', control: showSpeed},
        movementType: {name: 'showMovementType', control: showMovementType},
        blocksWalking: {name: 'blocksWalking', control: showBlocksWalking},
        permanent: {name: 'permanent', control: showPermanent},
      };
    });

    const updateTableHeaders = () => {
      // we need to update the coresponding reactive controls for each table header
      for (const headerControl in headerControls.value) {
        headerControls.value[headerControl].control.value = (selectedHeaderControls.value.includes(headerControl));
        // Save the new control state for this control so it remembers until browser cache is cleared
        saveControlState(headerControls.value[headerControl].name, headerControls.value[headerControl].control.value);
      }
    };

    // Save control state to BrowserStorage
    const saveControlState = (key, value) => {
      BrowserStorage.setItem(key, JSON.stringify(value));
    };

    // Load control state from BrowserStorage on mounted
    const loadControlState = (key, refValue, defaultValue) => {
      const savedValue = BrowserStorage.getItem(key);
      if (savedValue && savedValue !== "undefined") { // Add this condition to avoid undefined
        try {
          refValue.value = JSON.parse(savedValue);
        } catch (e) {
          console.error(`Error parsing saved value for ${key}:`, e);
          refValue.value = defaultValue; // Fallback to default in case of any parsing errors
        }
      } else {
        refValue.value = defaultValue;
      }
    };


    // Function that saves control state and triggers submit if necessary
    const saveAndSubmit = (key, value, ifAuto = false) => {
      saveControlState(key, value);
      if (ifAuto) {
        submitIfAuto();
      } else {
        setupSubmit();
      }
    };

    const removeFilter = (filterName) => {
      let filterIndex = activeFilters.value.indexOf(filterName);
      if (filterIndex >= 0) activeFilters.value.splice(filterIndex, 1);
      saveAndSubmit('activeFilters', activeFilters.value, true);
    }

    const setFiltersToDefaults = () => {
      activeFilters.value = [];
      saveControlState('activeFilters', []);

      // Num Slots
      numSlotsMin.value = DEFAULT_NUM_SLOTS.min;
      numSlotsMax.value = DEFAULT_NUM_SLOTS.max;
      saveControlState('numSlotsMin', DEFAULT_NUM_SLOTS.min);
      saveControlState('numSlotsMax', DEFAULT_NUM_SLOTS.max);

      // Slot Size
      slotSizeMin.value = DEFAULT_SLOT_SIZE.min;
      slotSizeMax.value = DEFAULT_SLOT_SIZE.max;
      saveControlState('slotSizeMin', DEFAULT_SLOT_SIZE.min);
      saveControlState('slotSizeMax', DEFAULT_SLOT_SIZE.max);

      // Clothing Type
      clothingTypeValues.value = DEFAULT_CLOTHING_TYPE.values;
      saveControlState('clothingTypeValues', DEFAULT_CLOTHING_TYPE.values);

      // Difficulty
      difficultyMin.value = DEFAULT_DIFFICULTY.min;
      difficultyMax.value = DEFAULT_DIFFICULTY.max;
      saveControlState('difficultyMin', DEFAULT_DIFFICULTY.min);
      saveControlState('difficultyMax', DEFAULT_DIFFICULTY.max);

      // Spawns In
      spawnsInValues.value = DEFAULT_SPAWNS_IN.values;
      saveControlState('spawnsInValues', DEFAULT_SPAWNS_IN.values);

      // Immediate Food
      immediateFoodMin.value = DEFAULT_IMMEDIATE_FOOD.min;
      immediateFoodMax.value = DEFAULT_IMMEDIATE_FOOD.max;
      saveControlState('immediateFoodMin', DEFAULT_IMMEDIATE_FOOD.min);
      saveControlState('immediateFoodMax', DEFAULT_IMMEDIATE_FOOD.max);

      // Bonus Food
      bonusFoodMin.value = DEFAULT_BONUS_FOOD.min;
      bonusFoodMax.value = DEFAULT_BONUS_FOOD.max;
      saveControlState('bonusFoodMin', DEFAULT_BONUS_FOOD.min);
      saveControlState('bonusFoodMax', DEFAULT_BONUS_FOOD.max);

      // Total Food
      totalFoodMin.value = DEFAULT_TOTAL_FOOD.min;
      totalFoodMax.value = DEFAULT_TOTAL_FOOD.max;
      saveControlState('totalFoodMin', DEFAULT_TOTAL_FOOD.min);
      saveControlState('totalFoodMax', DEFAULT_TOTAL_FOOD.max);

      // Uses
      usesMin.value = DEFAULT_USES.min;
      usesMax.value = DEFAULT_USES.max;
      saveControlState('usesMin', DEFAULT_USES.min);
      saveControlState('usesMax', DEFAULT_USES.max);

      // Use Chance
      useChanceMin.value = DEFAULT_USE_CHANCE.min;
      useChanceMax.value = DEFAULT_USE_CHANCE.max;
      saveControlState('useChanceMin', DEFAULT_USE_CHANCE.min);
      saveControlState('useChanceMax', DEFAULT_USE_CHANCE.max);

      // Insulation
      insulationMin.value = DEFAULT_INSULATION.min;
      insulationMax.value = DEFAULT_INSULATION.max;
      saveControlState('insulationMin', DEFAULT_INSULATION.min);
      saveControlState('insulationMax', DEFAULT_INSULATION.max);

      // Deadly From
      deadlyFromMin.value = DEFAULT_DEADLY_FROM.min;
      deadlyFromMax.value = DEFAULT_DEADLY_FROM.max;
      saveControlState('deadlyFromMin', DEFAULT_DEADLY_FROM.min);
      saveControlState('deadlyFromMax', DEFAULT_DEADLY_FROM.max);

      // Use Distance
      useDistanceMin.value = DEFAULT_USE_DISTANCE.min;
      useDistanceMax.value = DEFAULT_USE_DISTANCE.max;
      saveControlState('useDistanceMin', DEFAULT_USE_DISTANCE.min);
      saveControlState('useDistanceMax', DEFAULT_USE_DISTANCE.max);

      // Item Size
      itemSizeMin.value = DEFAULT_ITEM_SIZE.min;
      itemSizeMax.value = DEFAULT_ITEM_SIZE.max;
      saveControlState('itemSizeMin', DEFAULT_ITEM_SIZE.min);
      saveControlState('itemSizeMax', DEFAULT_ITEM_SIZE.max);

      // Min Pickup Age
      minPickupAgeMin.value = DEFAULT_MIN_PICKUP_AGE.min;
      minPickupAgeMax.value = DEFAULT_MIN_PICKUP_AGE.max;
      saveControlState('minPickupAgeMin', DEFAULT_MIN_PICKUP_AGE.min);
      saveControlState('minPickupAgeMax', DEFAULT_MIN_PICKUP_AGE.max);

      // Speed
      speedMin.value = DEFAULT_SPEED.min;
      speedMax.value = DEFAULT_SPEED.max;
      saveControlState('speedMin', DEFAULT_SPEED.min);
      saveControlState('speedMax', DEFAULT_SPEED.max);

      // Movement Type
      movementTypeValues.value = DEFAULT_MOVEMENT_TYPE.values;
      saveControlState('movementTypeValues', DEFAULT_MOVEMENT_TYPE.values);

      // Blocks Walking
      blocksWalkingValues.value = DEFAULT_BLOCKS_WALKING.includeTrueFalse;
      saveControlState('blocksWalkingValues', DEFAULT_BLOCKS_WALKING.includeTrueFalse);

      // Permanent
      permanentValues.value = DEFAULT_PERMANENT.includeTrueFalse;
      saveControlState('permanentValues', DEFAULT_PERMANENT.includeTrueFalse);

      submitIfAuto();
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

      selectedHeaderControls.value = allHeaders.filter(h => h.visible.value === true).map(h => h.value);
    };

    // Load all saved states on mount
    onMounted(() => {
      loadControlState('activeFilters', activeFilters, []);
      loadControlState('numSlotsMin', numSlotsMin, 0);
      loadControlState('numSlotsMax', numSlotsMax, 27);
      loadControlState('slotSizeMin', slotSizeMin, 0);
      loadControlState('slotSizeMax', slotSizeMax, 3);
      loadControlState('clothingTypeValues', clothingTypeValues, [0, 1, 2, 3, 4, 5]);
      loadControlState('difficultyMin', difficultyMin, 0.0);
      loadControlState('difficultyMax', difficultyMax, 3.0);
      loadControlState('spawnsInValues', spawnsInValues, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      loadControlState('immediateFoodMin', immediateFoodMin, 0);
      loadControlState('immediateFoodMax', immediateFoodMax, 10);
      loadControlState('bonusFoodMin', bonusFoodMin, 0);
      loadControlState('bonusFoodMax', bonusFoodMax, 20);
      loadControlState('totalFoodMin', totalFoodMin, 0);
      loadControlState('totalFoodMax', totalFoodMax, 25);
      loadControlState('usesMin', usesMin, 0);
      loadControlState('usesMax', usesMax, 100);
      loadControlState('useChanceMin', useChanceMin, 0.0);
      loadControlState('useChanceMax', useChanceMax, 1.0);
      loadControlState('insulationMin', insulationMin, 0);
      loadControlState('insulationMax', insulationMax, 100);
      loadControlState('deadlyFromMin', deadlyFromMin, 0);
      loadControlState('deadlyFromMax', deadlyFromMax, 5);
      loadControlState('useDistanceMin', useDistanceMin, 0);
      loadControlState('useDistanceMax', useDistanceMax,  5);
      loadControlState('itemSizeMin', itemSizeMin, 0.5);
      loadControlState('itemSizeMax', itemSizeMax, 3);
      loadControlState('minPickupAgeMin', minPickupAgeMin, 0);
      loadControlState('minPickupAgeMax', minPickupAgeMax, 20);
      loadControlState('speedMin', speedMin, 0);
      loadControlState('speedMax', speedMax, 3);
      loadControlState('movementTypeValues', movementTypeValues, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
      loadControlState('blocksWalkingValues', blocksWalkingValues, [0, 1]);
      loadControlState('permanentValues', permanentValues, [0, 1]);
      
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
      selectedHeaderControls.value = allHeaders.filter(h => h.visible.value === true).map(h => h.value);

      loadControlState('instaFilter', instaFilter, true);

      setupSubmit();
    });

    const displayed_data = (object) => {
      return {
        "object": object.name,
        "blocksWalking": object.blocksWalking || false,
        "clothingType": object.clothingType || "None",
        "craftable": object.craftable || false,
        "deadlyFrom": object.deadlyDistance,
        "difficulty": object.difficulty || 0.0,
        "immediateFood": object.immediateFood || 0,
        "bonusFood": object.bonusFood || 0,
        "totalFood": object.totalFood || 0,
        "itemSize": object.size,
        "insulation": object.insulation,
        "minPickupAge": object.minPickupAge,
        "movementType": object.moveType,
        "permanent": object.permanent || false,
        "numSlots": object.numSlots || 0,
        "slotSize": object.slotSize,
        "spawnsIn": object.biomes.join(", "),
        "speed": object.speedMult,
        "useChance": object.useChance,
        "useDistance": object.useDistance,
        "uses": object.numUses || 0,
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
        if (activeFilters.value.includes("numSlots")) {
          filters.push({
            name: "numSlots",
            min: numSlotsMin.value,
            max: numSlotsMax.value,
          });
        }
        if (activeFilters.value.includes("slotSize")) {
          filters.push({
            name: "slotSize",
            min: slotSizeMin.value,
            max: slotSizeMax.value,
          });
        }
        if (activeFilters.value.includes("clothingType")) {
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
        if (activeFilters.value.includes("difficulty")) {
          filters.push({
            name: "difficulty",
            min: difficultyMin.value,
            max: difficultyMax.value,
          });
        }
        if (activeFilters.value.includes("spawnsIn")) {
          filters.push({
            name: "spawnsIn",
            includeGrasslands: spawnsInValues.value.includes(0),
            includeSwamps: spawnsInValues.value.includes(1),
            includeYellowPrairies: spawnsInValues.value.includes(2),
            includeBadlands: spawnsInValues.value.includes(3),
            includeTundra: spawnsInValues.value.includes(4),
            includeDesert: spawnsInValues.value.includes(5),
            includeJungle: spawnsInValues.value.includes(6),
            includeDeepWater: spawnsInValues.value.includes(7),
            includeFlowerFields: spawnsInValues.value.includes(8),
            includeShallowWater: spawnsInValues.value.includes(9),
          })
        }
        if (activeFilters.value.includes("immediateFood")) {
          filters.push({
            name: "immediateFood",
            min: immediateFoodMin.value,
            max: immediateFoodMax.value,
          });
        }
        if (activeFilters.value.includes("bonusFood")) {
          filters.push({
            name: "bonusFood",
            min: bonusFoodMin.value,
            max: bonusFoodMax.value,
          });
        }
        if (activeFilters.value.includes("totalFood")) {
          filters.push({
            name: "totalFood",
            min: totalFoodMin.value,
            max: totalFoodMax.value,
          });
        }
        if (activeFilters.value.includes("uses")) {
          filters.push({
            name: "uses",
            min: usesMin.value,
            max: usesMax.value,
          });
        }
        if (activeFilters.value.includes("useChance")) {
          filters.push({
            name: "useChance",
            min: useChanceMin.value,
            max: useChanceMax.value,
          });
        }
        if (activeFilters.value.includes("insulation")) {
          filters.push({
            name: "insulation",
            min: insulationMin.value,
            max: insulationMax.value,
          });
        }
        if (activeFilters.value.includes("deadlyFrom")) {
          filters.push({
            name: "deadlyFrom",
            min: deadlyFromMin.value,
            max: deadlyFromMax.value,
          });
        }
        if (activeFilters.value.includes("useDistance")) {
          filters.push({
            name: "useDistance",
            min: useDistanceMin.value,
            max: useDistanceMax.value,
          });
        }
        if (activeFilters.value.includes("itemSize")) {
          filters.push({
            name: "itemSize",
            min: itemSizeMin.value,
            max: itemSizeMax.value,
          });
        }
        if (activeFilters.value.includes("minPickupAge")) {
          filters.push({
            name: "minPickupAge",
            min: minPickupAgeMin.value,
            max: minPickupAgeMax.value,
          });
        }
        if (activeFilters.value.includes("speed")) {
          filters.push({
            name: "speed",
            min: speedMin.value,
            max: speedMax.value,
          });
        }
        if (activeFilters.value.includes("movementType")) {
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
        if (activeFilters.value.includes("blocksWalking")) {
          filters.push({
            name: "blocksWalking",
            includeTrue: blocksWalkingValues.value.includes(0),
            includeFalse: blocksWalkingValues.value.includes(1),
          })
        }
        if (activeFilters.value.includes("permanent")) {
          filters.push({
            name: "permanent",
            includeTrue: permanentValues.value.includes(0),
            includeFalse: permanentValues.value.includes(1),
          })
        }

        const results = GameObject.filter(filters).map(o => displayed_data(o));
        filtered_items.value = results;
      }, 0);
    };

    watch(() => props.hideUncraftable, (newVal) => {
      localHideUncraftable.value = newVal;
      submitIfAuto();
    });

    return {
      filterNames,
      activeFilters,
      instaFilter,
      setupSubmit,
      submitIfAuto,
      saveAndSubmit,
      removeFilter,
      saveControlState,
      setFiltersToDefaults,
      setColumnsToDefaults,
      filtered_items,

      numSlotsMin,
      numSlotsMax,
      slotSizeMin,
      slotSizeMax,
      clothingTypeValues,
      difficultyMin,
      difficultyMax,
      biomes,
      spawnsInValues,
      immediateFoodMin,
      immediateFoodMax,
      bonusFoodMin,
      bonusFoodMax,
      totalFoodMin,
      totalFoodMax,
      usesMin,
      usesMax,
      useChanceMin,
      useChanceMax,
      insulationMin,
      insulationMax,
      deadlyFromMin,
      deadlyFromMax,
      useDistanceMin,
      useDistanceMax,
      itemSizeMin,
      itemSizeMax,
      minPickupAgeMin,
      minPickupAgeMax,
      speedMin,
      speedMax,
      movementTypeValues,
      blocksWalkingValues,
      permanentValues,

      extraObjectData,
      localHideUncraftable,
      updateHideUncraftable,
      allHeaders,
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

      headerControls,
      selectedHeaderControls,
      updateTableHeaders,
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

.v-btn .biomeImage {
  background-size: cover;
  width: 30px; /* or whatever size fits */
  height: 30px;
}

.custom-text-field .v-input__control {
  min-height: 30px; /* Adjust the height */
  padding: 0px; /* Remove excess padding */
}

.custom-text-field .v-field {
  height: 30px; /* Reduce the field's height */
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.custom-text-field .v-field__input {
  height: 30px; /* Adjust input field height */
  line-height: normal;
}

.custom-text-field input {
  height: 30px; /* Input size */
  line-height: 30px; /* Align the text inside */
}

.custom-text-field .v-label {
  font-size: 12px; /* Smaller label size */
  line-height: 1;
}

.custom-text-field .v-input__details {
  margin-top: 0px;
}
</style>
