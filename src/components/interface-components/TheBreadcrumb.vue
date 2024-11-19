<template>
  <div
    class="w-fit flex font-medium 2xl:text-lg md:text-sm text-blue-light py-0 my-0 cursor-pointer whitespace-nowrap"
  >
    <span v-for="(val, index) in breadcrumbs" :key="index" class="flex">
      <div
        v-if="index < breadcrumbs.length - 1"
        class="py-0 px-2"
        @click="this.$emit('navigate', val.name)"
      >
        {{ val.name }}
      </div>
      <div v-else class="py-0 px-2 text-gray-600">{{ val.name }}</div>
      <span class="text-gray-600" v-if="index < breadcrumbs.length - 1">
        ></span
      >
    </span>
  </div>
</template>

<script>
export default {
  props: {
    breadcrumbs: {
      type: Array,
      default: null,
    },
  },
};
</script>
