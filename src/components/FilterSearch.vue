<template>
  <v-sheet class="mx-auto" theme="dark">
    <v-form @submit.prevent="submit">
      <v-container class="ga-0">
        <v-row class="mt-n6 mb-n14">
          <!-- Slot count filter -->
          <v-col>
          <v-switch name="numSlotsToggle" label="Slots" @change="toggleSlotCountEnable"></v-switch>
          </v-col>
          <v-col>
            <v-text-field name="numSlotsMin" label="Min" :disabled="!slotCountEnabled" :model-value="slotCountMin" density="compact" />
          </v-col>
          <v-col>
            <v-text-field name="numSlotsMax" label="Max" :disabled="!slotCountEnabled" :model-value="slotCountMax" density="compact"/>
          </v-col>
        </v-row>
        <!-- Slot size filter -->
        <v-row class="mt-n14 mb-n14">
          <v-col>
          <v-switch name="slotSizeToggle" label="Slot size" @change="toggleSlotSizeEnable" class="mt-n4"></v-switch>
          </v-col>
          <v-col>
            <v-text-field name="slotSizeMin" label="Min" :disabled="!slotSizeEnabled" model-value="0" density="compact"/>
          </v-col>
          <v-col>
            <v-text-field name="slotSizeMax" label="Max" :disabled="!slotSizeEnabled" model-value="3" density="compact"/>
          </v-col>
        </v-row>
        <v-row>
          <v-btn class="mt-2" type="submit" block>Search</v-btn>
        </v-row>
        <v-row>
        <v-data-table width="100%" theme="dark" :items-per-page-options="[10,20,30,40,50]" :items="items"></v-data-table>
        </v-row>
      </v-container>
    </v-form>
  </v-sheet>
</template>

<script>
import { ref } from "vue";
import GameObject from '../models/GameObject';

export default {
  setup() {
    let extraObjectData = GameObject.allExtraObjectsData();

    let slotCountEnabled = ref(false);
    let toggleSlotCountEnable = () => {slotCountEnabled.value = !slotCountEnabled.value};
    let slotCountMin = ref(0);
    let slotCountMax = ref(27);

    let slotSizeEnabled = ref(false);
    let toggleSlotSizeEnable = () => {slotSizeEnabled.value = !slotSizeEnabled.value};
    let slotSizeMin = ref(0);
    let slotSizeMax = ref(3);

    let items = [];
    for (let i = 0; i < extraObjectData.length; i++) {
      // console.log("extraObjectData[i] = ", JSON.stringify(extraObjectData[i]));
      let objectData = GameObject.find(extraObjectData[i].id)
      items.push({
        "Name": objectData.name,
        "Difficulty": extraObjectData[i].difficulty,
        "Slots": extraObjectData[i].numSlots,
        "Slot Size": objectData.slotSize,
        "Clothing Type": extraObjectData[i].clothingType,
        "Craftable": extraObjectData[i].craftable,
        "Spawns In": extraObjectData[i].biomes,
      })
    }
    return {
      items,
      slotCountEnabled,
      toggleSlotCountEnable,
      slotCountMin,
      slotCountMax,
      slotSizeEnabled,
      toggleSlotSizeEnable,
      slotSizeMin,
      slotSizeMax,
    }
  },
  methods: {
    async submit(event) {
      console.log("event = ", JSON.stringify(event.target.elements));
      const results = await event;
      console.log("Results count: ", results ? JSON.stringify(results) : -1);
    },
  }
}
</script>

<style scoped>

</style>