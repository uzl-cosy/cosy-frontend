<!--Configuration Component: Data Usage options that let the user choose if data should be saved or not-->
<template>
  <div class="w-fit h-fit flex my-auto items-center pr-5 pb-3">
    <!--Roles and checkboxes for choosing data usage options-->
    <TableCheckboxes
      @update="
        (e) =>
          this.$store.commit('setDataUsageConfig', {
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
      @input="updateDataUsage"
      :dim3="true"
    ></TableCheckboxes>
  </div>
</template>
<script>
import InputField from "../form-components/InputField.vue";
import TableCheckboxes from "../form-components/TableCheckboxes.vue";
import { mapState, mapGetters } from "vuex";

export default {
  name: "DataUsageConfig",
  components: {
    InputField,

    TableCheckboxes,
  },
  data() {
    return {
      parameters: [
        {
          id: "1",
          title: "Analyse speichern",
          description:
            "Soll die textuelle Transkription des gesprochenen Wortes gespeichert werden?",
          // checked1a: true,
          // checked1b: true,
          // checked1c: true,
          checkedA: true,
          checkedB: true,
          // checked2a: true,
          // checked2b: true,
          // checked2c: true,
        },
      ],
      // not used: Speech parameter for the speakers
      speaker1: {
        name: "Sprecher 1",
        parameters: ["tempo", "pitch", "loudness", "shares", "pauses"],
        dataUsage: ["transcript", "audiorecord", "analysis"],
      },
      speaker2: {
        name: "Sprecher 2",
        parameters: ["tempo", "pitch", "loudness", "shares", "pauses"],
        dataUsage: ["transcript", "audiorecord", "analysis"],
      },
    };
  },

  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters(["getSpeakers", "getconfig", "getCurrentRecord"]),
    labels() {
      this.speaker1.name =
        this.getCurrentRecord && this.getCurrentRecord.speaker1.name !== ""
          ? this.getCurrentRecord.speaker1.name
          : "Sprecher 1";
      this.speaker2.name =
        this.getCurrentRecord && this.getCurrentRecord.speaker2.name !== ""
          ? this.getCurrentRecord.speaker2.name
          : "Sprecher 2";
      return [this.speaker1.name, this.speaker2.name];
    },
  },
};
</script>
