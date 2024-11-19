<template>
  <div class="2xl:text-lg xl:text-xs flex items-center md:mb-5 2xl:m-0">
    <span
      class="md:mx-8 mx-2 text-slate-100 flex items-center"
      v-if="username && this.getLoginState == 'authenticated'"
    >
      <Icon iconName="user" color="white" class="mx-2"></Icon>
      <span class="mr-2 whitespace-nowrap" v-if="!mobile">Eingeloggt als</span>
      <strong class="mx-2">
        {{ username }}
      </strong>
    </span>
    <span
      class="text-white cursor-pointer border-white/50 md:border-2 px-3 rounded-lg 2xl:py-2 xl:py-1"
      @click="handleLogout"
      v-if="
        this.$router.currentRoute.path !== '/login' &&
        this.getLoginState == 'authenticated'
      "
    >
      Ausloggen
    </span>
    {{ this.$router.currentRoute.path }}
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Icon from "./Icon.vue";

export default {
  components: { Icon },
  data() {
    return {
      // user: this.username,
    };
  },

  updated() {
    // this.loginState = this.getLoginState;
    // this.userName = this.getUserData.name;
    // this.loginState = this.$store.state.loginState;
    // this.userName = this.$store.state.userData.name;
  },
  mounted() {
    // if (localStorage.getItem("username"))
    //   this.user = JSON.parse(localStorage.getItem("username"));
  },
  methods: {
    handleLogout() {
      this.$router.push("/login");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userid");

      this.$store.commit("setLoginState", "unauthorized");
      this.$store.commit("setUser", "clear");

      this.$forceUpdate();
    },
    mobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  },
  computed: {
    ...mapGetters([
      "getCurrentSession",
      "getUserData",
      "getUsers",
      "getLoginState",
    ]),
    username() {
      return JSON.parse(localStorage.getItem("username"));
    },
  },
};
</script>
