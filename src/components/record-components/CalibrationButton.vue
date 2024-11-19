<!--Record component that lets user calibrate the microphone (unused) -->
<template>
  <div class="flex flex-col w-fit items-center ml-12 my-3">
    <div class="flex items-center px-4 xl:py-2 md:py-1">
      <div
        class="w-full flex items-center rounded-xl border-2 border-transparent px-4 xl:py-2 md:py-1"
        :class="{
          'hover:bg-sky-300 cursor-pointer border-slate-400 bg-primary text-white justify-center py-0.5 my-1 mb-2':
            !this.calibrated,
          'bg-white text-primary': this.calibrated,
        }"
        @click="this.calibrate()"
      >
        <Icon
          v-if="!this.calibrated"
          class="mr-3 w-8"
          iconName="microphone"
          :color="this.calibrated ? 'rgb(0,97,122)' : 'white'"
          :size="this.windowWidth > 1200 ? '32' : '24'"
        ></Icon>

        <span
          class="flex justify-start truncate w-fit items-center mr-3 xl:text-sm md:text-xs"
          :class="{
            'justify-center': !this.calibrated,
            'animate-pulse': this.testRecord && !this.calibrated,
          }"
          >Kalibrierung
          {{
            this.calibrated && analysisStatus === 1
              ? "abgeschlossen"
              : this.calibrated
              ? "wird verarbeitet"
              : this.countdown > 0
              ? "startet in " + this.countdown
              : this.testRecord
              ? " stoppen"
              : " starten"
          }}
          <Icon
            v-if="this.calibrated"
            class="ml-2 w-8"
            color="
                    rgb(0,97,122, 0.8)
                  "
            iconName="check"
          ></Icon>
          <Icon
            v-if="this.calibrated && analysisStatus === 0"
            size="20"
            iconName="arrowsCircle"
            color="rgb(0,97,122, 0.8)"
            class="ml-3 animate-spin"
          ></Icon>
        </span>

        <!-- $event.target.attributes.iconName.setValue('info_cross'); -->
      </div>
      <div class="flex items-center">
        <div
          class="m-1 py-1 rounded-full flex items-center hover:bg-sky-200 self-start"
          v-if="calibrated"
          @click="this.$emit('setCalibrate', false)"
        >
          <Icon
            class="w-8"
            color="
                    rgb(0,97,122, 0.8)
                  "
            iconName="arrowsCircle"
          ></Icon>
        </div>
        <div
          class="m-1 py-1 rounded-full flex items-center hover:bg-sky-200 self-start"
          @click="this.activeInfoCalibrate = !this.activeInfoCalibrate"
        >
          <Icon class="w-8" iconName="info_circle" size="24"></Icon>
        </div>
      </div>
    </div>
    <div
      v-if="testRecord && !calibrated"
      class="flex flex-col items-center my-2 text-xl text-slate-700 border-2 px-3 leading-10 py-2 bg-slate-300 rounded-lg mx-1"
    >
      <span class="flex text-center my-2 text-base"
        >Bitte sprechen Sie folgenden Satz:</span
      >
      <span class="font-extrabold text-center mx-1">{{ this.text() }}</span>
    </div>
    <InfoArea
      class="left-0"
      style="margin-left: -2px"
      alignIcon="left"
      width=""
      v-if="this.activeInfoCalibrate"
      :initial="true"
      @click="this.activeInfoCalibrate = false"
      >Das Mikrofon sollte möglichst nahe am Mund des Sprechers sein (z. B. am
      Kragen oder Schal)</InfoArea
    >
  </div>
</template>

<script>
import Icon from "../interface-components/Icon.vue";
export default {
  components: { Icon },
  props: {
    testRecord: Boolean,
    calibrated: Boolean,
    recordBlocker: Boolean,
  },
  data() {
    return {
      activeInfoCalibrate: false,
      windowWidth: window.innerWidth,
      countdown: 0,

      calibrationTexts: [
        "Kommunikation ist so facettenreich wie unsere Gedanken",
        "Die Kunst in der Kommunikation besteht darin zu wissen, was ich wie sagen will.",
        "Kommunikation ist ein wunderbares Mittel, Konflikte zu lösen. Oder zu eskalieren.",
        "Handlung wird allgemein besser verstanden als Worte. Das Zucken einer Augenbraue, und sei es noch so unscheinbar, kann mehr ausdrücken als hundert Worte.",
        "Für ein gutes Tischgespräch kommt es nicht so sehr darauf an, was sich auf dem Tisch, sondern was sich auf den Stühlen befindet.",
      ],
    };
  },
  computed: {
    analysisStatus() {
      return 0;
    },
  },
  methods: {
    calibrate() {
      if (!this.recordBlocker) {
        if (this.testRecord) {
          this.$emit("toggleRecord");

          this.$emit("setCalibrate", true);
        } else {
          this.countdown = 3;
          let timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
              this.$emit("toggleRecord");
              this.$emit("calibrate");
              clearInterval(timer);
            }
          }, 1000);
        }
      }
    },
    text() {
      return this.calibrationTexts[
        Math.trunc(Math.random() * this.calibrationTexts.length)
      ];
    },
  },
};
</script>
