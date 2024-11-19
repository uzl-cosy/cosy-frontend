<!--Interface Component: LoadButton.vue is a button that contains a loading animation when its `loading` prop is set to `true`.-->
<template>
  <div
    :class="{
      'w-full px-1 rounded-2xl border-solid border-2 border-ocean-dark hover:bg-blue-400 hover:border-transparent':
        !loading,
    }"
  >
    <button
      class="border-2 text-white border-transparent w-full xl:px-6 md:px-3 my-1 xl:py-7 md:py-4 rounded-2xl xl:text-xl md:text-base font-bold flex mx-auto items-center"
      :class="{
        'bg-gray-500 pointer-events-none': loading,
        'bg-ocean-dark': !loading,
      }"
    >
      <span class="flex mx-auto items-center"
        ><Icon
          v-if="!loading"
          class="mr-6"
          size="48"
          :iconName="icon"
          :color="color" />
        <slot v-if="!loading"></slot
        ><span v-else class="flex flex-col items-center"
          ><span class="text-lg mx-2 mb-2 w-max">{{ text }}</span
          ><Icon
            size="48"
            iconName="arrowsCircle"
            color="white"
            class="mx-12 animate-spin"
          ></Icon></span
      ></span>
    </button>
  </div>
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
    loading: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "48",
    },
    preset: {
      type: String,
      default: "filled",
    },
    text: { type: String, default: "Laden..." },
  },
};
</script>
