<template>
  <router-link v-if="clickable"
      :class="className"
      :title="title" v-tippy
      :to="object.url()"
      @contextmenu="handleRightClick">
    <slot />
  </router-link>
  <div v-else
      :class="[className, 'current']"
      :title="title" v-tippy>
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    className: String,
    clickable: Boolean,
    title: String,
    object: Object,
    click: Function,
    rightClick: Function,
  },
  methods: {
    handleRightClick(event) {
      if (this.rightClick) {
        event.preventDefault();
        this.rightClick(this.object);
      }
    }
  }
});
</script>
