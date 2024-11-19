<template>
  <div
    class="flex my-4 mx-2 justify-between rounded-lg items-center w-fit xl:px-5"
  >
    <div class="flex items-center w-fit xl:px-2">
      <div
        class="flex items-center mb-3 bg-white w-auto rounded-xl my-4 py-2 xl:px-8 md:px-4 h-max"
      >
        <Icon
          class="mr-8 w-8"
          iconName="users"
          color="rgb(71 85 105)"
          size="32"
        />
        <div class="flex flex-col items-start">
          <!-- <span class="w-max text-xl font-bold text-slate-600"
                          >{{ this.getSpeakers[0].name }}
                        </span> -->
          <span
            class="w-fit xl:text-lg md:text-base font-bold text-slate-600 whitespace-nowrap"
            >{{ this.role }}
          </span>
          <!-- <span class="text-slate-500 text-base whitespace-nowrap">
            {{ this.name }}</span
          > -->
        </div>
      </div>
      <div class="flex flex-col items-center -mx-11 -mb-6 mt-6">
        <svg viewBox="0 0 12 12" class="w-12 mt-6" style="margin-right: -12px">
          <circle cx="1" cy="2.5" r="1.5" fill="gray" />
          <line
            x1="0"
            y1="2.5"
            x2="12"
            y2="2.5"
            stroke="gray"
            stroke-width="1"
          ></line>
          <circle cx="11" cy="2.5" r="1.5" fill="gray" />
          <line
            x1="6"
            y1="2"
            x2="6"
            y2="12"
            stroke="gray"
            stroke-dasharray="1"
            stroke-width="1"
          ></line>
        </svg>
        <label
          class="w-fit whitespace-nowrap rounded-r-xl text-white flex justify-center items-center"
          ><span v-if="this.microStatus == 0" class="text-green-600 flex"
            ><Icon class="w-8" iconName="check" color="green" size="32" />
            <p>Verbunden {{ this.microStatus }}</p></span
          ><span v-else class="text-red-600 xl:text-lg md:text-sm flex">
            <Icon class="w-8" iconName="close" color="darkred" size="32" />
            <p>Kein Signal</p></span
          ></label
        >
      </div>
    </div>
    <div class="flex flex-col justify-center items-center mt-2 my-5">
      <span class="text-slate-600 ml-4 xl:text-base md:text-sm">Mikrofon:</span>

      <div
        class="px-10 ml-1 border-slate-200 self-center w-fit rounded-lg py-2"
        :class="{
          'bg-pink-800 text-white': this.microColor == 'red',
          'bg-lime-500 text-white': this.microColor == 'green',
          'bg-indigo-600 text-white': this.microColor == 'blue',
          'bg-ocean-dark text-white': this.active,
        }"
      >
        {{ this.microName }}
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "../interface-components/Icon.vue";
export default {
  components: { Icon },
  props: {
    microName: String,
    microStatus: String,
    microColor: String,
    role: String,
  },
};
</script>
