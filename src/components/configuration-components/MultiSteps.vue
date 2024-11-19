<!--Configuration Component: MultiSteps.vue lets user walk through multiple steps -->
<template>
  <!-- Navigation & Status Arrows -->
  <div
    class="w-full flex mx-3 2xl:my-5 xl:my-1 items-center justify-center 2xl:ml-24"
  >
    <span v-if="currentStep != 0" @click="goTo(0)"
      ><MultiStepsArrow icon="cubeOutline">Moduldaten</MultiStepsArrow></span
    >
    <span v-else class="mr-3" @click="goTo(0)"
      ><MultiStepsArrowSelected icon="cubeOutline"
        ><span class="text-white font-semibold"
          >Termindaten</span
        ></MultiStepsArrowSelected
      ></span
    >

    <span v-if="currentStep != 1" @click="goTo(1)"
      ><MultiStepsArrow icon="filePlus">Fälle</MultiStepsArrow></span
    >
    <span v-else class="mr-3" @click="goTo(1)"
      ><MultiStepsArrowSelected icon="filePlus"
        ><span class="text-white font-semibold"
          >Fälle</span
        ></MultiStepsArrowSelected
      ></span
    >

    <!-- <span v-if="currentStep != 2" @click="goTo(2)"
      ><MultiStepsArrow icon="cubeOutline" size="32"
        >Raumakustik</MultiStepsArrow
      ></span
    >
    <span v-else class="mr-3" @click="goTo(2)"
      ><MultiStepsArrowSelected icon="cubeOutline" size="32"
        ><span class="text-white font-semibold"
          >Raumakustik</span
        ></MultiStepsArrowSelected
      ></span
    > -->
    <!-- <span v-if="currentStep != 2" @click="goTo(2)"
      ><MultiStepsArrow class="bg-transparent" icon="check"
        >Überprüfen</MultiStepsArrow
      ></span
    >
    <span v-else class="mr-3" @click="goTo(2)"
      ><MultiStepsArrowSelected icon="check"
        ><span class="text-white font-semibold"
          >Überprüfen</span
        ></MultiStepsArrowSelected
      ></span
    > -->
    <div
      class="flex justify-end items-center mx-2 border-2 p-0.5 rounded-xl border-primary/40"
    >
      <SmallButton
        preset="filled"
        class="border-2 border-ocean-dark px-7 py-3"
        size=""
        @click="saveSession()"
        >Speichern</SmallButton
      >
    </div>
    <div class="md:absolute md:right-5 md:top-32">
      <InfoArea :alignIcon="this.windowHeight > 1200 ? 'left' : 'right'">
        <span v-html="this.steps[this.currentStep].description"></span>
      </InfoArea>
    </div>
  </div>

  <!-- <span class="text-2xl px-4 pb-2 w-full mb-2">
    Bitte machen Sie folgende
    <span class="font-bold">Angaben zu den Sprechern</span> für die
    Gesprächsaufzeichnung.
  </span> -->

  <!-- Form Component -->
  <div class="flex w-full h-full justify-between items-center">
    <!-- Arrow for backwards Navigation -->
    <div class="flex" @click="previous()" v-if="this.currentStep > 0">
      <Icon iconName="chevronLeft" color="rgb(84, 127, 135)" size="70"></Icon>
    </div>
    <div class="w-auto flex items-start self-start h-auto mx-auto mt-4">
      <component
        class="px-4 mx-auto"
        :class="{ 'ml-auto': this.currentStep === 0 }"
        v-bind:is="this.steps[this.currentStep].component"
        v-bind="
          this.steps[this.currentStep].props
            ? this.steps[this.currentStep].props
            : ''
        "
        @data-changed="
          (e) => {
            this.$emit('data-changed', e);
          }
        "
      />
    </div>

    <!-- Arrow for forward Navigation -->
    <div
      class="flex"
      @click="next()"
      v-if="this.currentStep < this.steps.length - 1"
    >
      <Icon iconName="chevronRight" color="rgb(84, 127, 135" size="70"></Icon>
    </div>
  </div>
