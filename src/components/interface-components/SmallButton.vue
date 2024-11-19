<!--Interface Component: SmallButton.vue is a button that may contain a text or/and an icon.-->
<template>
  <button
    class="w-auto rounded-2xl flex items-center hover:bg-[#3BA8D4] h-fit"
    :class="{
      'px-7 py-5': size == 'standard',
      'bg-ocean-dark text-white ': preset == 'filled',
      'text-[#004572] px-4 border-2 border-gray-200 hover:text-white':
        preset == 'outlined',
      'font-extrabold px-auto ': highlight,
      'font-medium': !highlight,
      'focus:outline-none opacity-50 font-light': disabled,
    }"
  >
    <slot class="pointer-events-auto" />
  </button>
</template>
<script>
import Icon from "./Icon.vue";

export default {
  components: {
    Icon,
  },
  props: {
    color: String,
    icon: String,
    disabled: { type: Boolean, default: false },
    size: { type: String, default: "standard" },
    preset: { type: String, default: "filled" },
    highlight: { type: Boolean, default: false },
  },
};
</script>
