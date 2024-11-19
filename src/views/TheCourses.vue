<!--VIEW COMPONENT: Overview of Sessions, each representing the course/seminar that can be planned for several recordings-->
<template>
  <TheBreadcrumb
    :breadcrumbs="breadcrumbs"
    @navigate="(e) => (e == 'Startseite' ? this.$router.push('/') : '')"
  ></TheBreadcrumb>
  <ThePageTitle>Cosy-Termine</ThePageTitle>
  <div class="mx-auto">
    <!--Session list-->
    <TableCourses
      class="w-full"
      ref="sessions"
      icon="clockRewind"
      :button="false"
      :data="sessions"
      size="xl"
      :labels="sessionLabels"
      :limit="10"
      @delete-session="deleteSession"
      @open-config="openConfig"
      >Geplante Cosy-Termine
    </TableCourses>
  </div>

  <!--CREATE NEW SESSION-->
  <div class="px-24 mt-10">
    <router-link to="/new-session" class="w-full"
      ><BigButton size="48" preset="filled" color="white" icon="filePlus"
        ><span class="2xl:text-2xl md:text-xl w-fit"
          >Neuer Cosy-Termin</span
        ></BigButton
      ></router-link
    >
  </div>
</template>
<script>
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import { mapGetters } from "vuex";
import TableCourses from "../components/tables/TableCourses.vue";
import axios from "axios";
import { API_URL } from "../config";
import BigButton from "../components/interface-components/BigButton.vue";
import TheBreadcrumb from "../components/interface-components/TheBreadcrumb.vue";

export default {
  components: { ThePageTitle, TableCourses, BigButton, TheBreadcrumb },
  data() {
    return {
      sessionLabels: ["Kursname", "Fälle", "Datum", "Aufnahme", " ", " "],
      sessions: [],
      breadcrumbs: [
        { id: "1", name: "Startseite" },
        { id: "2", name: "Termine" },
      ],
    };
  },

  methods: {
    openConfig() {
      this.$router.push("/new-configuration");
    },
    /**
     * Fetches session data from the server and updates the component's sessions data.
     *
     * @return {void}
     */
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
          this.sessions = response.data;
          this.$store.commit("setSessions", response.data);
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
  },
  computed: {
    ...mapGetters({
      getCurrentSession: "getCurrentSession",
      getAllSessions: "getAllSessions",
      getSessions: "getSessions",
      getToken: "getToken",
    }),
    course() {
      return this.getCourses;
    },
  },
  mounted() {
    // Fetch session data on mount
    setTimeout(() => {
      this.fetchSessionData();
      this.$forceUpdate();
    }, 30);
  },
};
</script>
