<!--Form Component: CheckboxOption.vue is a labeled checkbox -->
<template>
  <label
    class="flex w-fit items-center p-1 hover:border-sky-200 border border-transparent rounded-lg"
  >
    <input type="checkbox" class="rounded w-5 h-5" v-model="model" />
    <!-- <span class="ml-3 text-slate-400 text-sm"><slot /></span> -->
    <span
      class="absolute flex w-5 h-5 items-center justify-center rounded cursor-pointer bg-fg transition-colors hover:bg-fgVar after:absolute after:content-[''] after:w-[6px] after:h-[6px] after:border-b-2 after:border-r-2 after:border-extreme after:rotate-[40deg] after:opacity-0 after:transition-opacity after:bg-transparent"
    />
    <span class="font-medium 2xl:text-lg xl:text-sm ml-2 self-center">
      {{ label }}
    </span>
  </label>
</template>

<script>
export default {
  props: {
    modelValue: { type: [Array, Boolean] },
    value: { type: [Boolean, Object] },
    label: { type: String },
  },
  data() {
    return {
      model: this.modelValue,
    };
  },
  watch: {
    /**
     * Emits a new input event when the model value changes.
     *
     * @param {type} newValue - The new value to set for the model.
     * @return {type} None
     */
    model(newValue) {
      this.$emit("new-input", newValue);
    },
  },
};
</script>
