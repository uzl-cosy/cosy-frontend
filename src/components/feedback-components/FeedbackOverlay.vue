<!--Feedback Component: FeedbackOverlay.vue is an overlay that shows a detailed view of the feedback and lets user navigate-->
<template>
  <div
    class="bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center absolute inset-0"
    id="overlay"
    @click.self="close"
  >
    <div
      id="overlay"
      v-show="isActive"
      class="feedback-overlay absolute w-3/4 h-fit rounded-lg m-auto px-6 pt-6 pb-10"
    >
      <div class="">
        <div class="w-full mx-2 my-1 px-6 flex justify-between text-sky-200">
          <div class="flex items-center">
            <Icon
              color="skyblue"
              class="mr-5"
              :iconName="icon"
              :size="this.windowWidth > 1000 ? 48 : 32"
            ></Icon>
            <h3
              class="2xl:text-3xl xl:text-xl md:text-lg font-bold self-center mx-12"
              style="min-width: 600px"
            >
              {{ title }}
            </h3>
          </div>
          <Icon
            color="skyblue"
            iconName="close"
            :size="this.windowWidth > 1000 ? 48 : 32"
            @click="close"
          ></Icon>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-full px-2 flex justify-center">
            <div
              class="bg-white w-full h-full 2xl:m-4 md:m-1 2xl:py-8 md:py-2 2xl:px-10 md:px-2 rounded-lg items-center self-center"
              v-if="charts"
            >
              <slot name="chart"></slot>
            </div>
            <div
              class="bg-white w-full h-full 2xl:m-4 md:m-1 2xl:py-8 md:py-2 2xl:px-10 md:px-2 rounded-lg items-center self-start"
            >
              <h4
                class="font-bold text-2xl text-blue-dark flex items-center justify-start 2xl:p-8 xl:p-3 md:p-0.5"
              >
                <Icon iconName="info_hexa" color="darkblue"></Icon
                ><span class="mx-3 2xl:text-xl xl:text-lg md:text-base"
                  >Info</span
                >
              </h4>
              <p
                class="2xl:text-lg xl:text-base md:text-sm text-justify 2xl:p-2 xl:p-1 md:p-0.5"
              >
                <slot name="info"></slot>
              </p>
            </div>
          </div>

          <div class="w-full px-6">
            <div
              class="bg-white rounded-lg 2xl:py-8 flex justify-center w-full"
            >
              <div class="w-full"><slot name="additional"></slot></div>
              <div class="flex flex-col mr-2 w-fit" v-if="false">
                <div class="w-full" style="margin-left: -60px">
                  <div
                    class="w-fit ml-3 hover:bg-sky-200 rounded-full self-start absolute z-10"
                    @click="toggleAdditionalInfo"
                  >
                    <Icon iconName="info_circle" color="darkblue"></Icon>
                  </div>
                  <div
                    class="2xl:p-4 xl:p-1 md:p-1 rounded-xl border-2 border-slate-400 z-0 w-full"
                    v-if="addInfoActive"
                    style="margin-top: -14px"
                  >
                    <div
                      class="flex justify-between items-start ml-12 mb-4 2xl:mt-2"
                    >
                      <div class="text-lg font-bold mr-5">Diagramminfo</div>
                    </div>

                    <span class="">{{ addInfo }} </span>
                    <SmallButton
                      preset="outline"
                      class="py-1 mt-2"
                      @click="toggleAdditionalInfo"
                    >
                      Schließen
                    </SmallButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Icon from "../../components/interface-components/Icon.vue";
import SectionTitle from "../interface-components/SectionTitle.vue";
import SmallButton from "../interface-components/SmallButton.vue";

export default {
  components: {
    Icon,
    SectionTitle,
    SmallButton,
  },
  data() {
    return {
      addInfoActive: false,
    };
  },
  props: {
    icon: { type: String, default: "document" },
    title: { type: String, default: "Parametertitel" },
    addInfo: { type: String, default: "Hier stehen Informationen" },
    isActive: { type: Boolean, default: false },
    charts: { type: Boolean, default: false },
  },
  methods: {
    /**
     * Emits a "close-overlay" event.
     *
     * @return {void}
     */
    close() {
      this.$emit("close-overlay");
    },
    /**
     * A function to toggle the additional information display.
     *
     * @return {void}
     */
    toggleAdditionalInfo() {
      this.addInfoActive = !this.addInfoActive;
    },
  },
  mounted() {
    // document.addEventListener("click", this.close);
  },
  beforeDestroy() {
    // document.removeEventListener("click", this.close);
  },
};
</script>
<style>
.feedback-overlay {
  background: rgba(72, 139, 143, 0.4);
  background: radial-gradient(
    circle at left top,
    rgba(72, 139, 143, 0.95) 0%,
    rgba(23, 63, 85, 0.95) 100%
  );
  background-position: 100% 100%;
}
</style>
