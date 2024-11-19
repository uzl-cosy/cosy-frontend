<!--Session Content Component: Session Overview contains the overview of the session-->
<template>
  <div class="flex 2xl:my-6 h-auto">
    <Teleport to="body" v-if="editCourse">
      <div
        class="bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center absolute inset-0 z-20"
        id="overlay"
        @click.self="
          editCourse = false;
          this.existent = false;
        "
      >
        <div
          @click.self="close"
          class="flex justify-start absolute w-fit rounded-xl py-9 px-3 bg-ocean-dark/50 shadow-lg inset-1/2-screen"
        >
          <div class="flex flex-col mx-auto justify-center">
            <span class="font-bold text-xl mx-auto my-3 text-white"
              >Termindaten</span
            >
            <BaseConfig></BaseConfig>
            <SmallButton
              class="self-end -ml-32 bottom-0"
              @click.self="
                editCourse = false;
                this.existent = false;
                this.saveConfig();
              "
              >Speichern</SmallButton
            >
          </div>
          <div
            class="flex ml-auto h-fit justify-end right hover:bg-blue-200 rounded-lg"
            @click="editCourse = false"
          >
            <Icon iconName="close" size="32"></Icon>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="flex flex-col justify-start">
      <div class="flex flex-col items-start">
        <div class="flex justify-between">
          <div
            class="min-w-1/3 py-1 flex 2xl:text-xl text-slate-500 font-normal justify-center"
          >
            <div
              class="flex justify-center items-center w-auto mx-5 p-1 rounded-lg cursor-pointer"
              :class="{ 'bg-sky-200': this.hoverDate }"
              @mouseover="this.hoverDate = true"
              @mouseleave="this.hoverDate = false"
              @click="this.editCourse = !this.editCourse"
            >
              <Icon iconName="clock" class="mr-3"></Icon>
              <div class="text-left">
                <p>
                  Datum:
                  <strong>{{ this.date }}</strong>
                </p>
              </div>
              <div
                @mouseover="this.hoverDate = true"
                @mouseleave="this.hoverDate = false"
                class="p-3 cursor-pointer"
              >
                <Icon
                  v-if="!editCourse"
                  iconName="pen"
                  size="18"
                  class="mx-2"
                ></Icon>
                <Icon v-else iconName="check" size="18" class="mx-2"></Icon>
              </div>
            </div>

            <div
              class="flex justify-center items-center w-auto mx-5 rounded-lg cursor-pointer"
              :class="{ 'bg-sky-200': this.hoverRoom }"
              @mouseover="this.hoverRoom = true"
              @mouseleave="this.hoverRoom = false"
              @click="
                this.editRoom
                  ? (this.editRoom = this.editRoom)
                  : (this.editRoom = true)
              "
            >
              <div class="w-full flex items-center">
                <span class="mx-2">Ort: </span>
                <span v-if="!editRoom"
                  ><strong>{{
                    roomConfig ? roomConfig.room_selected : ""
                  }}</strong></span
                >
                <span v-else>
                  <Combobox
                    :data="Rooms"
                    @update-data="
                      (data) => this.$store.commit('setRoom', data.name)
                    "
                    :selectedValue="roomConfig ? roomConfig.room_selected : ''"
                  ></Combobox>
                </span>
              </div>

              <div class="p-3 cursor-pointer">
                <Icon
                  v-if="!editRoom"
                  iconName="pen"
                  size="18"
                  class="mx-2"
                ></Icon>
                <Icon
                  v-else
                  iconName="check"
                  size="18"
                  class="mx-2"
                  @click="closeEditRoom"
                ></Icon>
              </div>
            </div>

            <!-- <div class=" flex justify-center w-auto items-center ">
      <div class="flex flex-row justify-center items-center ">
        <p class="pr-5 ">Team 1</p>

        <div class="flex flex-col items-center "></div>
      </div>
    </div> -->
          </div>
          <div
            @click="this.$emit('changeTab', 3)"
            class="hover:bg-sky-200 cursor-pointer rounded-lg px-2 py-1 min-w-1/3 2xl:text-xl text-slate-500 font-normal justify-center whitespace-nowrap self-center"
          >
            Aufgenommene Fallbeispiele:
            <strong>{{
              this.getFeedbacks.filter(
                (obj) => obj.meta.session_id === this.getCurrentSessionId
              ).length
            }}</strong>
          </div>
          <!-- <div class="flex w-fit justify-between items-start">
            <InfoArea
              :initial="true"
              alignIcon="left "
              v-if="getCurrentSession.status == 'new'"
              ><span class="mx-2"
                >Sie sind in ihrem gerade angelegten Kurs. Sie können nun
                Cosy-Aufnahmen durchführen.</span
              ></InfoArea
            >
          </div> -->
        </div>
        <!-- <div class="flex items-center 2xl:mt-7 ">
          AUDIODATEN
        </div> -->
        <div class="flex-col">
          <div class="flex flex-col w-full items-start mt-3">
            <span class="flex justify-end">
              <div
                v-if="this.$router.path === 'session-overview'"
                class="p-2 hover:bg-secondary/50 rounded-lg z-10"
                @click="changeTab(1)"
                style="margin-bottom: -40px"
              >
                <Icon iconName="edit " color="darkblue "></Icon></div
            ></span>
            <CaseConfig
              v-if="this.windowHeight > 900"
              class="w-auto"
              :showRecord="true"
              @go-to-record="(e) => this.$emit('go-to-record', e)"
            ></CaseConfig>
            <!-- <TableCases
            class="mx-2"
            :data="getCaseConfig.cases"
            :labels="Array('Fallname', 'Fallbeschreibung')"
            icon="mask"
            >Fallbeispiele</TableCases
          > -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="mx-5 my-8 flex flex-col items-center">
    <div class="flex justify-evenly pt-8 space-x-10 text-primary">
      <div
        class="grid grid-cols-3 gap-x-96 font-normal text-lg truncate leading-8"
      >
        <div>Gruppe 1</div>
        <div>Gruppe 2</div>
        <div>Gruppe 3</div>
      </div>
    </div>

    <div class="flex flex-col mx-32 w-full">

      <div class="flex space-x-3 my-5 h-min w-full">
        <router-link
          to="/fall1dozent"
          class="bg-complementary w-full text-white shadow shadow-complementary p-4 rounded-lg text-lg"
        >
          <div>
            <p class="text-center">
              Gruppe 1 <br />
              Fall 1 - Dreyfus
            </p>
          </div>
        </router-link>
        <div
          class="bg-primary w-full text-white shadow shadow-primary p-4 rounded-lg text-lg"
        >
          <p class="text-center">
            Gruppe 2 <br />
            Fall 2
          </p>
        </div>
        <div
          class="bg-complementary w-full text-white shadow shadow-complementary p-4 rounded-lg text-lg"
        >
          <p class="text-center">
            Gruppe 3 <br />
            Fall 3
          </p>
        </div>
      </div>

      <div class="flex space-x-3 h-min">
        <div
          class="bg-complementary w-full text-white shadow shadow-complementary p-4 rounded-lg text-lg"
        >
          <p class="text-center">
            Gruppe 1 <br />
            Fall 4 - Dreyfus
          </p>
        </div>
        <div
          class="bg-primary w-full text-white shadow shadow-primary p-4 rounded-lg text-lg"
        >
          <p class="text-center">
            Gruppe 2 <br />
            Fall 5
          </p>
        </div>
        <div
          class="bg-complementary w-full text-white shadow shadow-complementary p-4 rounded-lg text-lg"
        >
          <p class="text-center">
            Gruppe 3 <br />
            Fall 6
          </p>
        </div>
      </div>
    </div>
  </div> -->
