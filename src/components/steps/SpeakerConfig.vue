<!--(UNUSED) Configuration Component: Speaker configuration that lets the user choose the speaker and according data usage and feedback configurations-->
<template>
  <div class="w-full flex flex-row justify-start mb-3 rounded-xl ml-64">
    <!--Form for first speaker-->
    <SpeakerForm
      :speakerID="this.speakers[0].id"
      :speakerName="this.getSpeakers[0].name"
      :mikroColor="this.speakers[0].microColor"
      :mikroNumber="
        this.getAudioConfig ? this.getAudioConfig.micro1_name[3] : ''
      "
      :selectedRole="this.getSpeakerRoles ? this.getSpeakerRoles[0] : ''"
      :roles="this.getRoles"
      ><span class="w-max truncate flex items-center"
        ><div
          class="bg-sky-200 text-2xl rounded-full w-fit p-2 px-3 mr-3 leading-6"
        >
          1.
        </div>
      </span></SpeakerForm
    >
    <!--Form for second speaker-->

    <SpeakerForm
      :speakerID="this.speakers[1].id"
      :speakerName="this.getSpeakers[1].name"
      :mikroColor="this.speakers[1].microColor"
      :mikroNumber="
        this.getAudioConfig ? this.getAudioConfig.micro2_name[3] : ''
      "
      :selectedRole="this.getSpeakerRoles ? this.getSpeakerRoles[1] : ''"
      :roles="this.getRoles"
      ><span class="w-max truncate flex items-center"
        ><div
          class="bg-pink-200 text-2xl rounded-full w-fit p-2 px-3 mr-3 leading-7"
        >
          2.
        </div>
        Sprecher</span
      ></SpeakerForm
    >
  </div>
  <div class="flex items-start">
    <div class="flex flex-col items-start my-3 ml-4">
      <div class="flex">
        <SmallButton
          :highlight="showFeedback"
          class="my-1"
          @click="
            this.showFeedback = !this.showFeedback;
            this.showData = false;
          "
          preset="outlined"
          size=""
          >Analyseparameter</SmallButton
        >
        <svg
          v-if="showFeedback"
          viewBox="0 0 50 10"
          xmlns="http://www.w3.org/2000/svg"
          class="w-12"
        >
          <line
            x1="5"
            y1="5"
            x2="50"
            y2="5"
            stroke="rgb(224 242 254)"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <div class="flex">
        <SmallButton
          :highlight="showData"
          class="mx-1"
          @click="
            this.showFeedback = false;
            this.showData = !this.showData;
          "
          preset="outlined"
          size=""
          >Datenschutz</SmallButton
        >
        <svg
          v-if="showData"
          viewBox="0 0 50 10"
          xmlns="http://www.w3.org/2000/svg"
          class="w-20"
        >
          <line
            x1="0"
            y1="5"
            x2="50"
            y2="5"
            stroke="rgb(224 242 254)"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>

    <FeedbackConfig v-if="showFeedback"></FeedbackConfig>
    <DataUsageConfig v-if="showData"></DataUsageConfig>
  </div>
</template>
<script>
import Icon from "../../components/interface-components/Icon.vue";
import SpeakerForm from "../../components/configuration-components/SpeakerForm.vue";
import { mapState, mapGetters } from "vuex";
import FeedbackConfig from "./FeedbackConfig.vue";
import SmallButton from "../interface-components/SmallButton.vue";
import DataUsageConfig from "./DataUsageConfig.vue";

export default {
  name: "SpeakerConfig",
  components: {
    Icon,
    SpeakerForm,
    FeedbackConfig,
    SmallButton,
    DataUsageConfig,
  },
  data() {
    return {
      showFeedback: true,
      showData: false,

      existing: false,
      speakers: [
        {
          id: "id1",
          microNumber: "2",
          microColor: "blue",
          role: "",
          name: "",
        },
        {
          id: "id2",
          microNumber: "1",
          microColor: "red",
          role: "",
          name: "",
        },
      ],
    };
  },
  methods: {
    /**
     * Updates the form with the given target value and emits a "data-changed" event.
     *
     * @param {Object} target - The target object containing the id and value properties.
     * @return {void}
     */
    updateForm(target) {
      this.$store.commit("setSpeakerName", {
        id: this.speakers[target.id].id,
        value: target.value,
      });
      this.$emit("data-changed");
    },
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getCurrentSession: "getCurrentSession",
      getSpeakers: "getSpeakers",
      getAudioConfig: "getAudioConfig",
      getSpeakerRoles: "getSpeakerRoles",
      getRoles: "getRoles",
    }),
  },
  mounted() {
    if (this.getSpeakers) {
      this.speakers[0].name = this.getSpeakers[0].name;
      this.speakers[1].name = this.getSpeakers[1].name;
      this.speakers[0].role = this.getSpeakerRoles
        ? this.getSpeakerRoles[0]
        : "";
      this.speakers[1].role = this.getSpeakerRoles
        ? this.getSpeakerRoles[1]
        : "";
    }
    if (this.getAudioConfig == null) {
      return;
    }
    this.speakers[0].microNumber = this.getAudioConfig.micro1_name;
    this.speakers[0].microColor = this.getAudioConfig.micro1_color;
    this.speakers[1].microNumber = this.getAudioConfig.micro2_name;
    this.speakers[1].microColor = this.getAudioConfig.micro2_color;
  },
};
</script>
