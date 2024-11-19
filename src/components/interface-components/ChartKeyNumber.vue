<!--Interface Component: ChartKeyNumber.vue contains a label and a number for the analysis/feedback features -->
<template>
  <div class="flex w-auto h-full top-0 self-start -ml-3 items-start">
    <!-- Line indicating where it refers to-->
    <svg viewBox="0 0 10 32" class="w-12 h-36">
      <line
        x1="0.5"
        x2="12"
        y1="3"
        y2="10.5"
        fill="none"
        stroke="#3ba8d4"
        stroke-width="0.7"
        stroke-linecap="round"
      ></line>
      <line
        x1="0.5"
        x2="10.5"
        y1="8.5"
        y2="28"
        fill="none"
        stroke="#A71F60"
        stroke-width="0.7"
        stroke-linecap="round"
      ></line>
    </svg>
    <div class="flex-col mt-6">
      <div
        class="flex flex-col items-center border-2 border-speaker1 rounded-lg w-full px-1"
      >
        <div
          class="pb-0.25 pt-0.5 w-full whitespace-nowrap text-center text-xs"
        >
          {{ this.name1 }}
        </div>
        <div class="flex flex-col items-center py-0.5">
          <span class="text-lg font-bold leading-6">{{ number1 }}</span>
          <span class="text-xs w-full text-center whitespace-nowrap">{{
            measure1
          }}</span>
        </div>
      </div>
      <div
        class="flex flex-col items-center border-2 border-speaker2 rounded-lg w-full px-1 mt-2"
      >
        <div
          class="pb-0.25 pt-0.5 w-full whitespace-nowrap text-center text-xs"
        >
          {{ name2 }}
        </div>
        <div class="flex flex-col items-center py-0.5">
          <span class="text-lg font-bold leading-6">{{ number2 }}</span>
          <span class="text-xs w-full text-center whitespace-nowrap">{{
            measure2
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    name1: { type: String, default: "name" },
    name2: { type: String, default: "name" },
    number1: { type: String, default: "number" },
    number2: { type: String, default: "number" },
    measure1: { type: String, default: "measure" },
    measure2: { type: String, default: "measure" },
  },
};
</script>
