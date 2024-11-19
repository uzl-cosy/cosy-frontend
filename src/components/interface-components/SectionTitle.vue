<!--Interface Component: SectionTitle.vue-->
<template>
  <div class="flex items-start ml-2 truncate">
    <Icon
      v-if="icon"
      class="ml-4"
      :size="iconSize"
      :iconName="icon"
      :iconSize="size"
      :color="color"
    />
    <h2 class="font-light text-3xl text-ocean-light m-3"><slot /></h2>
    <br />
  </div>
</template>
<script>
import Icon from "./Icon.vue";

export default {
  components: { Icon },
  props: {
    color: String,
    icon: String,
    size: {
      type: String,
      default: "24",
    },
  },
};
</script>
