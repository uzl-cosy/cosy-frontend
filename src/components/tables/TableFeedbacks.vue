<!--Table Component: Lists all available feedbacks-->
<template>
  <div class="2xl:px-4">
    <div
      class="flex item relative overflow-x-auto p-1"
      style="align-items: center"
    >
      <Icon class="mr-2" :iconName="icon" color="#213547" />
      <div class="font-light 2xl:text-2xl md:text-lg text-blue-dark">
        <slot />
      </div>
    </div>
    <div class="item overflow-x-auto table my-0">
      <table
        class="w-fit 2xl:text-lg md:text-sm text-left text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400 w-full"
        >
          <tr>
            <th class="px-6 py-3 col-4 md:text-xs 2xl:text-base w-4/12">
              Titel des Termins
            </th>
            <th class="px-6 py-3 col-4 md:text-xs 2xl:text-base w-3/12">
              Sprecher:innen
            </th>
            <th class="px-6 py-3 col-4 md:text-xs 2xl:text-base w-2/12">
              Fall
            </th>
            <th
              @click="
                this.sortBy == 'dateUp'
                  ? (this.sortBy = 'dateDown')
                  : (this.sortBy = 'dateUp')
              "
              class="px-6 py-3 col-4 md:text-xs 2xl:text-base w-3/12"
            >
              <span class="flex items-center cursor-pointer"
                >Datum / Uhrzeit
                <Icon
                  v-if="this.sortBy == 'dateDown'"
                  class="mx-1"
                  iconName="chevronDown"
                ></Icon>
                <Icon
                  v-else-if="this.sortBy == 'dateUp'"
                  class="mx-1"
                  iconName="chevronUp"
                ></Icon
              ></span>
            </th>
          </tr>
        </thead>
        <tbody class="overflow-y-hidden" v-if="this.sortedData.length == 0">
          <tr class="bg-blue-100 w-full col-4 px-12 py-6">
            <td class="w-full px-12 col-4 py-8" colspan="4">
              Es gibt keine aktuellen Einträge
            </td>
          </tr>
          <tr class="rounded-b-lg">
            <td>
              <div class="py-2"></div>
            </td>
          </tr>
        </tbody>

        <tbody
          v-else
          class="cursor-pointer overflow-auto"
          :class="{ 'h-56': limit < 6 }"
        >
          <tr
            v-for="(item, index) in sortedData"
            :key="item.id"
            class="even:bg-blue-100 odd:bg-blue-200 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-sky-700 hover:text-white w-full flex items-center"
            :class="{
              'opacity-50 ': !item.dataCheck ? !item.dataCheck : false,
            }"
          >
            <td
              scope="row"
              class="px-6 2xl:py-4 md:py-1 font-medium whitespace-nowrap w-4/12"
              @click="!item.dataCheck ? !item.dataCheck : open(item)"
            >
              <div class="flex flex-col truncate">
                {{
                  item.meta.session_id
                    ? this.getSessionName(item.meta.session_id)
                    : "-"
                }}
                {{ !item.dataCheck ? "(leere Analyse)" : "" }}
                <!-- 
                {{
                  (new Date() - new Date(item.meta.edit_date)) /
                    (1000 * 60 * 60) >
                  24
                    ? "(Kein Zugang mehr)"
                    : ""
                }} -->
              </div>
            </td>
            <td
              class="px-6 2xl:py-4 w-3/12"
              :class="{
                'opacity-50': this.checkDate(item.meta.edit_date),
              }"
              @click="!item.dataCheck ? !item.dataCheck : open(item)"
            >
              {{
                item.meta.speakers
                  ? item.meta.speakers[0]
                    ? item.meta.speakers[0].role
                    : ""
                  : ""
              }}
              &
              {{
                item.meta.speakers
                  ? item.meta.speakers[1]
                    ? item.meta.speakers[1].role
                    : ""
                  : ""
              }}
            </td>
            <td
              class="px-6 2xl:py-4 w-2/12"
              :class="{
                'opacity-50': this.checkDate(item.meta.edit_date),
              }"
              @click="!item.dataCheck ? !item.dataCheck : open(item)"
            >
              {{ this.getCaseName(item) ? this.getCaseName(item) : " " }}
            </td>

            <!-- DATE -->
            <td
              class="px-6 2xl:py-4 overflow-hidden whitespace-nowrap flex items-center h-full"
              :class="{
                'opacity-50': this.checkDate(item.meta.edit_date),
              }"
              @click="!item.dataCheck ? !item.dataCheck : open(item)"
            >
              {{ formatDate(item.meta.edit_date) }}
              <Icon iconName="clock" size="12" class="ml-1 mr-0.5"></Icon>
              <span class="font-bold">
                {{ formatTime(item.meta.edit_date) }}</span
              >
            </td>

            <td
              class="w-fit 2xl:py-4 md:w-32"
              v-if="
                showLinks &&
                (new Date() - new Date(item.meta.edit_date)) /
                  (1000 * 60 * 60) >
                  24
              "
            >
              <div class="flex justify-center rounded-lg mx-5">
                <SmallButton
                  @click="openCourse(item.meta.session_id)"
                  class="py-2 2xl:px-4 md:px-2 text-base whitespace-nowrap"
                  size=""
                >
                  zum Modul
                </SmallButton>
              </div>
            </td>
            <td
              class="flex items-center w-fit mr-0 ml-auto"
              v-if="
                true ||
                (new Date() - new Date(item.meta.edit_date)) /
                  (1000 * 60 * 60) <
                  24
              "
            >
              <div
                v-if="!this.deleteRequest"
                @click="
                  this.deleteRequest = true;
                  this.selected = index;
                "
                class="border-4 p-1 border-transparent rounded-lg m-1 hover:border-red-500"
                :class="{
                  'border-red-500':
                    this.deleteRequest && this.selected == index,
                }"
              >
                <Icon
                  v-if="deleteRequest && this.selected == index"
                  iconName="delete"
                  size="24"
                  color="red"
                ></Icon>
                <Icon v-else iconName="delete" size="24" color="gray"></Icon>
              </div>
              <div
                class="flex mr-6"
                v-if="this.deleteRequest & (index == this.selected)"
              >
                <div class="flex justify-center mx-auto m-2 left">
                  <div
                    class="self-center cursor-pointer font-bold border-slate-300 hover:ml-0 hover:border-white border-2 hover:border-4 hover:font-extrabold rounded-lg px-2 mx-1 py-1"
                    @click="
                      this.$emit('delete-feedback', item.id);
                      this.deleteRequest = false;
                    "
                  >
                    Löschen
                  </div>
                  <div
                    class="self-center cursor-pointer font-bold border-slate-300 hover:mr-0 hover:border-white border-2 hover:border-4 hover:font-extrabold rounded-lg px-2 mx-1 py-1"
                    @click="this.deleteRequest = false"
                  >
                    Abbrechen
                  </div>
                </div>
              </div>
            </td>
            <td class="flex items-center w-fit mr-0 ml-auto" v-else></td>
          </tr>
          <tr class="rounded-b-lg">
            <td>
              <div class="py-2"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Icon from "../interface-components/Icon.vue";
