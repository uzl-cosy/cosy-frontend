<!--VIEW COMPONENT: Selected Session view-->
<template>
  <div class="container h-full pb-20">
    <!--OVERLAY: New session created (disabled)-->
    <!-- <Teleport to="body" v-if="false">
      <div
        class="bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center absolute inset-0 z-20"
        id="overlay"
        @click.self="redirectRequest = false"
      >
        <div
          class="flex justify-start absolute w-fit rounded-xl py-6 px-3 bg-ocean-dark/50 shadow-lg inset-1/2-screen"
        >
          <div class="flex flex-col mx-auto items-center">
            <div class="flex justify-between w-full mx-10">
              <span
                class="font-bold text-xl w-full flex justify-center mx-auto mt-1 mb-6 text-white"
              >
                Neuer Termin erfolgreich erstellt
              </span>
              <div
                class="flex ml-auto w-fit h-fit justify-end right hover:bg-blue-200 rounded-lg"
                @click="this.welcomeFlag = false"
              >
                <Icon iconName="close" size="32"></Icon>
              </div>
            </div>
            <div
              class="w-fit h-full flex flex-col items-start my-auto mx-auto justify-start px-12 py-8 rounded-xl"
              :class="{
                'bg-sky-100': !highlightForm,
                'bg-blue-200': highlightForm,
              }"
            >
              <div class="my-5">
                Sie können nun
                <strong
                  class="text-primary cursor-pointer"
                  @click="
                    this.welcomeFlag = false;
                    this.currentTab = 2;
                  "
                  >Aufnahmen machen</strong
                >
                oder
                <strong
                  class="text-primary cursor-pointer"
                  @click="
                    this.welcomeFlag = false;
                    this.currentTab = 1;
                  "
                  >weitere Fälle</strong
                >
                erstellen.
              </div>

              <div class="flex justify-center w-full">
                <SmallButton
                  class="mx-2 mt-5 py-3"
                  size=""
                  @click="this.welcomeFlag = false"
                  >Schließen</SmallButton
                >
                <SmallButton
                  class="mx-2 mt-5 py-3"
                  preset="outlined"
                  size=""
                  @click="this.deleteSession(this.getCurrentSession.id)"
                  ><Icon class="mx-2" size="32" iconName="delete"></Icon>Termin
                  löschen</SmallButton
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport> -->

    <!-- HEADER -->
    <div class="w-full h-full">
      <div class="flex items-center justify-between">
        <div class="mx-2 flex md:flex-col justify-start 2xl:flex-col-reverse">
          <ThePageTitle
            ><span class="flex items-center"
              ><span class="pr-1 whitespace-nowrap">Cosy-Termin:</span>
              <div
                :class="{
                  'hover:bg-sky-100 rounded-lg  flex cursor-pointer items-center':
                    this.currentTab === 0,
                }"
                @click="this.$refs.overviewTab.editCourse = true"
              >
                <strong class="ml-2"> {{ this.applicationTitle }}</strong
                ><Icon
                  v-if="this.currentTab === 0"
                  iconName="pen"
                  size="18"
                  class="mx-2"
                  color="rgba(0 97 122 / 0.6)"
                ></Icon>
              </div> </span
          ></ThePageTitle>

          <TheBreadcrumb
            class="ml-2 w-fit self-start primary"
            :breadcrumbs="breadcrumbs"
            @click="this.$router.push('/courses')"
          ></TheBreadcrumb>
          <!-- <Icon iconName="settings"></Icon> -->
        </div>

        <!-- Helping Information-->
        <div
          class="flex items-center bg-primary rounded-xl lg:p-1 md:p-0.5 xl:-mt-6 xl:mb-7 2xl:-mb-6 md:-mt-12 2xl:text-lg xl:text-base md:text-sm sm:text-x"
          @click.self="close"
          v-if="this.getCurrentSession.status === 'new'"
        >
          <div class="flex items-center justify-between w-fit px-2">
            <span
              class="font-bold s w-fit flex justify-center mx-auto text-white items-center"
            >
              Neuer Termin wurde erstellt!
            </span>
          </div>
          <div
            class="w-fit h-full flex flex-col items-start my-auto mx-auto justify-start px-5 xl:py-2 md:py-0.5 rounded-xl"
          >
            <div class="2xl:my-1 text-white">
              Sie können nun
              <strong
                class="text-primary cursor-pointer rounded-lg p-1"
                :class="{
                  'bg-sky-100': !highlightForm,
                  'bg-blue-200': highlightForm,
                }"
                @click="
                  this.$store.commit('setSessionStatus', 'existing');
                  this.currentTab = 2;
                "
                >Aufnahmen machen</strong
              >
              oder
              <strong
                class="text-primary cursor-pointer rounded-lg p-1 m-1 leading-normal whitespace-nowrap"
                :class="{
                  'bg-sky-100': !highlightForm,
                  'bg-blue-200': highlightForm,
                }"
                @click="
                  this.$store.commit('setSessionStatus', 'existing');
                  this.currentTab = 1;
                "
                >weitere Fälle erstellen.
              </strong>
            </div>

            <!-- <div class="flex justify-center w-full">
              <span
                class="flex items-center hover:bg-primary/30 cursor-pointer px-1.5 rounded-lg mx-1 2xl:mt-2 2xl:py-2 xl:pt-2 xl:text-sm"
                @click="this.deleteSession(this.getCurrentSession.id)"
                ><Icon class="mr-2" size="22" iconName="delete"></Icon>Termin
                wieder löschen</span
              >
            </div> -->
          </div>
          <div
            class="flex w-fit h-fit justify-end right hover:bg-blue-200 rounded-lg"
            @click="this.$store.commit('setSessionStatus', 'existing')"
          >
            <Icon iconName="close" size="32" color="white"></Icon>
          </div>
        </div>
      </div>

      <!-- Upper Navigation -->
      <div
        class="w-full flex flex-row 2xl:justify-start md:justify-end 2xl:space-x-10 md:space-x-4 space-x-reverse 2xl:p-2 md:p-1 text-secondary md:text-sm 2xl:text-lg md:-mt-6 2xl:mt-6"
      >
        <span v-for="(tab, index) in tabs" :key="index"
          ><Tab
            :selected="this.currentTab === index"
            @click="
              () => {
                if (this.checkRecordStatus(index)) {
                  console.log('check true');
                } else {
                  this.currentTab = index;
                  this.$store.commit('setTabState', {
                    tab: index,
                    important: false,
                  });
                  console.log('check false');
                }
                this.savedIndex = index;
              }
            "
            >{{ tab.title }}</Tab
          ></span
        >
      </div>
      <hr
        class="h-px 2xl:my-2 md:my-1 bg-primary/50 border-0 dark:bg-primary"
      />

      <div class="w-full h-full component mt-1 px-4">
        <component
          class="px-3 h-full w-full overflow-y-auto"
          v-bind:is="this.tabs[this.currentTab].component"
          @change-tab="(e) => (this.currentTab = e)"
          @resetFlags="this.resetFlags"
          @go-to-record="
            (e) => {
              console.log('csae ', this.getCaseConfig.cases[e].case_role1);
              this.$store.commit('setCurrentRecord', {
                case: {
                  case_id: this.getCaseConfig.cases[e].case_id,
                },
                speaker1: { role: this.getCaseConfig.cases[e].case_role1 },
                speaker2: { role: this.getCaseConfig.cases[e].case_role2 },
                words: {
                  wordsToSay: this.getCaseConfig.cases[e].case_wordsToSay,
                  wordsNotToSay: this.getCaseConfig.cases[e].case_wordsNotToSay,
                },
              });
              this.currentTab = 2;
            }
          "
          :ref="this.tabs[this.currentTab].ref"
        />
        <!-- this.$store.commit('setCurrentRecord', {
            case: { case_id: this.getCaseConfig.cases[e].case_id },
          }); -->
      </div>
    </div>
  </div>
