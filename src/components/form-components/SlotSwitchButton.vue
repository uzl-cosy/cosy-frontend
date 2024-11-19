<!--Form Component: SlotSwitchButton.vue is a toggle button for switching the content in a feedback card-->
<template>
  <div
    class="flex flex-row bg-gray-200 p-1 rounded-md w-max"
    :class="showSlot1 ? '-ml-12' : '-ml-7'"
    
  >
    <div @click="toggleSlot0" :class="{
            'flex justify-center items-center cursor-pointer text-slate-600 px-2 rounded-l-md transition border-2': true,
            'bg-white border-teal-800 ': showSlot0,
            'bg-gray-200 border-transparent border-2': !showSlot0,
          }">
      {{ slotName0 }}
    </div>
    
    <div @click="toggleSlot1" :class="{
            'flex justify-center items-center cursor-pointer text-slate-600 px-2 rounded-r-md transition border-2': true,
            'bg-white border-teal-800 ': showSlot1,
            'bg-gray-200 border-transparent': !showSlot1,
          }">
      {{ slotName1 }}
    </div>
    </div>
</template>

<script>
export default {
  name: "SlotSwitchButton",
  props: {
    tabIncoming: {
      type: Number,
      default: 0,
    },
    slotName0: String,
    slotName1: String,
  },
  data() {
    return {
      tab: 0,
      showSlot0: true,
      showSlot1: false,
    };
  },
  methods: {
    /**
     * Toggles the slot to display slot 0 and hides slot 1. Emits an event to update the tab.
     *
     * @return {void}
     */
    toggleSlot0() {
      this.tab = 0;
      this.showSlot0 = true;
      this.showSlot1 = false;
      this.$emit("updateTab", this.tab);
    },
    /**
     * Set the tab to 1 and show slot 1 while hiding slot 0. Emit an 'updateTab' event with the new tab value.
     *
     * @return {void} 
     */
    toggleSlot1() {
      this.tab = 1;
      this.showSlot1 = true;
      this.showSlot0 = false;
      this.$emit("updateTab", this.tab);
    },
  },
  watch: {
/**
 * Updates the tab value and toggles the visibility of the slots based on the new value.
 *
 * @param {number} value - The new value for the tab.
 * @return {void}
 */
    tabIncoming: function (value) {
      this.tab = value;
      if (this.tab === 0) {
        this.showSlot0 = true;
        this.showSlot1 = false;
      } else {
        this.showSlot1 = true;
        this.showSlot0 = false;
      }
    },
  },
};
</script>
