<template>
  <span class="2xl:text-2xl md:text-md flow-root my-6 px-4 w-full ml-44"
    ><slot
  /></span>
</template>
<script>
export default {
  name: "TheComponentHeader",
  props: {
    description: {
      type: String,
      default: " ",
    },
  },
};
</script>
