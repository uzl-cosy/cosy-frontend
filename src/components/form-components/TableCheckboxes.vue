<!--Form Component: TableCheckboxes.vue is a table with checkboxes-->
<template>
  <div class="flex items-center h-full w-fit pr-3 -mb-5 my-2">
    <!-- Labels on the left side-->
    <div
      class="flex flex-col justify-start items-start text-black h-full mt-14 w-50"
    >
      <div v-for="(item, index) in data" class="flex items-center">
        <div class="z-10 ml-4">
          <label
            class="font-bold text-sm h-full my-3 mr-2 px-1.5 whitespace-nowrap"
            :class="{
              'text-slate-400 w-48': disabled,
            }"
            >{{ item.title }}</label
          >
        </div>
        <svg
          viewBox="0 0 50 10"
          xmlns="http://www.w3.org/2000/svg"
          class="w-16"
        >
          <line
            x1="0"
            y1="5"
            x2="80"
            y2="5"
            stroke="rgb(0, 97, 122, 0.5)"
            stroke-width="1"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>

    <!-- First column with upper label and checkbox with connecting lines-->
    <div class="flex flex-col items-center justify-start">
      <svg viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg" class="w-16">
        <line
          x1="5"
          y1="0"
          x2="5"
          y2="14"
          stroke="rgb(0, 97, 122, 0.4)"
          stroke-width="0.5"
          stroke-linecap="round"
          :stroke-dasharray="1"
        />
      </svg>
      <div
        class="justify-between h-full items-center w-auto px-4 bg-sky-100 rounded-lg py-2 mx-1 -mt-10"
      >
        <div v-for="(item, index) in data" class="flex">
          <span
            class="w-fit bg-[#3BA8D4] px-1 flex"
            :class="{
              'rounded-t-lg pt-0.5': index == 0,
              'rounded-b-lg pb-0.5': index == data.length - 1,
            }"
          >
            <Icon
              @click="
                item.checkedA = !item.checkedA;
                this.updateForm(item.checkedA, index, '1');
              "
              class="my-2"
              :iconName="item.checkedA ? 'check' : 'close'"
            ></Icon
          ></span>

          <!-- <span
            v-if="this.dim3"
            class="w-fit ml-5 bg-[#3BA8D4] px-1 flex"
            :class="{
              'rounded-t-lg pt-0.5': index == 0,
              'rounded-b-lg pb-0.5': index == data.length - 1,
            }"
            ><Icon
              @click="
                item.checked1b = !item.checked1b;
                this.updateForm(item.checked1b, index, '1');
              "
              class="my-2"
              :iconName="item.checked1b ? 'check' : 'close'"
            ></Icon
          ></span> -->
          <!-- <span
            v-if="this.dim3"
            class="w-fit mx-5 bg-[#3BA8D4] px-1 flex"
            :class="{
              'rounded-t-lg pt-0.5': index == 0,
              'rounded-b-lg pb-0.5': index == data.length - 1,
            }"
          >
            <Icon
              @click="
                item.checked1c = !item.checked1c;
                this.updateForm(item.checked1c, index, '1');
              "
              class="my-2"
              :iconName="item.checked1c ? 'check' : 'close'"
            ></Icon
          ></span> -->
        </div>
        <!-- <span
          class="flex items-center justify-center w-fit -ml-3"
          v-if="this.dim3"
          ><svg
            viewBox="0 0 16 2"
            xmlns="http://www.w3.org/2000/svg"
            class="w-40"
          >
            <line
              x1="2.5"
              y1="0"
              x2="2.5"
              y2="2"
              stroke="rgb(0, 97, 122, 0.4)"
              stroke-width="0.2"
              stroke-linecap="round"
              :stroke-dasharray="0.5"
            />
            <line
              x1="8"
              y1="0"
              x2="8"
              y2="2"
              stroke="rgb(0, 97, 122, 0.4)"
              stroke-width="0.2"
              stroke-linecap="round"
              :stroke-dasharray="0.5"
            />
            <line
              x1="13.5"
              y1="0"
              x2="13.5"
              y2="2"
              stroke="rgb(0, 97, 122, 0.4)"
              stroke-width="0.2"
              stroke-linecap="round"
              :stroke-dasharray="0.5"
            />
          </svg>
        </span>
        <div
          class="grid grid-cols-3 text-sm text-slate-500 w-fit -ml-3"
          v-if="this.dim3"
        >
          <span class="text-left -mr-2">intern</span
          ><span class="text-left -ml-3">anonym</span
          ><span class="text-left -ml-3">unbeschränkt</span>
        </div> -->
      </div>
    </div>

    <!-- Connecting Line-->
    <div class="flex flex-col mt-16 w-fit">
      <svg
        v-for="(item, index) in data"
        viewBox="0 0 100 10"
        class="w-32 my-3 py-1"
      >
        <line
          x1="0"
          y1="2"
          x2="100"
          y2="2"
          stroke="rgb(0, 97, 122, 0.4)"
          stroke-width="1"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <!-- Second column with upper label and checkbox with connecting lines-->
    <div class="flex flex-col items-center justify-center my-1">
      <svg viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg" class="w-16">
        <line
          x1="5"
          y1="0"
          x2="5"
          y2="14"
          stroke="rgb(0, 97, 122, 0.4)"
          stroke-width="0.5"
          stroke-linecap="round"
          :stroke-dasharray="1"
        />
      </svg>
      <div
        class="justify-between h-full items-center w-auto px-4 bg-sky-100 rounded-lg py-3 -mt-10"
      >
        <div v-for="(item, index) in data" class="flex w-fit">
          <span
            class="w-fit bg-[#A71F60] px-1"
            :class="{
              'rounded-t-lg pt-0.5': index == 0,
              'rounded-b-lg pb-0.5': index == data.length - 1,
            }"
          >
            <Icon
              @click="
                item.checkedB = !item.checkedB;
                this.updateForm(item.checkedB, index, '2');
              "
              color="lightgray"
              class="my-2"
              :iconName="item.checkedB ? 'check' : 'close'"
            ></Icon
          ></span>
          <!-- <span
            v-if="this.dim3"
            class="w-fit mx-4 bg-[#A71F60] px-1 ml-5"
            :class="{
              'rounded-t-lg pt-0.5': index == 0,
              'rounded-b-lg pb-0.5': index == data.length - 1,
            }"
          >
            <Icon
              @click="
                item.checked2b = !item.checked2b;
                this.updateForm(item.checked2, index, '2');
              "
              color="lightgray"
              class="my-2"
              :iconName="item.checked2b ? 'check' : 'close'"
            ></Icon
          ></span>
          <span
            v-if="this.dim3"
            class="w-fit bg-[#A71F60] px-1 ml-2"
            :class="{
              'rounded-t-lg pt-0.5': index == 0,
              'rounded-b-lg pb-0.5': index == data.length - 1,
            }"
          >
            <Icon
              @click="
                item.checked2c = !item.checked2c;
                this.updateForm(item.checked2c, index, '2');
              "
              color="lightgray"
              class="my-2"
              :iconName="item.checked2c ? 'check' : 'close'"
            ></Icon
          ></span> -->
        </div>
        <!-- <span
          class="flex items-center justify-center w-fit -ml-3"
          v-if="this.dim3"
          ><svg
            viewBox="0 0 16 2"
            xmlns="http://www.w3.org/2000/svg"
            class="w-40"
          >
            <line
              x1="2.5"
              y1="0"
              x2="2.5"
              y2="2"
              stroke="rgb(0, 97, 122, 0.4)"
              stroke-width="0.2"
              stroke-linecap="round"
              :stroke-dasharray="0.5"
            />
            <line
              x1="8"
              y1="0"
              x2="8"
              y2="2"
              stroke="rgb(0, 97, 122, 0.4)"
              stroke-width="0.2"
              stroke-linecap="round"
              :stroke-dasharray="0.5"
            />
            <line
              x1="13.5"
              y1="0"
              x2="13.5"
              y2="2"
              stroke="rgb(0, 97, 122, 0.4)"
              stroke-width="0.2"
              stroke-linecap="round"
              :stroke-dasharray="0.5"
            />
          </svg>
        </span> -->
        <!-- <div
          class="grid grid-cols-3 text-sm text-slate-500 w-fit -ml-3"
          v-if="this.dim3"
        >
          <span class="text-left -mr-2">intern</span
          ><span class="text-left -ml-3">anonym</span
          ><span class="text-left -ml-3">unbeschränkt</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "../interface-components/Icon.vue";

export default {
  name: "Checkbox",
  props: {
    data: Array,
    roles: { type: Array, default: ["1", "2"] },
    labels: { type: Array, default: null },
    dim3: { type: Boolean, default: false },
  },
  methods: {
    /**
     * Emits an "update" event with the provided values.
     *
     * @param {boolean} checked - The checked state of the checkbox.
     * @param {number} index - The index of the checkbox.
     * @param {string} speaker - The speaker associated with the checkbox.
     * @return {void} This function does not return a value.
     */
    updateForm(checked, index, speaker) {
      this.$emit("update", {
        checked,
        index,
        speaker,
      });
    },
  },
  components: { Icon },
};
</script>
