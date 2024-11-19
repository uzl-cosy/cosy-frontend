<!--Configuration Component: Feedback configuration that lets User choose which feedback should be shown (unused)-->
<template>
  <div class="w-fit h-fit flex my-auto items-center pr-4 pb-3">
    <TableCheckboxes
      @update="
        (e) =>
          this.$store.commit('setFeedbackConfig', {
            checked: e.checked,
            index: e.index,
            speaker: e.speaker,
          })
      "
      :data="parameters"
      :labels="[
        this.getCurrentRecord.speaker1.role,
        this.getCurrentRecord.speaker2.role,
      ]"
    ></TableCheckboxes>
    <br />
  </div>
</template>
<script>
import InputField from "../form-components/InputField.vue";
import TableCheckboxes from "../form-components/TableCheckboxes.vue";
import { mapState, mapGetters } from "vuex";

export default {
  name: "FeedbackConfig",
  components: {
    InputField,
    TableCheckboxes,
  },
  data() {
    return {
      anmerkungen: "Anmerkungen hinzufügen",
      content: "Hier ist dein Text",
      speaker1: "Sprecher 1",
      speaker2: "Sprecher 2",
      parameters: [
        {
          id: "1",
          title: "Sprechtempo",
          description: "Die Anzahl an Wörtern pro Minute",
          checked1: true,
          checked2: true,
        },
        {
          id: "2",
          title: "Pausen",
          description:
            "Die Zeitdauer von Phasen, in denen nicht gesprochen wird",
          checked1: true,
          checked2: true,
        },
        {
          id: "3",
          title: "Stimmlage",
          description:
            "Die Frequenzmodulation (Stimmlage) der Sprecher über die Zeit in Hz",
          checked1: true,
          checked2: true,
        },
        {
          id: "4",
          title: "Sprechlautstärke",
          description: "Die Lautstärke der Stimmen über die Zeit",
          checked1: true,
          checked2: true,
        },
        {
          id: "5",
          title: "Redeanteile",
          description:
            "Die zeitlichen Gesprächsanteile der Sprecher insgesamt und im Laufe der Konversation.",
          checked1: true,
          checked2: true,
        },
        // {
        //   id: "6",
        //   title: "Füllwörter",
        //   description: "Hier kommt eine Beschreibung des Parameters",
        //   checked1: false,
        //   checked2: true,
        // },
      ],
    };
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters(["getSpeakers", "getCurrentSession", "getCurrentRecord"]),
    speakers() {
      this.speaker1 =
        this.getSpeakers && this.getSpeakers[0].role !== ""
          ? this.getSpeakers[0].role
          : "Sprecher 1";
      this.speaker2 =
        this.getSpeakers && this.getSpeakers[1].role !== ""
          ? this.getSpeakers[1].role
          : "Sprecher 2";
      return [this.speaker1, this.speaker2];
    },
  },
  methods: {
    /**
     * A function that returns an array of roles based on the speakers' roles or fillers if speakers are not available.
     *
     * @return {Array} An array containing the roles of the speakers or fillers.
     */
    getLabels() {
      return this.getSpeakers
        ? Array(this.getSpeakers[0].role, this.getSpeakers[1].role)
        : this.fillers;
    },
    /**
     * A description of the entire function.
     *
     * @param {type} target - description of parameter
     * @return {type} description of return value
     */
    updateForm(target) {
      const payload = [target.id, target.value];
    },
  },
  mounted() {},
};
</script>