import SmallButton from "../interface-components/SmallButton.vue";
import { mapGetters } from "vuex";
import { API_URL } from "../../config";
import axios from "axios";
export default {
  data() {
    return {
      sessions: [],
      currentSession: null,
      noAccessItem: "",
      loading: true,
      deleteRequest: false,
      selected: "",
      feedbacks: [],
      sortBy: "dateDown",
    };
  },
  components: {
    Icon,
    SmallButton,
  },
  props: {
    color: String,
    icon: String,
    button: { type: Boolean, default: true },
    data: {
      type: Array,
      default: () => [],
    },
    showLink: { type: Boolean, default: true },
    labels: Array,
    limit: { type: Number, default: 10 },
    filter: { type: String, default: "" },
  },
  methods: {
    formatDate(editDate) {
      const formattedDate = new Date(editDate).toLocaleString("de-DE", {
        timeZone: "Europe/Berlin",
      });

      // Check if the month is a single or double-digit
      return formattedDate.length > 17
        ? formattedDate.length > 18
          ? formattedDate.slice(0, 9) // For one-digit months and days
          : formattedDate.slice(0, 8) // For one-digit months or days
        : formattedDate.slice(0, 7); // For two-digit months and days
    },
    formatTime(editDate) {
      const formattedDate = new Date(editDate).toLocaleString("de-DE", {
        timeZone: "Europe/Berlin",
      });
      // Slice based on the length of the formatted date string
      return formattedDate.length > 17
        ? formattedDate.length > 18
          ? formattedDate.slice(11, 16) // For one-digit months and days
          : formattedDate.slice(10, 15) // For one-digit months or days
        : formattedDate.slice(9, 14); // For two-digit months and days
    },

    /**
     * Check if the given date is older than 24 hours.
     *
     * @param {string} date - The date to check in ISO string format.
     * @return {boolean} True if the date is older than 24 hours, false otherwise.
     */
    checkDate(date) {
      const today = new Date();

      const timeDiff = (today - new Date(date)) / (1000 * 60 * 60);
      return timeDiff > 24;
    },
    /**
     * A description of the entire function.
     *
     * @return {void} No return value
     */
    forceUpdate() {
      this.$forceUpdate;
    },
    /**
     * A description of the entire function.
     *
     * @param {type} item - description of parameter
     * @return {type} description of return value
     */
    open(item) {
      if (this.deleteRequest) {
        return;
      }
      this.$store.commit("setCurrentFeedback", item.id);

      const feedbackMeta = this.getCurrentFeedback;
      this.fetchAnalysisData(feedbackMeta.measuresId);
      this.fetchTranscript(feedbackMeta.transcript.transcriptId);

      if (!this.getCurrentSession)
        this.$store.commit("setCurrentSessionId", feedbackMeta.meta.session_id);

      this.$router.push({ path: "/feedback/" + item.id });
    },
    /**
     * Opens a course by setting the current session ID in the store and navigating to the session view.
     *
     * @param {number} id - The ID of the course to open.
     * @return {void}
     */
    openCourse(id) {
      // open row? open modal? open site?

      this.$store.commit("setCurrentSessionId", id);

      this.$router.push({ path: "/session-view" });
    },
    /**
     * Retrieves the name of a session based on its ID.
     *
     * @param {number} id - The ID of the session.
     * @return {string} The name of the session, or "Keinen Titel angegeben" if the session or its base configuration is not found.
     */
    getSessionName(id) {
      let session;
      // if (this.getCurrentSession) {
      //   session = this.getCurrentSession;
      // } else {
      const sessions = this.getSessions;

      session = sessions.find((session) => session.id === id);
      // }
      return session && session.baseConfig && session.baseConfig.subject_topic
        ? session.baseConfig.subject_topic
        : "Keinen Titel angegeben";
    },
    /**
     * Retrieves the name of a case based on the provided item.
     *
     * @param {Object} item - The item containing the meta information of the case.
     * @return {string} The name of the specific case, or "Keinen Fallnamen angegeben" if the case is not found.
     */
    getCaseName(item) {
      let session;

      if (this.getCurrentSession) {
        session = this.getCurrentSession;

        if (session?.caseConfig && session.caseConfig.cases) {
          const specificCase = session.caseConfig.cases.find(
            (aCase) => aCase.case_id === item.meta.case_id
          );
          return specificCase
            ? specificCase.case_name
            : "Keinen Fallnamen angegeben";
        } else return "Keinen Fallnamen angegeben";
      } else {
        const sessions = this.getSessions;

        session = sessions.find((session) => {
          return session.id === item.meta.session_id;
        });
      }

      if (session?.caseConfig?.cases) {
        const specificCase = session.caseConfig.cases.find(
          (aCase) => aCase.case_id === item.meta.case_id
        );
        return specificCase
          ? specificCase.case_name
          : "Keinen Fallnamen angegeben";
      } else return "Keinen Fallnamen angegeben";
    },
    /**
     * Fetches analysis data based on the provided ID.
     *
     * @param {number} id - The ID of the data to fetch.
     * @return {void} No direct return value, updates the current data in the store.
     */
    fetchAnalysisData(id) {
      let token = "";
      if (localStorage?.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }

      axios
        .get(API_URL + "/analysis/data/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.$store.commit("setCurrentData", response.data._doc);
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    /**
     * Fetches the transcript with the given ID from the server.
     *
     * @param {number} id - The ID of the transcript to fetch.
     * @return {Promise} A Promise that resolves with the fetched transcript data.
     */
    fetchTranscript(id) {
      let token = "";
      if (localStorage?.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }

      axios
        .get(API_URL + "/analysis/transcript/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.$store.commit("setTranscript", response.data._doc);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },
    /**
     * Fetches session data from the server and updates the store with the retrieved data.
     *
     * @return {Promise<void>} A promise that resolves when the session data is successfully fetched and stored in the store.
     * @throws {Error} If there is an error while fetching the session data.
     */
    fetchSessionData() {
      const token = localStorage?.getItem("token");

      axios
        .get(API_URL + "/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => {
          this.$store.commit("setSessions", data);
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    },
    /**
     * Fetches data check for a specific ID using axios.
     *
     * @param {number} id - The ID of the data to check.
     * @return {any} The fetched data check.
     */
    checkData(id) {
      let token = "";
      if (localStorage?.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }

      axios
        .get(API_URL + "/analysis/dataCheck/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data.check);
          return response.data.check;
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },
  },
  created() {
    this.fetchSessionData();
  },

  computed: {
    getCurrentSession() {
      return this.currentSession;
    },
    getSessions() {
      return this.sessions;
    },
    /**
     * Performs sorting and filtering of data based on different criteria.
     *
     * @param {void} None
     * @return {Array} The sorted and filtered data based on the specified criteria.
     */
    sortedData() {
      let data = this.data;
      if (this.sortBy == "dateDown") {
        data = this.data
          .slice()
          .sort(
            (a, b) => new Date(b.meta.edit_date) - new Date(a.meta.edit_date)
          );
      } else if (this.sortBy == "dateUp") {
        data = this.data
          .slice()
          .sort(
            (a, b) => new Date(a.meta.edit_date) - new Date(b.meta.edit_date)
          );
      } else if (this.sortBy == "nameDown") {
        data = this.data
          .slice()
          .sort((a, b) =>
            a.baseConfig.subject_topic.localeCompare(b.baseConfig.subject_topic)
          );
      } else if (this.sortBy == "nameUp") {
        data = this.data
          .slice()
          .sort((a, b) =>
            b.baseConfig.subject_topic.localeCompare(a.baseConfig.subject_topic)
          );
      }
      if (this.hideOld) {
        const currentDate = new Date();
        data = data.filter((item) => new Date(item.date) >= currentDate);
      }
      const myData = data.filter((item) => {
        return (
          (new Date() - new Date(item.meta.edit_date)) / (1000 * 60 * 60) < 24
        );
      });
      if (localStorage.getItem("username") == '"cosy"') return data;

      return myData;
    },
    /**
     * Filters the data based on the specified filter criteria. (UNUSED)
     *
     * @return {Array} The filtered data.
     */
    filteredData() {
      if (this.filter == "id") {
        return this.data.filter(
          (obj) => obj.meta.session_id === this.getCurrentSession.id
        );
      }
      const myData = this.data.filter((item) => {
        return (
          (new Date() - new Date(item.meta.edit_date)) / (1000 * 60 * 60) < 24
        );
      });
      if (localStorage.getItem("username") == '"cosy"') return this.data;

      return myData;
    },
    ...mapGetters({
      getSpeakers: "getSpeakers",
      getSpekaerRoles: "getSpeakerRoles",
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getSessions: "getSessions",
      getCurrentFeedback: "getCurrentFeedback",
      getCaseConfig: "getCaseConfig",
      getPrevSession: "getPrevSession",
    }),
  },
};
</script>
