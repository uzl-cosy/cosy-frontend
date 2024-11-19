<!--VIEW COMPONENT: Sessions Overview-->
<template>
  <ThePageTitle>Vergangene Cosy-Termine</ThePageTitle>
  <router-link to="/feedbacklist" class="w-full"
    ><TableCourses class="w-full" icon="clockRewind" :button="false"
      >Vergangene Cosy-Termine
    </TableCourses></router-link
  >
</template>

<script>
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import TableCourses from "../components/tables/TableCourses.vue";

export default {
  components: {
    ThePageTitle,
    TableCourses,
  },
};
</script>
