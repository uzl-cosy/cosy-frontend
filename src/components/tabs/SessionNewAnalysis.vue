<template>
  <!-- <div class="flex items-start justify-start">
    <div class="flex">
      <SmallButton
        v-if="this.newRecording"
        preset="outlined"
        class="h-fit"
        size=""
        @click="
          newRecording = false;
          showHistory = true;
        "
        ><Icon size="28" iconName="backArrow" color="gray"></Icon
        ><span class="w-full m-1">Zurück</span></SmallButton
      >
    </div>
  </div>-->
  <div
    class="flex 2xl:mx-8 rounded-xl w-auto pl-4 h-full"
    :class="{ 'border-4 border-primary/25': this.newRecording }"
  >
    <SectionTitle v-if="this.newRecording">Neue Aufzeichnung</SectionTitle>

    <div class="border-primary/60 rounded-xl 2xl:mx-6 mt-2 2xl:px-10">
      <RecordStepper class="w-full m-auto scroll-smooth"></RecordStepper>
    </div>

    <InfoArea
      class="right-20 float-right absolute"
      alignIcon="right"
      width=""
      :initial="false"
      @click="this.activeInfo = !this.activeInfo"
      >Sie können hier eine neue Aufnahme konfigurieren.
    </InfoArea>
  </div>
</template>
<script>
import TableCourses from "../tables/TableCourses.vue";
import TableFeedbacks from "../tables/TableFeedbacks.vue";
import axios from "axios";
import { API_URL } from "../../config";
import RecordStepper from "../record-components/RecordStepper.vue";
import BigButton from "../interface-components/BigButton.vue";
import TheBreadcrumb from "../interface-components/TheBreadcrumb.vue";
import SectionTitle from "../interface-components/SectionTitle.vue";
import SmallButton from "../interface-components/SmallButton.vue";
import Icon from "../interface-components/Icon.vue";
import { mapState, mapGetters } from "vuex";
import InfoArea from "../interface-components/InfoArea.vue";

export default {
  components: {
    TableCourses,
    TableFeedbacks,
    RecordStepper,
    BigButton,
    TheBreadcrumb,
    SectionTitle,
    SmallButton,
    Icon,
    InfoArea,
  },
  data() {
    return {
      activeInfo: false,
      feedbackLabels: ["Name", "Sprecher*innen", "Fallbeispiel", "Datum"],
      feedbacks: [],
      showHistory: true,
      newRecording: false,
      breadcrumbs: [],
    };
  },
  methods: {
    newRecord() {
      this.breadcrumbs.push({ name: "Alle Analysen" });
      this.newRecording = true;
      this.showHistory = false;
    },
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
          //console.error("There was an error!", error);
        });
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
          this.$store.commit("setSessions", response.data);
          console.log(response);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },
  },
  mounted() {
    setTimeout(() => {
      this.fetchAnalysisData();
      this.fetchSessionData();
      this.$forceUpdate();
    }, 30);
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters(["getCurrentSession", "getSessions", "getToken"]),
  },
};
</script>
