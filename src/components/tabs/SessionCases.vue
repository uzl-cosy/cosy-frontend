<!--Tab Content Component: Session Cases contains the table of the cases of the session-->
<template>
  <CaseConfig
    @go-to-record="(e) => this.$emit('go-to-record', e)"
    :showRecord="true"
  ></CaseConfig>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import TableCourses from "../tables/TableCourses.vue";
import TableCases from "../tables/TableCases.vue";
import CaseConfig from "../steps/CaseConfig.vue";

export default {
  components: {
    TableCourses,
    TableCases,
    CaseConfig,
  },
  data() {
    return {
      cases: [],
    };
  },
  mounted() {
    this.cases = this.getCaseConfig.cases;
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters(["getCurrentSession", "getSessions", "getCaseConfig"]),
  },
};
</script>
