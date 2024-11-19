<!--Form Component: ButtonPanelHorizontal.vue is a panel of buttons that is displayed horizontally.-->
<template>
  <div class="text-slate-600">
    <!-- Label -->
    <slot />
    <div class="rounded-2xl flex">
      <!-- Listed options -->
      <span v-for="(item, index) in options" :key="index">
        <button
          :id="base + index"
          :name="index"
          class="w-fit hover:cursor-pointer hover:bg-[#3BA8D4]/50 flex flex-col justify-center"
          :class="{
            'rounded-l-xl rounded-none': index == 0, //first list item
            'rounded-none': index > 0 && index < options.length - 1, // middle list items
            'rounded-r-xl rounded-none': index == options.length - 1, // last list item
            'font-bold 2xl:text-xl xl:text-lg border-blue-400 text-slate-700 bg-sky-100':
              this.checked == base + index && this.size == 'medium',
            'font-bold 2xl:text-lg xl:text-base  text-slate-700 bg-sky-100':
              this.checked == base + index && this.size == 'small',
            'underline underline-offset-8':
              this.checked == base + index && underline,

            'xl:text-sm text-slate-500 border-b-2 bg-gray-50':
              this.checked !== base + index && this.size == 'medium',
            '2xl:text-sm xl:text-xs text-slate-500  border-b-2 bg-gray-50':
              this.checked !== base + index && this.size == 'small',
            '2xl:py-3 xl:py-1': this.size == 'medium',
            'py-1': this.size == 'small',
          }"
          @click="update($event.target)"
        >
          {{ item.name }}
          <span
            class="pointer-events-none text-sm/6 w-full text-slate-400 leading-4 flow-root"
            :class="{ 'text-slate-600': this.checked == base + index }"
            v-if="item.detail != '' && this.size !== 'small'"
          >
            <br />
            {{ item.detail }}</span
          >
        </button>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    options: Array,
    underline: { type: Boolean, default: false },
    base: String,
    checked: String,
    size: { type: String, default: "medium" },
  },
  methods: {
    update(e) {
      this.$emit("update", e);
    },
  },
};
</script>
