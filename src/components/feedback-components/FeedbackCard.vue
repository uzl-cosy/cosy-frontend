<!-- Feedback Component: FeedbackCard.vue is the card container for the analysis data whose content can be hidden or shown -->
<template>
  <div
    class="feedback-card h-full w-full flex flex-col items-center justify-center rounded-xl my-4 mx-1 xl:px-1 xl:py-1 md:p-2"
  >
    <div
      class="w-full xl:mx-2 xl:px-2 md:pt-2 xl:pt-1 md:py-1 rounded-lg flex justify-between"
      :class="{
        'bg-white text-primary': !this.active,
        'text-white': this.active,
      }"
      @click="toggleActive"
    >
      <Icon
        class="mr-5 ml-3"
        :iconName="icon"
        :size="this.windowWidth < 1200 ? 24 : this.windowWidth < 1600 ? 32 : 48"
      >
      </Icon>
      <h3 class="xl:text-2xl md:text-xl tracking-wide font-bold self-center">
        {{ title }} {{ this.width }}
      </h3>
      <Icon
        v-if="active"
        iconName="chevronDown"
        :color="!this.active ? 'rgb(0, 97, 122)' : 'white'"
        :size="this.windowWidth < 1200 ? 24 : this.windowWidth < 1600 ? 32 : 48"
      ></Icon>
      <Icon
        v-else
        :size="this.windowWidth < 1200 ? 24 : this.windowWidth < 1600 ? 32 : 48"
        iconName="chevronLeft"
        :color="!this.active ? 'rgb(0, 97, 122)' : 'white'"
      ></Icon>
    </div>

    <div class="w-full h-full px-1">
      <div
        class="bg-white w-full my-1 pb-2 pt-1 px-1 rounded-lg isolate"
        v-if="active"
      >
        <div class="w-full flex justify-between items-center">
          <!-- Arrow left -->

          <div
            class="flex -ml-2 z-10"
            @click="
              this.tab--;
              this.$emit('reload', this.tab);
            "
            v-if="this.tab > 0"
          >
            <Icon
              iconName="chevronLeft"
              color="rgb(84, 127, 135)"
              size="60"
            ></Icon>
          </div>
          <div class="flex z-10 p-4" v-else></div>

          <!-- Button to change the content slot -->
          <div class="flex flex-col w-full">
            <div class="self-start z-20" v-if="slotName0 != '1'">
              <SlotSwitchButton
                :tabIncoming="this.tab"
                :slotName0="slotName0"
                :slotName1="slotName1"
                @updateTab="handleTabUpdate"
              ></SlotSwitchButton>
            </div>

            <div class="z-20 self-end" v-if="settings">
              <SmallButton
                preset="outlined"
                size="small"
                class="w-fit py-1 px-0.5 m-1 -mb-7"
                @click="toggleMenu"
              >
                <Icon iconName="settings"></Icon>
              </SmallButton>
              <div
                v-if="menuActive"
                class="absolute rounded-lg shadow-lg bg-white right-0 mr-12"
              >
                <span
                  v-for="(option, index) in menuOptions"
                  :key="index"
                  class="p-1 w-full whitespace-nowrap flex flex-col hover:bg-sky-200"
                  @click="emitOption(index)"
                  >{{ option }}</span
                >
              </div>
            </div>
            <!--Content-->
            <slot name="slot1" class="-mr-4" v-if="this.tab == 0"></slot>
            <slot name="slot2" v-if="this.tab == 1"></slot>
            <slot name="slot3" v-if="this.tab == 2"></slot>
          </div>

          <!-- Arrow right -->
          <div
            class="flex justify-end -mr-2"
            @click="
              this.tab++;
              console.log('click');
            "
            v-if="this.tab < this.tabCount - 1"
          >
            <Icon
              iconName="chevronRight"
              color="rgb(84, 127, 135)"
              size="60"
            ></Icon>
          </div>
        </div>

        <!--Bottom Button-->
        <div
          class="w-full flex flex-row justify-end items-center 2xl:px-5 xl:px-2 -mt-10"
          v-if="showEnlarge"
        >
          <SmallButton
            preset="filled"
            size=""
            class="py-1.5"
            @click="$emit('open-overlay')"
          >
            <span
              class="mr-3 ml-1 font-bold 2xl:text-xl xl:text-lg z-20 px-3 py-1"
              >Vergrößern</span
            >
            <Icon iconName="search" color="white" class=""></Icon>
          </SmallButton>
          <!-- <button
            class="bg-ocean-dark z-10 w-fit h-min rounded-2xl text-white cursor-pointer text-md border-4 center self-end flex items-center justify"
            @click="$emit('open-overlay')"
          ></button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Icon from "../../components/interface-components/Icon.vue";
import SmallButton from "../interface-components/SmallButton.vue";
import SlotSwitchButton from "../form-components/SlotSwitchButton.vue";