</template>
<script>
import Icon from "../interface-components/Icon.vue";
import SmallButton from "../interface-components/SmallButton.vue";
import BaseConfig from "../steps/BaseConfig.vue";
import CaseConfig from "../steps/CaseConfig.vue";
import Combobox from "../form-components/Combobox.vue";
import axios from "axios";
import { API_URL } from "../../config";

import { mapState, mapGetters } from "vuex";
export default {
  components: {
    BaseConfig,
    CaseConfig,
    Icon,
    SmallButton,
    Combobox,
  },
  data() {
    return {
      date: "",
      roomConfig: { roomSelected: "" },
      hoverDate: false,
      hoverRoom: false,
      overlay: false,
      editRoom: false,
      editCases: false,
      editCourse: false,
      windowHeight: window.innerWidth,
      sizes: ["klein", "mittel", "groß"],
      echos: ["schlecht", "mittel", "gut"],
      Rooms: [
        {
          name: "Hilbert",
        },
        {
          name: "Banach",
        },
        {
          name: "C1",
        },
        {
          name: "C2",
        },
      ],
      selectedDate: new Date(),
      speaker1Defined: false,
      speaker2Defined: false,
      session: {
        baseConfig: {
          application_domain: "",
          subject_name: "",
          subject_topic: "",
          event_topic: "",
        },
        roomConfig: {
          room_size: "roomsize1",
          room_echo: "echo1",
          room_selected: "1",
          rooms: [
            {
              name: "Seminarraum 23",
              color: "",
            },
            {
              name: " Banach",
              color: "",
            },
            {
              name: "Raum X1",
              color: "",
            },
          ],
        },
        caseConfig: {
          case_name: "",
          case_description: "",
          case_notes: " ",
        },
        speakerConfig: {
          speaker1_name: "",
          speaker1_role: "",
          speaker2_name: "",
          speaker2_role: "",
          roles: [
            {
              name: "Patient*in",
            },
            {
              name: "Arzt / Ärztin",
            },
            {
              name: "Hebamme",
            },
            {
              name: "Physiotherapeut*in",
            },
          ],
        },
        audioConfig: {
          micro1_id: "1",
          micro1_name: "Nr.1",
          micro1_color: "red",
          micro1_brand: "kp",
          micro2_id: "2",
          micro2_name: "Nr.2",
          micro2_brand: "String",
          micro2_color: "red",
          microphones: [
            {
              name: "Nr.1",
              color: "red",
            },
            {
              name: "Nr.2",
              color: "blue",
            },
            {
              name: "Nr.3",
              color: "green",
            },
          ],
        },
      },
      roomsize: "",
      roomecho: "",
    };
  },
  methods: {
    closeEditRoom() {
      event.stopPropagation();
      this.editRoom = false;
      this.hoverRoom = !this.hoverRoom;
    },
    saveConfig() {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }

      let data = this.getCurrentSession;

      console.log(data);
      axios
        .put(API_URL + "/sessions/" + data.id, data, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dateChanged() {
      if (this.selectedDate == null) {
        this.selectedDate = this.getCurrentSession.date;
      } else this.$store.commit("setDate", this.selectedDate);
    },
    changeTab(e) {
      this.$emit("change-tab", e);
    },
    formatDate(date) {
      const months = [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
      ];

      const monthIndex = date.getMonth();
      return (
        date.getDate() + ". " + months[monthIndex] + " " + date.getFullYear()
      );
    },
    init() {
      const dateStr = this.getCurrentSession.date;
      const date = new Date(dateStr);

      const formattedDate = date.toLocaleDateString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      this.date = formattedDate;

      this.roomConfig = this.getRoomConfig;
    },
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getSpeakers: "getSpeakers",
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getCurrentSessionId: "getCurrentSessionId",
      getAllSessions: "getAllSessions",
      getCaseConfig: "getCaseConfig",
      getSpeakerRoles: "getSpeakerRoles",
      getFeedbacks: "getFeedbacks",
    }),
    dateFormat() {
      const dateStr = this.getCurrentSession.date;
      const date = new Date(dateStr);

      const formattedDate = date.toLocaleDateString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      return formattedDate;
    },
  },
  created() {
    setTimeout(() => this.init(), 50);
  },
  watch: {
    getRoomConfig() {
      this.roomConfig = this.getRoomConfig;
    },
    getCurrentSession() {
      const dateStr = this.getCurrentSession.date;
      const date = new Date(dateStr);

      const formattedDate = date.toLocaleDateString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      this.date = formattedDate;
    },
  },
  mounted() {
    // setTimeout(
    //   () =>
    //     function () {
    //       this.getCurrentSession && this.getCurrentSession.date;
    //       this.date = this.formatDate(new Date(this.getCurrentSession.date));
    //       if (this.getRoomConfig) this.roomConfig = this.getRoomConfig;
    //     },
    //   50
    // );
  },
  unmounted() {
    this.$store.commit("setSessionStatus", "existing");
  },
};
</script>
