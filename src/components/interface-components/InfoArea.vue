<template>
  <div
    class="sm:max-w-6xl h-fit flex items-start px-2 py-3 rounded-xl ml-4 hover:bg-slate-200 z-10"
    :class="{ 'bg-slate-200': active, 'w-auto': size == '' }"
  >
    <Icon
      v-if="this.alignIcon == 'left' || this.alignIcon == 'left-bottom'"
      ref="x"
      @mouseover="info = active ? 'info_cross' : 'info_hexa'"
      @mouseleave="info = active ? 'info_circle' : 'info_circle'"
      @click="active = !active"
      :iconName="info"
      :size="windowWidth > 1500 ? '32' : '20'"
      class="relative inline ml-1 mr-auto w-auto"
      :class="{ 'mt-auto': this.alignIcon == 'left-bottom' }"
    ></Icon>
    <p
      class="w-full px-2 sm:text-xs md:text-sm 2xl:text-xl text-slate-500"
      v-if="active"
    >
      <slot />
    </p>
    <Icon
      v-if="this.alignIcon == 'right'"
      ref="x"
      @mouseover="info = active ? 'info_cross' : 'info_hexa'"
      @mouseleave="info = active ? 'info_circle' : 'info_circle'"
      @click="
        info = info == 'info_cross' ? 'info_circle' : 'info_cross';
        active = !active;
      "
      :iconName="info"
      size="32"
      class="relative inline mx-1 mb-3 ml-auto"
    ></Icon>
  </div>
</template>
<script>
import Icon from "../interface-components/Icon.vue";

export default {
  components: { Icon },
  data() {
    return {
      windowWidth: window.innerWidth,
      info: "info_circle",
      active: true,
      infoColor: "darkblue",
    };
  },
  props: {
    size: { type: String, default: "" },
    alignIcon: { type: String, default: "left" },
    width: { type: String, default: "12" },
    initial: { type: Boolean, default: false },
  },
  mounted() {
    this.active = this.initial;
  },
};
</script>
