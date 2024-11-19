<!--Configuration Component: ImageStepsCard.vue lets user see (& choose) microphone instructions-->
<template>
  <div class="relative m-auto h-full">
    <div class="rounded-xl bg-sky-100 pt-2 ml-4 w-full h-full my-auto">
      <div class="flex flex-col items-center justify-evenly m-auto h-full">
        <div v-if="!this.testRecord">
          {{
          }}<img
            class="shadow z-0 relative w-72 rounded-xl inset-x-0 top-0"
            :src="imageSrc"
            alt=""
          />
          <label
            @click="choose1 = true"
            for="status"
            class="w-72 z-10 absolute rounded-br-xl rounded-bl-xl bg-gray-300 text-white p-2 flex justify-center"
            style="margin-top: -40px"
            ><span v-if="status == 1" class="text-green-600">Verbunden</span
            ><span v-else class="text-red-600">Kein Signal</span></label
          >
        </div>
        <div v-else>
          <div
            class="text-xl text-slate-700 animate-pulse border-2 px-3 leading-10 py-2 bg-slate-300 rounded-lg mx-3 my-9"
          >
            Hallo, ich spiele die Rolle
            <span class="font-bold">{{ this.speakerRole }} </span>
          </div>
        </div>

        <div class="flex flex-col justify-between items-center m-auto">
          <div class="p-4 flex flex-col text-xl mx-4 leading-loose with-auto">
            <span class="flow-root w-fit h-fit">
              <span
                class="mr-7 text-primary w-96 flex items-center"
                :class="{
                  'font-bold ': this.status == 0,
                  'font-light text-primary/50': this.status == 1,
                }"
                ><span class="mr-5">1.</span> Bitte Mikrofon anschalten.<Icon
                  v-if="this.status == 1"
                  class="ml-2 w-8"
                  color="
                    rgb(0,97,122, 0.4)
                  "
                  iconName="check"
                ></Icon></span
            ></span>
            <span class="font-extralight text-primary w-fit flex ml-10">
              <span
                class="w-fit font-light"
                :class="{
                  'font-bold ': this.status == 0,
                  'font-light text-primary/50': this.status == 1,
                }"
              >
                <span class="flex flex-wrap items-center"
                  ><span class="-indent-10">2.</span>
                  <span class="-indent-1">Mikrofon an der Kleidung von </span>
                  <span class="font-semibold mx-1">{{ this.speaker }}</span>
                  <span>befestigen.</span>
                </span></span
              >
              <div
                class="m-1 py-1 rounded-full hover:bg-sky-200 self-start"
                @click="this.activeInfo = !this.activeInfo"
              >
                <Icon class="mx-2 w-8" iconName="info_circle" size="24"></Icon>
              </div> </span
            ><InfoArea
              class="left-0"
              style="margin-left: -2px"
              alignIcon="left"
              width=""
              v-if="this.activeInfo"
              :initial="true"
              @click="this.activeInfo = false"
              >Das Mikrofon sollte möglichst nahe am Mund des Sprechers sein (z.
              B. am Kragen oder Schal)</InfoArea
            >

            <!-- (Unused) Calibration-->
            <!-- <div class="flex flex-col">
              <div class="flex items-center py-1">
                <span class="mr-5 text-primary">3. </span>
                <div
                  class="w-full flex items-center rounded-xl border-2 border-transparent"
                  :class="{
                    'hover:bg-sky-300 cursor-pointer border-slate-400 bg-white justify-center py-1 my-2 mb-2':
                      !this.calibrated,
                    'animate-pulse': this.testRecord,
                  }"
                  @click="this.calibrate()"
                >
                  <Icon
                    v-if="!this.calibrated"
                    class="mr-3 w-8"
                    iconName="microphone"
                    size="46"
                  ></Icon>

                  <span
                    class="flex justify-start text-primary truncate w-fit items-center"
                    :class="{
                      'justify-center': !this.calibrated,
                    }"
                    >Kalibrierung
                    {{
                      this.calibrated
                        ? "abgeschlossen"
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
                  </span>

                </div>
                <div
                  class="m-1 py-1 rounded-full hover:bg-sky-200 self-start"
                  @click="this.activeInfoCalibrate = !this.activeInfoCalibrate"
                >
                  <Icon
                    class="mx-2 w-8"
                    iconName="info_circle"
                    size="24"
                  ></Icon>
                </div>
              </div>
              <InfoArea
                class="left-0"
                style="margin-left: -2px"
                alignIcon="left"
                width=""
                v-if="this.activeInfoCalibrate"
                :initial="true"
                @click="this.activeInfoCalibrate = false"
                >Das Mikrofon sollte möglichst nahe am Mund des Sprechers sein
                (z. B. am Kragen oder Schal)</InfoArea
              >
            </div> -->

            <!-- <span class="font-extralight text-blue-800/50"
            >3. {{ steps.step1c }}</span
          > -->
          </div>

          <!-- <button
          class="leading-normal h-min rounded-2xl border-ocean-dark text-sky-900 text-lg center flex flex-row items-center w-3/4 mb-4"
        >
          <Icon class="w-12 mr-6" :iconName="icon" color="blue" /> Anderes
          Mikrofon benutzen
        </button> -->
        </div>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import Icon from "../../components/interface-components/Icon.vue";
import { mapState, mapGetters } from "vuex";
import Dropdown from "../../components/form-components/Dropdown.vue";
import InfoArea from "../interface-components/InfoArea.vue";
export default {
  components: {
    Icon,
    Dropdown,
    InfoArea,
  },
  props: {
    icon: String,
    imageSrc: String,
    speaker: String,
    speakerRole: String,
    number: String,
    status: Number,
  },
  data() {
    return {
      activeInfo: false,
      activeInfoCalibrate: false,
      calibrated: false,
      testRecord: false,
      microphones: [
        { name: "Nr.1", color: "red" },
        { name: "Nr.2", color: "green" },
        { name: "Nr.3", color: "blue" },
      ],
      steps: {
        step1a: { text: "Bitte Mikrofon 1 anschalten", color: "blue" },
        step1b:
          "Mikrofon an der Kleidung von " +
          // this.getSpeaker1.speakerName +
          "befestigen",
        step2a: { text: "Bitte Mikrofon 2 anschalten", color: "red" },
        step2b: "Mikrofon an der Kleidung von ",
        // + this.getSpeaker2.speakerName == ""
        //   ? fillers.speaker1
        //   : "Sprecher 2" + "befestigen"
        step1c: "Testsatz sprechen",
        step2c: "Testsatz sprechen",
      },
      states: {
        mikro1: { turnedOn: false, attached: false },
        mikro2: { turnedOn: false, attached: false },
      },
    };
  },
  methods: {
    /**
     * Toggles the testRecord value and emits a calibrate event based on the new testRecord value.
     * If the testRecord is false after toggling, sets the calibrated value to true.
     *
     * @return {void} No return value
     */
    calibrate() {
      this.testRecord = !this.testRecord;
      this.$emit("calibrate", this.testRecord);
      if (!this.testRecord) this.calibrated = true;
    },

    /**
     * Sets the microphone configuration by committing the 'setMicrophone' mutation to the store.
     *
     * @param {Object} e - The event object containing microphone information.
     * @return {void} 
     */
    setMic(e) {
      this.$store.commit("setMicrophone", [
        this.number,
        e.value,
        this.microphones[e.value[3] - 1].color,
      ]);
    },
  },
  computed: {
    ...mapState(["testroom"]),
    ...mapGetters(["getCurrentSession", "getSpeakers", "getMicrophones"]),
  },
};
</script>

