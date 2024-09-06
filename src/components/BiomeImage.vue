<template>
  <div class="biomeImage" :style="{ backgroundImage: `url('${imageUrl}')` }">
  </div>
</template>

<script>
import { defineComponent, computed, mounted } from 'vue';

export default defineComponent({
  props: {
    biome: Object,
    scaleUpTo: Number,
  },
  setup(props) {
    const imageUrl = computed(() => {
      return `${global.staticPath}/ground/ground_${props.biome.id}.png`;
    });
    const imageID = computed(() => {
      return ["image", props.biome.id, Math.random().toString(36).substr(2, 7)].join("-");
    });

    if (props.scaleUpTo) {
      const img = document.getElementById(imageID);
      if (!img) return;
      img.onload = () => {
        let multiplier = props.scaleUpTo / Math.max(img.naturalWidth, img.naturalHeight);
        if (multiplier < 1.0) {
          img.style.cssText = "object-fit: scale-down; width: 100%; height: 100%";
          return;
        }
        if (multiplier > 1.8)
          multiplier = 1.8;
        const width = Math.round(img.naturalWidth * multiplier);
        const height = Math.round(img.naturalHeight * multiplier);
        img.style.cssText = `object-fit: initial; width: ${width}px; height: ${height}px`;
      };
    }

    return {
      imageUrl,
      imageID,
    };
  },
});
</script>

<style scoped>
  .biomeImage {
    width: 100%;
    height: 100%;
  }
</style>
