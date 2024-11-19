<!--VIEW-COMPONENT: home page that appears when you logged in-->
<template>
  <div class="h-full">
    <div ref="start">
      <span class="md:flex"
        ><span class="flex justify-start"
          ><ThePageTitle>{{ headline }}</ThePageTitle>
        </span>
        <div class="flex items-center justify-start px-2 2xl:flex-row">
          <span
            class="w-fit 2xl:text-2xl xl:text-xl md:text-lg text-xs md:my-1 font-semibold whitespace-nowrap md:ml-2 text-slate-500"
          >
            - Willkommen bei CoSy, dem Communication Support System!
          </span>

          <div class="h-1 z-10 md:-mt-12">
            <InfoArea ref="info" alignIcon="left">
              <div class="flex">
                <span> Mit CoSy können Sie... </span
                ><span class="mx-2"
                  ><b
                    ><ol>
                      <li>* Übungstermine für Kommunikationsseminare planen</li>
                      <li>* Fallbeispiele konfigurieren</li>
                      <li>* Kommunikationsanalysen machen</li>
                    </ol>
                  </b></span
                >
              </div>
            </InfoArea>
          </div>
        </div></span
      >
    </div>

    <!--table with courses planned-->
    <div
      class="flex flex-wrap h-full w-full justify-start items-start xl:my-5 px-3"
    >
      <div class="flex items-start xl:py-4 my-3 w-8/12 h-full">
        <TableCourses
          class="z-20"
          ref="sessions"
          icon="clockRewind"
          :button="true"
          :data="sessions"
          :labels="sessionLabels"
          :limit="this.windowWidth < 1200 ? 6 : 8"
          @delete-session="deleteSession"
          @open-config="openConfig"
          @duplicate="(e) => newCourseDuplicate(e)"
          ><span class="w-full"
            >{{
              this.$refs.sessions
                ? this.$refs.sessions.hideOld
                  ? "Geplante "
                  : ""
                : ""
            }}Cosy-Termine</span
          >
        </TableCourses>
        <span class="w-1"
          ><span
            class="flex flex-col w-fit 2xl:mt-20 2xl:mb-10 h-full 2xl:mr-6 md:my-10 bg-slate-100 rounded-lg ml-3"
          >
            <div
              class="flex py-2 px-3 rounded-lg w-fit z-0 hover:bg-sky-100"
              @click="clickCalendar"
            >
              <Icon iconName="calendar"></Icon
              ><Icon iconName="chevronLeft" v-if="this.showCalendar"></Icon>
            </div>

            <span
              v-if="this.showCalendar"
              class="pl-4 pr-3 flex"
              ref="calendar"
            >
              <div class="w-3 h-7 bg-slate-100 -ml-7 mt-10"></div>
              <div class="flex flex-col ml-2">
                <VDatePicker
                  show-weeknumbers="right"
                  title-position="right"
                  class="mx-1 2xl:mr-1 mt-2 w-full"
                  v-model="selectedDate"
                  :attributes="this.attrs"
                />
                <div class="w-fit ml-2 mr-auto text-sm text-slate-500 py-2">
                  <span
                    class="px-1 bg-blue-600 rounded-full h-1 w-3 mx-2"
                  ></span>
                  Anstehende Termine
                </div>
              </div></span
            >
          </span>
        </span>
      </div>

      <!-- <div
      class="m-auto grid grid-cols-2"
      v-if="this.windowWidth > 1400 || this.windowHeight > 1000"
    > -->
      <!-- <div
        class="right flex md:pr-24"
        v-if="this.windowHeight > 820 && false"
        :class="{
          'flex-row': this.windowWidth < 1200,
          'flex-col': this.windowWidth > 1200,
        }"
       >
        
        interaction options showing as cards
        <router-link to="/feedbacklist" class="m-2">
          <Card iconName="presentation"
            ><span class="leading-5">Vergangene Analysen</span></Card
          >
        </router-link>
        <router-link to="/new-session" class="m-2">
          <Card iconName="plus"
            ><span class="leading-5">Neuen Termin erstellen</span></Card
          >
        </router-link>
        <router-link to="/courses" class="m-2">
          <Card iconName="clockRewind"
            ><span class="leading-10">Alle Termine</span></Card
          >
        </router-link>

        <router-link to="/settings" class="m-2">
          <Card iconName="settings"
            ><span class="leading-10">Einstellungen</span></Card
          >
        </router-link>
      </div> -->
    </div>
  </div>
</template>

<script>
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import TableCourses from "../components/tables/TableCourses.vue";
import Icon from "../components/interface-components/Icon.vue";
import InfoArea from "../components/interface-components/InfoArea.vue";
import axios from "axios";
import { mapState, mapGetters } from "vuex";
import { API_URL } from "../config";
import Card from "../components/interface-components/Card.vue";

