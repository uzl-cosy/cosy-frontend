<!--Configuration component: Room/Audio configuration-->
<template>
  <div class="w-full flex m-auto justify-center mx-2 2xl:my-3 md:my-2">
    <div
      class="rounded-xl w-auto bg-sky-100 pt-1 2xl:mb-5 px-4 flex flex-col items-center"
    >
      <!-- <span class="font-extrabold text-xl 2xl:my-3 md:my-1"
        >Raumkonfiguration</span
      > -->
      <div>
        <Dropdown
          class="my-4"
          :list="this.rooms"
          @update="setRoom"
          :selected="getRoomConfig ? getRoomConfig.room_selected : ' '"
          >Raum:
        </Dropdown>
      </div>

      <ButtonPanelHorizontal
        :options="roomSizes"
        base="roomsize"
        :checked="checkedSize"
        @update="(e) => updateSize(e)"
        ><span class="pl-3 font-bold self-start"
          >Raumgröße</span
        ></ButtonPanelHorizontal
      >
      <ButtonPanelHorizontal
        :options="roomEchos"
        base="echo"
        :checked="checkedEcho"
        @update="(e) => updateEcho(e)"
        ><span class="pl-3 font-bold self-start"
          >Raumklang</span
        ></ButtonPanelHorizontal
      >

      <!-- <ButtonPanelHorizontal
        :options="roomTest"
        base="test"
        :checked="checkedTest"
        @update="(e) => updateTest(e)"
        >Test</ButtonPanelHorizontal
      > -->
    </div>
    <!-- <div class="w-full flex flex-col items-start h-fit">
      <ImageStepsCard
        v-for="(card, index) in microConfig"
        :imageSrc="card.imageSrc"
        :number="index[4]"
        icon="roundError"
      ></ImageStepsCard>
    </div> -->
  </div>
</template>
<script>
import ImageStepsCard from "../../components/configuration-components/ImageStepsCard.vue";
import Icon from "../../components/interface-components/Icon.vue";
import ButtonPanelHorizontal from "../../components/form-components/ButtonPanelHorizontal.vue";
import Dropdown from "../../components/form-components/Dropdown.vue";

import { mapState, mapGetters } from "vuex";

export default {
  name: "AudioConfig",
  components: {
    ImageStepsCard,
    Icon,
    ButtonPanelHorizontal,
    Dropdown,
  },
  data() {
    return {
      selectedRoom: "Hier wählen",
      rooms: [],
      checkedSize: "null",
      checkedEcho: "null",
      checkedTest: "null",
      roomSizes: [
        { id: "roomsize0", name: "klein", detail: "<15qm" },
        { id: "roomsize1", name: "mittel", detail: "15-25qm" },
        { id: "roomsize2", name: "groß", detail: ">25qm" },
      ],
      roomEchos: [
        { id: "echo0", name: "schlecht", detail: "Es hallt viel." },
        { id: "echo1", name: "mittel", detail: "Es hallt ein wenig." },
        { id: "echo2", name: "gut", detail: "Es hallt gar nicht." },
      ],
      roomTest: [
        { id: "t0", name: "schlecht", detail: "" },
        { id: "t1", name: "mittel", detail: "" },
        { id: "t2", name: "gut", detail: "" },
      ],
      microConfig: {
        card1: {
          imageSrc: "../src/assets/v2-Mikrofon-rot.png",
          speaker: "",
          steps: [
            "Bitte Mikrofon 1 anschalten",
            // "Mikrofon an der Kleidung von" + this.getSpeaker1 + " befestigen.",
          ],
          color: "red",
          number: "2",
        },
        card2: {
          speaker: "",
          imageSrc: "../src/assets/v2-Mikrofon-blau.png",
          steps: [
            "Bitte Mikrofon 1 anschalten",
            // "Mikrofon an der Kleidung" + this.getSpeaker2 + " befestigen.",
          ],
          color: "blue",
          number: "1",
        },
      },
    };
  },
  methods: {
    /**
     * A function that checks if the room size is active.
     *
     * @param {number} i - The room size number to check.
     * @return {string} Returns a checkmark if the room size is active, otherwise an empty string.
     */
    isActive(i) {
      if (this.checked == "roomsize" + i) {
        return "✓   ";
      } else return "";
    },
    /**
     * Updates the size of the room.
     *
     * @param {Object} e - The event object.
     * @return {void}
     */
    updateSize(e) {
      //element is not picked yet
      if (this.checkedSize == "null" || this.checkedSize !== e.id) {
        this.checkedSize = e.id; //update data object state
        this.$store.commit("setRoomConfig", ["size", e.id]);
        this.$emit("data-changed");
      }
    },
    /**
     * Updates the echo configuration based on the provided event object.
     *
     * @param {Object} e - The event object containing the ID of the selected echo.
     * @return {void} This function does not return a value.
     */
    updateEcho(e) {
      if (this.checkedEcho == "null" || this.checkedEcho !== e.id) {
        this.checkedEcho = e.id; //update data object state
        this.$store.commit("setRoomConfig", ["echo", e.id]);
        this.$emit("data-changed");
      }
    },
    /**
     * A function that sets the room based on the provided event object.
     *
     * @param {Object} e - The event object.
     * @return {void}
     */
    setRoom(e) {
      this.$store.commit("setRoom", e.value);
      this.selectedRoom = this.rooms[e.id[4]];
      this.$emit("data-changed");
    },
  },
  mounted() {
    let speaker1 = this.getSpeakers ? this.getSpeakers[0].name : "Sprecher 1";
    let speaker2 = this.getSpeakers ? this.getSpeakers[1].name : "Sprecher 2";
    this.microConfig.card1.speaker = speaker1;
    this.microConfig.card2.speaker = speaker2;
    this.checkedEcho =
      this.getRoomConfig && this.getRoomConfig.room_echo
        ? this.getRoomConfig.room_echo
        : "";
    this.checkedSize =
      this.getRoomConfig && this.getRoomConfig.room_size
        ? this.getRoomConfig.room_size
        : "";
    this.rooms =
      this.getRoomConfig && this.getRoomConfig.rooms
        ? this.getRoomConfig.rooms
        : [{ name: "Banach" }, { name: "Seminarraum 23" }, { name: "Raum X1" }];
    this.selectedRoom = this.getRoomConfig && this.getRoomConfig.room_selected;
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getSpeakers: "getSpeakers",
      getBaseConfig: "getBaseConfig",
      getCurrentSession: "getCurrentSession",
      getRoomConfig: "getRoomConfig",
    }),
  },
};
</script>
