<!--UNUSED COMPONENT: Participants-->
<template>
  <ThePageTitle>Teilnehmer</ThePageTitle>
  <TableParticipants></TableParticipants>
  <Combobox></Combobox>
</template>

<script>
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import Combobox from "../components/form-components/Combobox.vue";
import TableParticipants from "../components/tables/TableParticipants.vue";

export default {
  components: {
    ThePageTitle,
    Combobox,

    TableParticipants,
  },
  props: {
    names: {
      type: Array,
      default: "TODO",
    },
  },
  data() {
    return {};
  },
  methods: {},
  created() {
    // this.myFunction();
  },
  mounted() {},
};
</script>

<style></style>
