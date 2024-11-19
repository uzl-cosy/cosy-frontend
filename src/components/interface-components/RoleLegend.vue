<!-- This component contains one share of the dialog with the respective speaker -->
<template>
  <div
    class="flex font-medium text-sm text-gray-500 py-1 mx-2 justify-between items-center w-full"
  >
    <!-- Circle Icon -->
    <svg
      class="w-12 h-12"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      :fill="color"
    >
      <circle cx="40" cy="50" r="40" />
      <line x1="75" y1="50" x2="120" y2="50" stroke="RGB(20,20,20)" />
      <text
        x="28"
        y="64"
        style="font: bold 40px inter; fill: black"
        class="w-full flow-root"
      >
        {{ role[0] }}
      </text>
    </svg>
    <!-- Role and Content -->
    <div class="my-auto w-full text-gray-600 items-center">
      <div
        class="w-full flex flex-col border-solid border-4 border-gray-400 rounded p-1 items-center"
      >
        <div class="text-gray-800 w-max font-bold text-center">
          {{ role }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "./Icon.vue";

export default {
  components: {
    Icon,
  },
  props: {
    nugget: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "black",
    },
    name: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
  },
};
</script>