</template>
<script>
import SmallButton from "../interface-components/SmallButton.vue";
import BaseConfig from "../../components/steps/BaseConfig.vue";
import CaseConfig from "../../components/steps/CaseConfig.vue";
import FeedbackConfig from "../../components/steps/FeedbackConfig.vue";
import SpeakerConfig from "../../components/steps/SpeakerConfig.vue";
import AudioConfig from "../../components/steps/AudioConfig.vue";
import TheComponentHeader from "../../components/interface-components/TheComponentHeader.vue";
import DataUsageConfig from "../../components/steps/DataUsageConfig.vue";
import MultiStepsArrow from "../configuration-components/MultiStepsArrow.vue";
import MultiStepsArrowSelected from "../configuration-components/MultiStepsArrowSelected.vue";
import Icon from "/src/components/interface-components/Icon.vue";
import { mapState, mapGetters } from "vuex";
import axios from "axios";
import InfoArea from "../interface-components/InfoArea.vue";
import { API_URL } from "../../config";

export default {
  components: {
    BaseConfig,
    CaseConfig,
    FeedbackConfig,
    SpeakerConfig,
    AudioConfig,
    DataUsageConfig,
    SmallButton,
    MultiStepsArrow,
    MultiStepsArrowSelected,
    TheComponentHeader,
    Icon,
    InfoArea,
  },

  data() {
    return {
      windowHeight: window.innerHeight,
      existingId: "",
      showSave: false,
      session: {
        name: "",
        id: "",
        date: "",
        room_selected: "",
        // baseConfig: {
        base_application_domain: "",
        base_subject_name: "",
        base_subject_topic: "",
        base_event_topic: "",
        // },
        // roomConfig: {
        room_size: "",
        room_echo: "",
        // },
        // caseConfig: {
        cases: [],
        // },
        speaker1_name: "",
        speaker1_role: "",
        speaker2_name: "",
        speaker2_role: "",

        mikro1_id: "",
        mikro1_name: "",
        mikro1_brand: "",
        mikro2_id: "",
        mikro2_name: "",
        mikro2_brand: "",
      },
      currentStep: 0,
      steps: [
        {
          component: BaseConfig,
          props: {
            showCalendar: true,
          },
          description:
            "Geben Sie die <b>Grunddaten</b> für die Gesprächsaufzeichnung ein",
        },
        {
          component: CaseConfig,
          description:
            "Geben Sie die <b>Falldaten</b> für die Gesprächsaufzeichnung ein",
        },
        // {
        //   component: AudioConfig,
        //   description:
        //     "Für die <b>Audiokonfiguration</b> sind Angaben zur Raumakustik notwendig",
        // },

        // {
        //   component: SpeakerConfig,
        //   description:
        //     "Geben Sie die <b>Sprecherdaten</b> für die Gesprächsaufzeichnung ein:",
        // },
        // {
        //   component: ConfigOverview,
        //   description:
        //     "Hier ist eine <b>Übersicht</b> über die Angaben zur neuen Sitzung",
        // },
      ],
    };
  },
  props: {
    directSave: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * Deletes the session from the API.
     *
     * @returns {Promise} A promise that resolves when the session is deleted.
     */
    async deleteSession() {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${API_URL}/sessions/${this.existingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    /**
     * Prepare the save operation by setting the current session to "new" and
     * updating the session variable with the current session from the store.
     *
     * @return {void}
     */
    prepSave() {
      this.$store.commit("setCurrentSession", "new");
      this.session = this.getCurrentSession;
    },
    /**
     * Increments the current step if a configuration title is provided,
     * otherwise shows an alert.
     *
     * @return {void}
     */
    next() {
      if (!this.hasConfigurationTitle) {
        this.showAlert();
      } else if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.$store.commit("setConfigStep", this.currentStep);
      }
    },

    /**
     * Shows an alert with a message asking the user to provide a configuration title.
     *
     * @return {void}
     */
    showAlert() {
      alert("Bitte einen Titel angeben.");
    },
    /**
     * Decrements the current step and updates the configuration step in the Vuex store.
     *
     * @return {void}
     */
    previous() {
      this.currentStep = Math.max(this.currentStep - 1, 0);
      this.$store.commit("setConfigStep", this.currentStep);
    },
    /**
     * Toggles the showSave property to its opposite value.
     *
     * @return {void}
     */
    toggeShowSave() {
      this.showSave = !this.showSave;
    },
    /**
     * Resets the current session by setting the current session and session ID to null after a delay.
     *
     * @return {void}
     */
    resetCurrentSession() {
      const { $store } = this;
      setTimeout(() => {
        $store.commit("setCurrentSession", null);
        $store.commit("setCurrentSessionId", null);
      }, 100);
    },
    /**
     * Saves the current session by sending a POST or PUT request to the API.
     *
     * @return {Promise<void>} A Promise that resolves when the request is successful.
     */
    saveSession() {
      const session = this.getCurrentSession;
      const sessionData = {
        name: session.name,
        type: "session",
        status: session.status,
        id: session.id,
        date: session.date,
        room_selected: session.room_selected,
        meta: {
          recorded_cases: [],
          user_ids: this.getUsers,
        },
        baseConfig: {
          application_domain: session.baseConfig.application_domain,
          subject_name: session.baseConfig.subject_name,
          subject_topic: session.baseConfig.subject_topic,
          event_topic: session.baseConfig.event_topic,
        },
        roomConfig: {
          room_size: session.roomConfig.room_size,
          room_echo: session.roomConfig.room_echo,
          rooms: session.roomConfig.rooms,
          room_selected: session.roomConfig.room_selected,
        },
        caseConfig: {
          cases: session.caseConfig.cases,
          case_selected: session.caseConfig.case_selected,
        },
        speakerConfig: {
          roles: this.getRoles,
        },
      };

      const token = localStorage.getItem("token") || "";
      const apiUrl = API_URL + "/sessions";
      const headers = { Authorization: `Bearer ${token}` };

      const requestMethod = session.status === "new" ? axios.post : axios.put;
      const requestUrl =
        session.status === "new" ? apiUrl : `${apiUrl}/${session.id}`;

      requestMethod(requestUrl, sessionData, { headers })
        .then(this.postSave)
        .catch(console.log);
    },

    /**
     * Handles post-save actions after receiving a response.
     *
     * @param {{data: {id: string}}} response - The response object from the API call
     * @return {void}
     */
    postSave({ data: { id } }) {
      this.$emit("save");

      this.$router.push(`session/${id}`);
      this.$store.commit("setNewSession", true);
    },

    /**
     * Navigates to a specific step in the configuration process.
     *
     * @param {number} targetStep - The step number to navigate to
     * @return {void}
     */
    goTo(targetStep) {
      if (!this.hasConfigurationTitle) {
        alert("Bitte einen Titel angeben.");
        return;
      }

      this.currentStep = targetStep;
      this.$store.commit("setConfigStep", this.currentStep);
    },
  },
  computed: {
    configStep() {
      return this.getCurrentSession.configStep;
    },
    ...mapState(["currentSession"]),
    ...mapGetters({
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getSpeakers: "getSpeakers",
      getSpeakerRoles: "getSpeakerRoles",
      getRoles: "getRoles",
      getAudioConfig: "getAudioConfig",
      getConfigStep: "getConfigStep",
      getFeedback: "getFeedback",
      getTranscript: "getTranscript",
      getUsers: "getUsers",
      getNewSession: "getNewSession",
      getSessions: "getSessions",
      hasConfigurationTitle: "hasConfigurationTitle",
    }),
  },

  /**
   * Initializes the component by checking if there is a saved session and setting the current step to the saved step.
   *
   * @return {void}
   */
  mounted() {
    this.currentStep = this.configStep ? this.configStep : 0;
    if (this.getCurrentSession) {
      this.existingId = this.getCurrentSession.id;
    } else this.$store.commit("createNewSession");
  },
};
</script>
<style></style>