export default {
  components: {
    Icon,
    SmallButton,
    SlotSwitchButton,
  },
  data() {
    return {
      menuActive: false,
      tab: 0,
      scaleX: false,
      windowWidth: window.innerWidth,
      isActive: false,
      mouseDirection: "",
      width: "",
      emits: ["option1", "option2", "option3"],
      showFilter: false,
    };
  },
  props: {
    showEnlarge: { type: Boolean, default: true },
    slotName0: { type: String, default: "1" },
    slotName1: { type: String, default: "2" },

    menuOptions: {
      type: Array,
      default: ["Menupunkt 1", "Menupunkt 2"],
    },
    settings: { type: Boolean, default: true },
    tabCount: { type: Number, default: 0 },
    currentTab: { type: Number, default: 0 },
    icon: { type: String, default: "document" },
    globalActive: {
      type: Boolean,
      default: false,
    },
    categoryActive: {
      type: Boolean,
      default: false,
    },
    title: { type: String, default: "Parametertitel" },
  },
  watch: {
    /**
     * Watcher for the `globalActive` prop. Sets the `isActive` data property to true if `newVal` is true.
     *
     * @param {boolean} newVal - The new value of the `globalActive` prop.
     */
    globalActive(newVal) {
      if (newVal) {
        this.isActive = true;
      }
    },
    /**
     * Watcher for the `categoryActive` prop. Sets the `isActive` data property to true if `newVal` is true.
     *
     * @param {boolean} newVal - The new value of the `categoryActive` prop.
     */
    categoryActive(newVal) {
      if (newVal) {
        this.isActive = true;
      }
    },

    /**
     * Sets the value of `this.tab` to the new value passed as a parameter.
     *
     * @param {type} newVal - The new value to set for `this.tab`.
     * @return {type} description of return value
     */
    currentTab(newVal) {
      this.tab = newVal;
    },
    /**
     * Emits an event when the value of the `tab` prop changes.
     *
     * @param {any} newVal - The new value of the `tab` prop.
     * @param {any} oldVal - The old value of the `tab` prop.
     * @return {void}
     */
    tab(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit("tabCountChanged", newVal);
      }
    },
  },
  computed: {
    active() {
      return this.isActive;
    },
  },
  methods: {
    /**
     * Toggles the value of `this.tab` between 0 and 1.
     *
     * @return {void}
     */
    toggle() {
      this.tab = this.tab === 0 ? 1 : 0;
    },
    /**
     * Updates the value of the `tab` data property with the new tab value passed as a parameter.
     *
     * @param {number} newTab - The new tab value to set for `tab`.
     * @return {void}
     */
    handleTabUpdate(newTab) {
      this.tab = newTab;
    },
    /**
     * Emits an event with the value of `this.emits[option]` as the event name.
     *
     * @param {string} option - The option key to retrieve the event name from `this.emits`.
     * @return {void}
     */
    emitOption(option) {
      this.$emit(this.emits[option] + "");
    },
    /**
     * Toggles the value of `menuActive` in the component's local data.
     *
     * @return {void}
     */
    toggleMenu() {
      this.$data.menuActive = !this.$data.menuActive;
    },
    /**
     * Toggles the value of the `isActive` data property and logs the new value to the console.
     *
     * @return {void}
     */
    toggleActive() {
      this.isActive = !this.isActive;
    },

    /**
     * Updates the value of the `showFilter` property.
     *
     * @param {any} value - The new value for the `showFilter` property.
     * @return {void}
     */
    updateShowFilter(value) {
      this.showFilter = value;
    },
  },
  mounted() {
    (this.tab = this.currentTab),
      console.log(this.currentTab),
      window.addEventListener("mouseleave", () => {
        this.width = this.$refs.card.offsetWidth;
      });
  },
};
</script>
<style>
@media screen and (min-width: 2200px) {
  .feedback-card {
    /* max-width: 1100px;
    min-width: 800px; */
    background: rgba(72, 139, 143, 0.4);
    background: radial-gradient(
      circle at left top,
      rgba(72, 139, 143, 0.75) 0%,
      rgba(23, 63, 85, 0.75) 100%
    );
    background-position: 100% 100%;
  }
}

@media screen and (min-width: 1800px) and (max-width: 2200px) {
  .feedback-card {
    /* max-width: 800px;
    min-width: 800px; */

    background: rgba(72, 139, 143, 0.4);
    background: radial-gradient(
      circle at left top,
      rgba(72, 139, 143, 0.75) 0%,
      rgba(23, 63, 85, 0.75) 100%
    );
    background-position: 100% 100%;
  }
}

@media screen and (min-width: 1000px) and (max-width: 1500px) {
  .feedback-card {
    /* max-width: 670px;
    min-width: 670px; */

    background: rgba(72, 139, 143, 0.4);
    background: radial-gradient(
      circle at left top,
      rgba(72, 139, 143, 0.75) 0%,
      rgba(23, 63, 85, 0.75) 100%
    );
    background-position: 100% 100%;
  }
}
</style>
