<template>
  <v-progress-linear
    v-model="objectLoading"
    height="25"
    color="blue"
  >
    <template v-slot:default="{ value }">
      <strong>Loading game object data... {{ Math.ceil(value) }}%</strong>
    </template>
  </v-progress-linear>
  <v-sheet class="mx-auto" theme="dark">
    <v-form @submit.prevent="submit">
      <v-container class="ga-0">
        <v-row class="mt-n6 mb-n14">
          <!-- Slot count filter -->
          <v-col>
            <v-switch v-model="numSlotsEnabled" label="Slots"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!numSlotsEnabled" v-model="numSlotsMin" density="compact" />
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!numSlotsEnabled" v-model="numSlotsMax" density="compact"/>
          </v-col>
        </v-row>
        <!-- Slot size filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col>
            <v-switch v-model="slotSizeEnabled" label="Slot size"></v-switch>
          </v-col>
          <v-col>
            <v-text-field label="Min" :disabled="!slotSizeEnabled" v-model="slotSizeMin" density="compact"/>
          </v-col>
          <v-col>
            <v-text-field label="Max" :disabled="!slotSizeEnabled" v-model="slotSizeMax" density="compact"/>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="3">
            <v-btn :disabled=loadingObjects class="search-submit mt-2" type="submit" color=#999 active-color=#bbb button-disabled-opacity="0.26" block>Filter</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-data-table
            theme="dark"
            :items-per-page-options="[10,20,30,40,50]"
            :items="filtered_items">
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.difficulty }}</td>
                <td>{{ item.slots }}</td>
                <td>{{ item.slotSize }}</td>
                <td>{{ item.clothingType }}</td>
                <td>{{ item.craftable }}</td>
                <td>{{ item.spawnsIn }}</td>
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

export default {
  setup() {
    let objectLoading = ref(0);
    let extraObjectData = GameObject.allExtraObjectsData();

    const loadingObjects = ref(true);

    const numSlotsEnabled = ref(false);
    const numSlotsMin = ref(0);
    const numSlotsMax = ref(27);

    const slotSizeEnabled = ref(false);
    const slotSizeMin = ref(0);
    const slotSizeMax = ref(3);

    const filtered_items = ref([]);
    const headers = {
      "name": { text: "Name", value: "name" },
      "difficulty": { text: "Difficulty", value: "difficulty" },
      "slots": { text: "Slots", value: "slots" },
      "slotSize": { text: "Slot Size", value: "slotSize" },
      "clothingType": { text: "Clothing Type", value: "clothingType" },
      "craftable": { text: "Craftable", value: "craftable" },
      "spawnsIn": { text: "Spawns In", value: "spawnsIn" },
    };
  
    let headerArray = Object.values(headers).map(h=>h.text);

    const displayed_data = (object) => {
      const biome_names = ["Grasslands", "Swamps", "Yellow Prairies", "Badlands", "Tundra", "Desert", "Jungle", "Deep Water", "Flower Fields", "Shallow Water"];
      return {
          [headers["name"].value]: object.name,
          [headers["difficulty"].value]: 0.21,
          [headers["slots"].value]: object.numSlots,
          [headers["slotSize"].value]: object.slotSize,
          [headers["clothingType"].value]: object.clothing || 'n',
          [headers["craftable"].value]: object.craftable,
          [headers["spawnsIn"].value]: object.biomes?.map(b=>biome_names[b.id]),
        }
    }
    const setup_submit = async (event) => {
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
      const results = (await GameObject.filter(filters)).map(o => {
        return displayed_data(o);
      });
      console.timeEnd("Filtering");
      filtered_items.value = results;
    };

    onMounted(async () => {
      // Make sure we start with no filtered items
      filtered_items.value = [];

      // Initialize the progress bar
      objectLoading.value = 0.0;

      let objects = GameObject.allObjects();
      const totalObjects = objects.length;
      const BATCH_SIZE = 50; // Adjust this size based on testing and performance needs

      let i = 0;
      for (let batchStart = 0; batchStart < totalObjects; batchStart += BATCH_SIZE) {
        // Create a batch of promises
        const batch = objects.slice(batchStart, batchStart + BATCH_SIZE).map(object => object.loadData());

        // Wait for the current batch to finish
        filtered_items.value = filtered_items.value.concat((await Promise.all(batch)).map(o => displayed_data(o)));

        // Update the progress bar after each batch
        i += BATCH_SIZE;
        objectLoading.value = Math.min((i / totalObjects) * 100, 100);
      }
      // Now that we've finished loading the values, we let the rest of the page
      loadingObjects.value = false;
    });

    return {
      headers,
      headerArray,
      loadingObjects,
      objectLoading,
      setup_submit,
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
      this.setup_submit(event);
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
</style>