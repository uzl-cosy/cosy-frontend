<!--Tab ContentComponent: Session Analysis contains the table of the analysis objects of the session-->
<template>
  <div class="flex items-start justify-start">
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
  </div>
  <div
    class="flex 2xl:mx-8 rounded-xl w-auto 2xl:pl-4 pt-3 pb-20"
    :class="{ 'border-4 border-primary/25': this.newRecording }"
  >
    <SectionTitle v-if="this.newRecording">Neue Aufzeichnung</SectionTitle>

    <div
      class="border-primary/60 rounded-xl mx-6 mt-2 px-10"
      v-if="this.newRecording"
    >
      <RecordStepper
        @resetFlags="this.$emit('resetFlags')"
        class="w-full m-auto"
      ></RecordStepper>
    </div>
    <div class="flex flex-col items-center">
      <div class="flex flex-col items-center">
        <TableFeedbacks
          v-if="showHistory"
          class="w-fit"
          icon="clockRewind"
          :data="
            feedbacks.filter(
              (obj) => obj.meta.session_id === this.getCurrentSessionId
            )
          "
          :button="true"
          :limit="5"
          :labels="feedbackLabels"
          :showLinks="false"
          filter="id"
          @delete-feedback="(e) => this.deleteFeedback(e)"
          >Abgeschlossene Analysen
        </TableFeedbacks>
        <div class="flex flex-col w-1/2 items-center">
          <div class="flex mt-12 justify-center">
            <SmallButton
              size="48"
              preset="outlined"
              @click="this.$emit('change-tab', 2)"
            >
              <Icon
                class="mx-2 w-fit"
                iconName="microphone"
                color="#00617a"
                size="24"
              ></Icon>
              <span class="text-2xl w-fit">Neue Aufnahme</span></SmallButton
            >
            <div
              class="m-1 py-1 rounded-full hover:bg-sky-200"
              @click="this.activeInfo = !this.activeInfo"
            >
              <Icon class="mx-2 w-fit" iconName="info_circle" size="24"></Icon>
            </div>
          </div>
          <InfoArea
            class="w-fit my-2"
            v-if="this.activeInfo"
            alignIcon="left"
            width=""
            :initial="true"
            @click="this.activeInfo = !this.activeInfo"
            >Sie können hier eine neue Aufnahme konfigurieren.
          </InfoArea>
        </div>
      </div>
    </div>
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
    /**
     * Deletes feedback with the specified ID.
     *
     * @param {number} id - The ID of the feedback to delete.
     * @return {void} This function does not return a value.
     */
    deleteFeedback(id) {
      let token = "";
      if (localStorage?.getItem("token")) {
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
     * Updates the breadcrumbs, sets newRecording to true, and sets showHistory to false.
     *
     * @return {void} This function does not return a value.
     */
    newRecord() {
      this.breadcrumbs.push({ name: "Alle Analysen" });
      this.newRecording = true;
      this.showHistory = false;
    },
    /**
     * Fetches analysis data from the server and updates the component's state.
     *
     * @param {void} This function does not take any parameters.
     * @return {void} This function does not return a value.
     */
    fetchAnalysisData() {
      let token = "";
      if (localStorage?.getItem("token")) {
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
  },
  mounted() {
    setTimeout(() => {
      this.fetchAnalysisData();

      this.$forceUpdate();
    }, 30);
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters([
      "getCurrentSession",
      "getSessions",
      "getToken",
      "getCurrentSessionId",
    ]),
  },
};
</script>
