<!--Interface Component: Card.vue is the card container for the analysis/feedback features -->
<template>
  <div
    class="shadow-primary 2xl:w-48 2xl:w-42 sm:w-36 h-fit rounded-xl text-white flex flex-col items-center justify-evenly 2xl:p-2 md:px-1"
    :class="{
      'bg-gradient-to-r from-[#00AFB9] to-[#4394A6] hover:from-[#89dde1] hover:to-[#6ab3c4] shadow-sm':
        !disabled,
      'bg-gradient-to-r from-[#b0c2c467] to-[#b4c3c78e]': disabled,
    }"
  >
    <div class="flex items-center justify-center w-full lg:pt-6 md:p-2">
      <Icon
        class="2xl:h-14 2xl:w-14 md:h-9 md:w-9"
        :iconName="iconName"
        :color="disabled ? 'rgb(0, 97, 122,0.1)' : 'rgb(0, 97, 122)'"
      ></Icon>
    </div>
    <span
      class="md:text-lg 2xl:text-2xl md:m-1 2xl:p-1 flex items-center justify-center text-center py-1"
      :class="{ 'text-slate-300': disabled }"
    >
      <slot />
    </span>
  </div>
</template>
<script>
import Icon from "./Icon.vue";

export default {
  components: { Icon },
  data() {},
  props: {
    iconName: String,
    title: String,
    disabled: { type: Boolean, default: false },
  },
};
</script>