</template>
<script>
import TheBreadcrumb from "../components/interface-components/TheBreadcrumb.vue";
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import TableCourses from "../components/tables/TableCourses.vue";
import SessionOverview from "../components/tabs/SessionOverview.vue";
import SessionAnalysis from "../components/tabs/SessionAnalysis.vue";
import SessionNewAnalysis from "../components/tabs/SessionNewAnalysis.vue";

import SessionCases from "../components/tabs/SessionCases.vue";
import { mapGetters } from "vuex";
import Tab from "../components/interface-components/Tab.vue";
import Icon from "../components/interface-components/Icon.vue";
import SmallButton from "../components/interface-components/SmallButton.vue";
import axios from "axios";
import { API_URL } from "../config";
export default {
  components: {
    ThePageTitle,
    TableCourses,
    TheBreadcrumb,
    Tab,
    Icon,
    SmallButton,
  },
  data() {
    return {
      welcomeFlag: false,
      breadcrumbs: [{ id: "1", name: "Termine" }],
      tabs: [
        {
          component: SessionOverview,
          title: "Übersicht",
          description:
            "Geben Sie die <b>Grunddaten</b> für die Gesprächsaufzeichnung ein:",
          ref: "overviewTab",
        },
        {
          component: SessionCases,
          title: "Fälle",
          description:
            "Für die <b>Audiokonfiguration</b> sind Raumeigenschaften und Mikrofonierung notwendig:",

          ref: "casesTab",
        },
        {
          component: SessionNewAnalysis,
          title: "Neue Aufnahme",
          description:
            "Geben Sie die <b>Falldaten</b> für die Gesprächsaufzeichnung ein:",

          ref: "recordTab",
        },
        {
          component: SessionAnalysis,
          title: "Cosy-Analysen",
          description:
            "Geben Sie die <b>Falldaten</b> für die Gesprächsaufzeichnung ein:",

          ref: "analysisTab",
        },

        // {
        //   component: SessionParticipants,
        //   title: "Teilnehmer:innen",
        //   description:
        //     "Für die <b>Audiokonfiguration</b> sind Raumeigenschaften und Mikrofonierung notwendig:",
        // },
        // {
        //   component: SessionFiles,
        //   title: "Dateien",
        //   description:
        //     "Für die <b>Audiokonfiguration</b> sind Raumeigenschaften und Mikrofonierung notwendig:",
        // },
      ],
      currentTab: 0,
      date: "",
      room: "",
      recordFlag: false,
      confirmWindow: false,
      savedIndex: null,
      myVar: false,
    };
  },
  methods: {
    resetFlags() {
      this.recordFlag = false;
      this.confirmWindow = false;
      this.savedIndex = null;
      // this.welcomeFlag = false;
    },
    checkRecordStatus(index) {
      this.savedIndex = index;
      if (
        this.currentTab == 2 &&
        this.getCurrentRecord.recordStatus == "recording"
      ) {
        if (!this.recordFlag) {
          // setTimeout(() => {
          alert(
            "Eine Aufnahme läuft gerade! Wenn Sie fortfahren wird die Aufnahme beendet."
          );
          // }, 50);
          this.recordFlag = true;

          return true;
        } else {
          // setTimeout(() => {
          this.confirmWindow = confirm(
            "Wollen Sie die Aufnahme wirklich beenden? Dann klicken Sie OK."
          );
          // }, 50);
          return true;
        }
      }
      return false;
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
    deleteSession(id) {
      console.log(id);
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          token = storedToken;
        }
      }
      axios
        .delete(API_URL + "/sessions/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      this.$router.push("/");
    },
    init() {
      this.$store.commit("setCurrentSessionId", this.$route.params.id);

      if (this.getCurrentSession && this.getNewSession === true) {
        this.welcomeFlag = true;
        this.$store.commit("setNewSession", false);
      }
      if (
        (this.getCurrentSession &&
          this.getCurrentSession.id &&
          this.getPrevSession === this.getCurrentSession.id) ||
        this.$store.state.tabState.important
      ) {
        this.currentTab = this.$store.state.tabState.tab;
      } else {
        this.currentTab = 0;
      }
      setTimeout(() => {
        // this.date = this.getCurrentSession.date.slice(0, 10);
        this.$store.commit("setPrevSession", this.getCurrentSession.id);

        this.room = this.getCurrentSession.roomConfig.room_selected;
      }, 300);
    },
    fetchSessionData() {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      axios
        .get(API_URL + "/sessions", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.sessions = response.data;
          this.$store.commit("setSessions", response.data);
          // console.log("this.getCurrentSession", this.getCurrentSession);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },
  },
  watch: {
    confirmWindow(val) {
      console.log("alert ", val);

      if (val) {
        console.log("index", this.savedIndex);
        this.currentTab = this.savedIndex;
        this.$store.commit("setTabState", {
          tab: this.savedIndex,
          important: false,
        });
        axios.post(this.getCurrentInstance.url + "/recording/stop");
        this.$store.commit("setRecordedCase", this.getCurrentRecord);
        this.$store.commit("setCurrentRecord", { recordStatus: "stopped" });
      } else {
        console.log("index", this.savedIndex);

        //do nothing
      }
    },
  },

  computed: {
    ...mapGetters({
      getSpeakers: "getSpeakers",
      getSpeakerRoles: "getSpeakerRoles",
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getSessions: "getSessions",
      getCurrentFeedback: "getCurrentFeedback",
      getCurrentRecord: "getCurrentRecord",
      getCaseConfig: "getCaseConfig",
      getPrevSession: "getPrevSession",
      getNewSession: "getNewSession",
      getCurrentInstance: "getCurrentInstance",
    }),
    applicationTitle() {
      // console.log(this.getCurrentSession);
      if (this.getCurrentSession) {
        return this.getCurrentSession.baseConfig.subject_topic;
      } else {
        return "NULL";
      }
    },
  },
  mounted() {
    // if (!this && !this.getCurrentSession) {
    //   let sessionId = localStorage.getItem("sessionId");
    //   if (sessionId) {
    //     this.$store.commit("setCurrentSession", sessionId);
    //   } else this.$router.push("/");
    // }
  },
  created() {
    this.fetchSessionData();
    setTimeout(() => this.init(), 50);
  },
};
</script>
