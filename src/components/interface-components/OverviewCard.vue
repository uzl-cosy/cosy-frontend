<!--(UNUSED) Interface Component: OverviewCard.vue is the card container for textual and visual information -->
<template>
  <div class="w-full mx-3 px-3">
    <div class="w-auto flex flex-col items-center">
      <!-- Headline -->
      <div class="flex mx-2 w-fit 2xl:mb-3 md:mb-1 self-start md:items-center">
        <Icon
          class="ml-6"
          :size="this.windowHeight > 900 ? '32' : '24'"
          :iconName="iconName"
          color="#213547"
        />
        <h4 class="font-light text-2xl text-blue-dark ml-4">
          <slot name="header"></slot>
        </h4>
      </div>
      <!-- Content -->
      <div class="bg-sky-100 rounded-xl px-6 mx-2 py-3 w-full">
        <slot name="content" class="w-fit"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import Icon from "./Icon.vue";

export default {
  components: { Icon },
  props: {
    iconName: String,
  },
  data() {
    return {
      windowHeight: window.innerHeight,
    };
  },
};
</script>
