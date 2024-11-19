<!--VIEW COMPONENT: New Session can be created here-->
<template>
  <div>
    <TheBreadcrumb
      :breadcrumbs="breadcrumbs"
      @navigate="(e) => (e == 'Startseite' ? this.$router.push('/') : '')"
    ></TheBreadcrumb>
    <div class="flex 2xl:mb-3 md:mb-2">
      <ThePageTitle class="w-full">Neuer CoSy-Termin</ThePageTitle>
      <InfoArea class="w-fit inset-y-0 left-0"
        ><p class="w-fit mx-4 text-xl leading-8 px-6">
          Sie können für eine geplante Gesprächssitation
          <b>eine neue Konfiguration erstellen</b>, eine
          <b>Konfiguration aus einem vorherigen Gespräch übernehmen</b> oder
          <b>eine Vorlage wählen</b>. Sie haben nach dem Anwählen die
          Möglichkeit, eine gewählte Vorlage oder Konfiguration zu bearbeiten.
        </p></InfoArea
      >
    </div>

    <div class="flex items-center justify-center my-1">
      <router-link to="new-configuration" class="mx-3 w-fit"
        ><BigButton icon="filePlus" color="white" size="24"
          >Neuen Termin erstellen</BigButton
        ></router-link
      >
    </div>
    <div
      class="flex 2xl:flex-col md:flex-row justify-between 2xl:my-15 md:my-3 mx-3"
    >
      <!-- Existent Sessions to be duplicated-->
      <div class="flex">
        <TableCourses
          class="my-5"
          icon="clockRewind"
          :button="false"
          :data="this.getSessions"
          :labels="sessionLabels"
          limit="8"
          :forDuplicate="true"
          @duplicate=""
          @hover="showSessionData"
          @open-config="newSessionFromDuplicate"
          ><span class="text-xl">Existierende Konfigurationen</span>
          <div class="text-slate-400 text-base">zum Wiederverwenden</div>
        </TableCourses>

        <!-- Existent Session Data -->
        <div
          class="w-6/12 max-w-6/12 bg-sky-100 py-3 px-4 rounded-lg border-2 border-opacity-25 border-primary mx-5"
          v-if="this.sessionData !== ''"
        >
          <div v-if="this.sessionData.baseConfig">
            <div class="flex flex-col items-start 2xl:my-4 w-full ml-10">
              <span class="md:flex items-center 2xl:mb-3 md:mb-1">
                <span class="text-base text-slate-500 font-bold md:mr-2"
                  >Anwendungsfach:</span
                >
                <span class="text-base text-gray-700 w-full">{{
                  this.sessionData.baseConfig.application_domain
                }}</span></span
              >
              <span
                class="md:flex md:justify-start items-center 2xl:mb-3 md:mb-1"
              >
                <span class="text-base text-slate-500 font-bold md:mr-2"
                  >Modulname:</span
                >
                <span class="text-base text-gray-700 w-full">{{
                  this.sessionData.baseConfig.subject_name
                }}</span></span
              >
              <span class="md:flex 2xl:mb-3 md:mb-1 items-center">
                <span class="text-base font-bold text-slate-500 md:mr-2"
                  >Modulthema:</span
                >
                <span
                  v-if="sessionData.baseConfig.subject_topic"
                  class="text-base text-gray-700 w-full"
                  >{{ this.sessionData.baseConfig.subject_topic }}</span
                >
                <span v-else class="text-base text-gray-700 w-full"
                  >-</span
                ></span
              >
              <span class="md:flex 2xl:mb-3 md:mb-1 items-center">
                <span class="text-base text-slate-500 font-bold md:mr-2"
                  >Sitzungsthema:</span
                >
                <span
                  v-if="this.sessionData.baseConfig.event_topic"
                  class="text-base text-gray-700 w-full"
                  >{{ this.sessionData.baseConfig.event_topic }}</span
                >
                <span v-else class="text-lg font-bold text-gray-700 w-full"
                  >-</span
                ></span
              >
            </div>
          </div>

          <TableCases
            class="min-w-6/12 mx-2"
            icon="clockRewind"
            :button="false"
            :data="this.sessionData.caseConfig.cases"
            :delete="false"
            :onlyNames="true"
            >Fallbeispiele</TableCases
          >
        </div>
      </div>
      <!-- <TableCourses
        class="2xl:w-full md:w-1/2 2xl:my-5 md:my-11"
        icon="preset"
        :button="false"
        :data="[]"
        :labels="sessionLabels"
        limit="8"
        @open-config="openConfig"
        >Gespeicherte Vorlagen
      </TableCourses> -->
    </div>
  </div>
</template>

<script>
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import BigButton from "../components/interface-components/BigButton.vue";
import TableCourses from "../components/tables/TableCourses.vue";
import TheBreadcrumb from "../components/interface-components/TheBreadcrumb.vue";
import axios from "axios";
import { mapState, mapGetters } from "vuex";
import InfoArea from "../components/interface-components/InfoArea.vue";
import { API_URL } from "../config";
import TableCases from "../components/tables/TableCases.vue";
import { uuid } from "vue-uuid";
export default {
  components: {
    ThePageTitle,
    BigButton,
    TableCourses,
    TheBreadcrumb,
    InfoArea,
    TableCases,
  },
  data() {
    return {
      sessionLabels: ["Kursname", " ", "Datum"],
      sessions: [],
      breadcrumbs: [{ id: "1", name: "Startseite" }],
      sessionData: "",
    };
  },
  methods: {
    newSessionFromDuplicate(id) {
      let session = this.getSessions.find((obj) => obj.id === id);
      if (session) {
        // let newSession = JSON.parse(JSON.stringify(session));
        // newSession.id = uuid.v1();
        // newSession.status = "new";
        // newSession.date = new Date();
        // this.$store.commit("setNewSession", newSession);
        session.id = uuid.v1();
        session.status = "new";
        session.date = new Date();
        this.$store.commit("setNewSession", session);
        this.$store.commit("setCurrentSessionId", session.id);

        // this.$store.commit("setBaseConfig", [
        //   0,
        //   session.baseConfig.application_domain,
        // ]);
        // this.$store.commit("setBaseConfig", [
        //   1,
        //   session.baseConfig.event_topic,
        // ]);
        // console.log(session.baseConfig.application_domain);
      }
      this.$router.push("new-configuration");
    },
    showSessionData(id) {
      if (id == "") {
        this.sessionData = "";
      } else {
        let session = this.getSessions.find((obj) => obj.id === id);
        if (session) {
          this.sessionData = session;
        }
      }
    },
    openConfig(id) {
      // console.log(id);
      this.$store.commit("setCurrentSessionId", id);
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
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },

    // filterData(data) {
    //   let data = data.filter(
    //     (elem) => elem.meta.user_ids[0].id == this.getUsers[0].id
    //   );
    //   return data;
    // },
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getSpeakers: "getSpeakers",
      getSpeakerRoles: "getSpeakerRoles",
      getAudioConfig: "getAudioConfig",
      getUsers: "getUsers",
      getSessions: "getSessions",
    }),
  },
  created() {
    this.fetchSessionData();
  },
  mounted() {
    this.$store.commit("setCurrentSession", null);
    this.$store.commit("setCurrentSessionId", null);
  },
};
</script>
