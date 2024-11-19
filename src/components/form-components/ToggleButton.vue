<!--Form Component: ToggleButton.vue-->
<template>
  <div
    @click="toggle"
    class="flex items-center bg-gray-300 rounded-full w-14 h-8 p-1"
    :class="{ 'bg-ocean-dark': modelValue }"
  >
    <div
      class="h-6 w-6 rounded-full shadow-md bg-white transform duration-300"
      :class="{ 'translate-x-6': modelValue }"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle() {
      this.$emit("update:modelValue", !this.modelValue);
    },
  },
};
</script>
