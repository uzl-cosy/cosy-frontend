<template>
  <div
    class="flex items-center cursor-pointer 2xl:px-4 md:px-3 2xl:py-1 md:py-0.5 rounded-xl"
    :class="{
      'font-bold 2xl:text-xl xl:text-lg md:text-base 2xl:py-3 bg-primary/75 text-white -mt-1':
        this.selected,
    }"
  >
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    selected: Boolean,
  },
};
</script>
