<template>
  <button
    class="w-auto my-4 rounded-2xl 2xl:text-2xl xl:text-base font-bold flex mx-auto items-center hover:bg-[#3BA8D4]"
    :class="{
      ' text-white bg-ocean-dark px-12 py-5': preset == 'filled',
      'text-ocean-dark border-2 border-gray-200 px-12 py-5':
        preset == 'outlined',
      'px-12 py-8': size == '64',
      'p-6': size == '48',
    }"
  >
    <span class="flex justify-center mx-auto items-center w-full">
      <Icon class="mr-6" :size="size" :iconName="icon" :color="color" /> <slot
    /></span>
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
    size: {
      type: String,
      default: "48",
    },
    preset: {
      type: String,
      default: "filled",
    },
  },
};
</script>

<style></style>
