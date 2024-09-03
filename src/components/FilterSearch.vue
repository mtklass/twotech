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
        <v-row>
          <v-btn class="mt-2" type="submit" block>Search</v-btn>
        </v-row>
        <v-row>
          <v-data-table width="100%" theme="dark" :items-per-page-options="[10,20,30,40,50]" :items="filtered_items"></v-data-table>
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

    const numSlotsEnabled = ref(false);
    const toggleSlotCountEnable = () => {numSlotsEnabled.value = !numSlotsEnabled.value};
    const numSlotsMin = ref(0);
    const numSlotsMax = ref(27);

    const slotSizeEnabled = ref(false);
    const toggleSlotSizeEnable = () => {slotSizeEnabled.value = !slotSizeEnabled.value};
    const slotSizeMin = ref(0);
    const slotSizeMax = ref(3);

    let _filtered_items = [];
    for (let i = 0; i < extraObjectData.length; i++) {
      // console.log("extraObjectData[i] = ", JSON.stringify(extraObjectData[i]));
      let objectData = GameObject.find(extraObjectData[i].id)
      _filtered_items.push({
        "Name": objectData.name,
        "Difficulty": extraObjectData[i].difficulty,
        "Slots": extraObjectData[i].numSlots,
        "Slot Size": objectData.slotSize,
        "Clothing Type": extraObjectData[i].clothingType,
        "Craftable": extraObjectData[i].craftable,
        "Spawns In": extraObjectData[i].biomes,
      })
    }
    const filtered_items = ref(_filtered_items);
    const setup_submit = async (event) => {
      console.log("slotCountEnabled = " + numSlotsEnabled.value);
      console.log("slotCountMin = " + numSlotsMin.value);
      console.log("slotCountMax = " + numSlotsMax.value);
      console.log("slotSizeEnabled = " + slotSizeEnabled.value);
      console.log("slotSizeMin = " + slotSizeMin.value);
      console.log("slotSizeMax = " + slotSizeMax.value);


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
        return {
          "Name": o.name,
          "Difficulty": 0.21,
          "Slots": o.numSlots,
          "Slot Size": o.slotSize,
          "Clothing Type": o.clothing || 'n',
          "Craftable": o.craftable,
          "Spawns In": o.biomes,
        }
      });
      console.timeEnd("Filtering");
      filtered_items.value = results;
    };

    onMounted(async () => {
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
        await Promise.all(batch);

        // Update the progress bar after each batch
        i += BATCH_SIZE;
        objectLoading.value = Math.min((i / totalObjects) * 100, 100);
      }
    });

    return {
      objectLoading,
      setup_submit,
      filtered_items,
      numSlotsEnabled,
      toggleSlotCountEnable,
      numSlotsMin,
      numSlotsMax,
      slotSizeEnabled,
      toggleSlotSizeEnable,
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

<style scoped>

</style>