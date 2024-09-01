<template>
  <Toggle
    v-model="slotCountEnabled"
    on-label="On"
    off-label="Off"
  />
  <input class="twotech-input" :disabled="!slotCountEnabled"/>
  <v-data-table :items="items"></v-data-table>
</template>

<script>
// import type { Header, Item } from "vue3-easy-data-table";

import { ref } from "vue";
import Toggle from "@vueform/toggle";
import GameObject from '../models/GameObject';

export default {
  components: {
    Toggle,
  },
  data() {
    return {
      slotCountEnabled: true
    }
  },
  setup() {
    let extraObjectData = GameObject.allExtraObjectsData();
    let items = [];
    for (let i = 0; i < 10; i++) {
      console.log("extraObjectData[i] = ", JSON.stringify(extraObjectData[i]));
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
      items
    }
  }
}
</script>

<style>
.toggle-container{display:inline-block}
.toggle-container:focus{box-shadow:0 0 0 var(--toggle-ring-width,3px) var(--toggle-ring-color,rgba(16,185,129,.188));outline:0}
.toggle{align-items:center;border:var(--toggle-border,.125rem) solid;border-radius:999px;box-sizing:content-box;cursor:pointer;display:flex;font-size:var(--toggle-font-size,.75rem);height:var(--toggle-height,1.25rem);line-height:1;position:relative;transition:all .3s;width:var(--toggle-width,3rem)}
.toggle-on{background:var(--toggle-bg-on,#1daf7ed3);border-color:var(--toggle-border-on,#10b981);color:var(--toggle-text-on,#fff);justify-content:flex-start}
.toggle-off{background:var(--toggle-bg-off,#a2a4a8);border-color:var(--toggle-border-off,#a2a4a8);color:var(--toggle-text-off,#374151);justify-content:flex-end}
.toggle-on-disabled{background:var(--toggle-bg-on-disabled,#d1d5db);border-color:var(--toggle-border-on-disabled,#d1d5db);color:var(--toggle-text-on-disabled,#9ca3af);cursor:not-allowed;justify-content:flex-start}
.toggle-off-disabled{background:var(--toggle-bg-off-disabled,#a2a4a8);border-color:var(--toggle-border-off-disabled,#a2a4a8);color:var(--toggle-text-off-disabled,#9ca3af);cursor:not-allowed;justify-content:flex-end}
.toggle-handle{background:var(--toggle-handle-enabled,#fff);border-radius:50%;display:inline-block;height:var(--toggle-height,1.25rem);position:absolute;top:0;transition-duration:var(--toggle-duration,.15s);transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);width:var(--toggle-height,1.25rem)}
.toggle-handle-on{left:100%;transform:translateX(-100%)}
.toggle-handle-off{left:0}
.toggle-handle-on-disabled{background:var(--toggle-handle-disabled,#f3f4f6);left:100%;transform:translateX(-100%)}
.toggle-handle-off-disabled{background:var(--toggle-handle-disabled,#f3f4f6);left:0}
.toggle-label{box-sizing:border-box;text-align:center;-webkit-user-select:none;-moz-user-select:none;user-select:none;white-space:nowrap;width:calc(var(--toggle-width,3.25rem) - var(--toggle-height,1.25rem))}
</style>

<style scoped>
.twotech-input {
  max-width: 100%;
  height: 28px;
  padding: 2px 8px;
  margin: 0;
  border: 1px solid rgb(75, 75, 75);
  border-radius: 3px;
  font-size: inherit;
  background: rgb(43, 43, 43);
  color: white;
  box-shadow: inset 0 0px 5px rgb(37, 37, 37);
  box-shadow: inset 0 1px 5px rgb(37, 37, 37), inset 0px 0px 0px 1px rgb(35, 35, 35);
  border: 1px solid rgb(68, 68, 68);
}
.twotech-input:disabled {
  box-shadow: inset 0 0px 4px rgb(28, 28, 31);
  background: #222;
  color: #999;
  cursor: not-allowed;
}
.twotech-input:focus {
  outline: none;
  box-shadow: 
    0 0px 0 2px hsla(var(--primary-h), var(--primary-s), calc(var(--primary-l) + 30%), 0.5);
}
</style>