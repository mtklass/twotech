<template>
  <v-sheet class="mx-auto" theme="dark">
    <v-form @submit.prevent="submit">
      <v-container class="ga-0">
        <v-row class="mt-n6 mb-n14">
          <!-- Slot count filter -->
          <v-col>
            <v-switch color="primary" v-model="numSlotsEnabled" label="Slots"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!numSlotsEnabled" v-model="numSlotsMin" density="compact" @keyup="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!numSlotsEnabled" v-model="numSlotsMax" density="compact" @keyup="submitIfAuto()"/>
          </v-col>
        </v-row>
        <!-- Slot size filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col>
            <v-switch color="primary" v-model="slotSizeEnabled" label="Slot size"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!slotSizeEnabled" v-model="slotSizeMin" density="compact" @keyup="submitIfAuto()"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!slotSizeEnabled" v-model="slotSizeMax" density="compact" @keyup="submitIfAuto()"/>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="2">
            <v-switch color="primary" label="Insta-filter" v-model="instaFilter"></v-switch>
          </v-col>
          <v-col cols="3">
            <v-btn :disabled="instaFilter" class="search-submit mt-2" type="submit" color=#blue active-color=#bbb button-disabled-opacity="0.26" block>Filter</v-btn>
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
                    <!-- Note: This link has an issue, in that it doesn't change the URL in the browser.
                               This seems to cause issues on mobile -->
                    <v-list-item class="nostyle" :to="extraObjectData.find(o => o.name === item['Object']).url">
                      <div class="image-container">
                        <ObjectImage
                          :object="extraObjectData.find(o => o.name === item['Object'])"
                        />
                      </div>
                      <div>{{ item['Object'] }}</div>
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
import { ref, onMounted } from "vue";
import GameObject from '../models/GameObject';
import ObjectImage from "./ObjectImage";

export default {
  components: {
    ObjectImage,
  },
  setup() {
    const instaFilter = ref(true);
    const extraObjectData = GameObject.allExtraObjectsData().map(obj_data => { return {...obj_data, url: GameObject.find(obj_data.id).url()} });

    const numSlotsEnabled = ref(false);
    const numSlotsMin = ref(0);
    const numSlotsMax = ref(27);

    const slotSizeEnabled = ref(false);
    const slotSizeMin = ref(0);
    const slotSizeMax = ref(3);

    const displayed_data = (object) => {
      const biome_names = ["Grasslands", "Swamps", "Yellow Prairies", "Badlands", "Tundra", "Desert", "Jungle", "Deep Water", "Flower Fields", "Shallow Water"];
      return {
          "Object": object.name,
          "Difficulty": object.difficulty,
          "Slots": object.numSlots,
          "Slot Size": object.slotSize,
          "Clothing Type": object.clothing || 'n',
          "Craftable": object.craftable,
          "Spawns In": object.biomes?.map(b=>biome_names[b.id]),
        }
    }

    const filtered_items = ref(GameObject.allObjects().map(o => displayed_data(o)));

    const submitIfAuto = (event) => {
      if (instaFilter.value) {
        setupSubmit(event);
      }
    }

    const setupSubmit = (event) => {
      // console.log("event = ", JSON.stringify(event.target.elements));
      // We need to construct some filters to send to GameObject.js's filter() function
      let filters = [];
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
      console.time("Filtering");
      const results = GameObject.filter(filters).map(o => {
        return displayed_data(o);
      });
      console.timeEnd("Filtering");
      filtered_items.value = results;
    };

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
      extraObjectData,
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
  margin-bottom: 5px;
}

.text-center {
  text-align: center;
}
</style>