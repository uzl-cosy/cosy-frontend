<!--VIEW COMPONENT: List of all feedbacks (analysis) objects -->
<template>
  <TheBreadcrumb
    :breadcrumbs="breadcrumbs"
    @navigate="(e) => (e == 'Startseite' ? this.$router.push('/') : '')"
  ></TheBreadcrumb>
  <div class="flex">
    <ThePageTitle class="w-full">Abgeschlossene Analysen</ThePageTitle>
    <InfoArea
      ><p class="w-fit mx-4 text-xl leading-8 px-6">
        Hier befinden sich <b>vergangene Analysen</b> abgeschlossener
        Aufzeichnungen
      </p></InfoArea
    >
  </div>
  <div class="flex flex-col justify-between px-0">
    <!-- <router-link to="/new-session" class="w-full" > -->
    <TableFeedbacks
      ref="sessions"
      class="w-full"
      icon="clockRewind"
      :button="false"
      :data="feedbacks"
      :labels="sessionLabels"
      limit="10"
      @delete-feedback="deleteFeedback"
      @open-anaylsis="openAnalysis"
      >Aktuelle Sitzungen
    </TableFeedbacks>
    <!-- </router-link
      > -->
    <!-- <router-link to="/feedback" class="w-full mt-8"
      ><TableFeedbacks
        class="w-full"
        icon="clockRewind"
        :data="feedbacks"
        :button="true"
        :labels="sessionLabels"
        limit="5"
        >Archivierte Cosy-Termine
      </TableFeedbacks></router-link
    > -->
  </div>
  <!-- <h2 class="text-2xl font-bold font-italic text-ocean-dark">Willkommen bei CoSy!</h2> -->
</template>

<script>
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import TableFeedbacks from "../components/tables/TableFeedbacks.vue";
import InfoArea from "../components/interface-components/InfoArea.vue";
import axios from "axios";
import { mapState, mapGetters } from "vuex";
import TheBreadcrumb from "../components/interface-components/TheBreadcrumb.vue";
import { API_URL } from "../config";

export default {
  components: {
    ThePageTitle,
    TableFeedbacks,
    TheBreadcrumb,
    InfoArea,
  },
  data() {
    return {
      data: "hello",
      sessionLabels: ["Modulname", "Fallname", "Datum"],
      feedbacks: [],
      breadcrumbs: [
        { id: "1", name: "Startseite" },
        { id: "2", name: "Analysen" },
      ],
    };
  },
  methods: {
    /**
     * Opens the analysis for a given ID.
     *
     * @param {number} id - The ID of the analysis to open.
     * @return {void} This function does not return a value.
     */
    openAnalysis(id) {
      this.$store.commit("setCurrentFeedback", id);
      // this.fetchTranscript();

      // this.$store.commit("setCurrentSession", id);
    },
    ...mapState(["currentSession"]),
    ...mapGetters({
      getCurrentSession: "getCurrentSession",
      getAllSessions: "getAllSessions",
      getCurrentFeedback: "getCurrentFeedback",
    }),

    /**
     * Deletes a feedback with the given ID.
     *
     * @param {number} id - The ID of the feedback to delete.
     * @return {void} This function does not return a value.
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
        .then(() => {
          // Logic to delete local state
          const projectIndex = this.feedbacks.findIndex((p) => p.id === id);
          this.feedbacks.splice(projectIndex, 1);
        })
        .catch(function (error) {
          console.log(error);
        });

      this.fetchAnalysisData();
      // this.$refs.sessions.forceUpdate();
      // this.$refs.sessions;
    },
    /**
     * Fetches analysis data from the server and updates the component's state.
     *
     * @param {void} This function does not take any parameters.
     * @return {void} This function does not return a value.
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
          // console.log(response.data);
          this.feedbacks = response.data;
          this.$store.commit("setAnalysisObjects", response.data);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },
  },
  /**
   * Fetches the transcript from the server based on the current feedback's transcriptId.
   *
   * @return {Promise} A Promise that resolves with the transcript data.
   */
  fetchTranscript() {
    let feedback = this.getCurrentFeedback;

    let transcriptId = null;
    if (feedback && feedback.meta && feedback.meta.transcriptId) {
      transcriptId = feedback.meta.transcriptId;
    }
    console.log(transcriptId);
    var token = "";
    if (localStorage && localStorage.getItem("token")) {
      const storedToken = localStorage.getItem("token");
      if (storedToken !== null) {
        token = storedToken;
      }
    }

    axios
      .get(API_URL + "/analysis/" + transcriptId + "/transcript", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        console.log(response);
        this.$store.commit("setTranscript", response.data);
      })
      .catch((error) => {
        this.errorMessage = error.message;
        //console.error("There was an error!", error);
      });
  },
  // watch: {
  //   $route() {
  //     this.$nextTick(this.fetchSessionData);
  //   },
  // },
  // watch: {
  //   $route(to, from) {
  //     // Get $el that is our starting point
  //     let start_el = this.$refs.routerview.$el;
  //     this.$nextTick(async function () {
  //       await this.wait_component_change(start_el);
  //       this.fetchSessionData();
  //     });
  //   },
  // },
  mounted() {
    // this.$router.onReady(() => this.fetchSessionData());
    setTimeout(() => {
      this.fetchAnalysisData();
      this.$forceUpdate();
    }, 10);
  },
};
</script>