export default {
  components: {
    ThePageTitle,
    TableCourses,
    Icon,
    InfoArea,
    Card,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,

      attrs: [
        {
          highlight: {
            backgroundColor: "#66b3cc",
            borderColor: "red",
            contentStyle: {
              color: "#fafafa",
              fontSize: "12px",
            },
          },

          dates: [],
        },
      ],
      info: "info_circle",
      infoShow: true,
      sessionLabels: ["Kursname", "Fallanzahl", "Datum"],
      feedbackLabels: ["Name", "Sprecher*innen", "Datum", "", ""],
      sessions: [],
      feedbacks: [],
      headline: "Startseite!",
      showCalendar: false,
    };
  },
  methods: {
    /**
     * Toggles the visibility of the calendar and adds/removes a click event listener
     * to the document based on the visibility of the calendar.
     *
     * @return {void}
     */
    clickCalendar() {
      // Prevent this click from being immediately detected by handleClickOutside
      event.stopPropagation();

      this.showCalendar = !this.showCalendar;

      if (this.showCalendar) {
        document.addEventListener("click", this.handleClickOutside);
      } else {
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    /**
     * Handles click events happening outside of the calendar element to close the calendar.
     *
     * @param {Event} event - The click event object
     * @return {void} No return value
     */
    handleClickOutside(event) {
      if (
        this.$refs.calendar &&
        !this.$refs.calendar.contains(event.target) &&
        this.showCalendar
      ) {
        this.showCalendar = !this.showCalendar;
      }

      window.removeEventListener("click", this.handleClickOutside);
    },

    /**
     * Finds a session in the store based on the provided ID and duplicates it.
     *
     * @param {number} id - The ID of the session to be duplicated.
     * @return {void}
     */
    newCourseDuplicate(id) {
      let newSession = this.getSessions().find((obj) => obj.id === id);
      if (newSession) {
        this.$store.commit("");
      }
    },

    /**
     * Sets the current session ID in the store and navigates to the respective session view .
     *
     * @param {number} id - The ID of the session to open configuration for
     * @return {void}
     */
    openConfig(id) {
      this.$store.commit("setCurrentSessionId", id);
      this.$router.push({ path: "/session-view", tag: "analysis" });
    },

    /**
     * Deletes a session from the server and updates the session data.
     *
     * @param {number} id - The ID of the session to delete.
     * @return {void}
     */
    deleteSession(id) {
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

      setTimeout(() => {
        this.fetchSessionData();
        this.$forceUpdate();
      }, 1000);
    },

    /**
     * Deletes a feedback with the given ID.
     *
     * @param {number} id - The ID of the feedback to delete.
     * @return {Promise} A Promise that resolves when the deletion is complete.
     */
    deleteFeedback(id) {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");

        if (storedToken !== null) {
          token = storedToken;
        }
      }
      axios
        .delete(API_URL + "/analysis/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      setTimeout(() => {
        this.fetchAnalysisData();
        this.$forceUpdate();
      }, 1000);
    },

    /**
     * Fetches session data from the server and updates the component's state.
     *
     * @return {Promise} A promise that resolves with the fetched session data.
     */

    fetchSessionData() {
      var vue = this;
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        token = localStorage.getItem("token");
      }
      axios
        .get(API_URL + "/sessions", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          // console.log(response);
          this.sessions = response.data;
          this.$store.commit("setSessions", response.data);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 401) vue.$router.replace("/login");
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },

    /**
     * Fetches analysis data from the server and updates the component's state.
     *
     * @return {void}
     */
    fetchAnalysisData() {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }

      axios
        .get(API_URL + "/analysis", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.feedbacks = response.data;
          this.$store.commit("setFeedbacks", response.data);
          console.log(response);
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters([
      "getCurrentSession",
      "getSessions",
      "getUsers",
      "getUserData",
      "getLoginState",
    ]),
    /**
     * Checks if the current device is a mobile device.
     *
     * @return {boolean} Returns true if the device is a mobile device, false otherwise.
     */
    mobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  },
  /**
   * Initializes the component when it is mounted. Retrieves the token and user ID from local storage
   * and sets the corresponding state in the store. If a token is found, sets the login state to "authenticated".
   * Fetches the session data and analysis data after a short delay.
   *
   * @return {void}
   */
  mounted() {
    var token = "";
    if (localStorage && localStorage.getItem("token")) {
      const storedToken = localStorage.getItem("token");
      if (storedToken !== null) {
        token = storedToken;
      }
    }
    if (localStorage && localStorage.getItem("userid")) {
      const storedToken = localStorage.getItem("userid");
      if (storedToken !== null) {
        this.$store.commit("setUser", { id: storedToken });
      }
    }

    if (token !== "") this.$store.commit("setLoginState", "authenticated");

    this.$store.commit("setCurrentSession", null);
    this.$store.commit("setCurrentSessionId", null);

    let sessions = this.getSessions;
    for (let i = 0; i < sessions.length; i++) {
      this.attrs[0].dates.push(new Date(sessions[i].date));
    }

    // fetch data
    setTimeout(() => {
      this.fetchSessionData();
      this.fetchAnalysisData();

      this.$forceUpdate();
    }, 30);

    let fetching = window.setInterval(() => {
      this.fetchAnalysisData();
      this.fetchSessionData();
    }, 10000);
  },
};
</script>

<style></style>
