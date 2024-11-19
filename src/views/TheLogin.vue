<!--VIEW COMPONENT: Login Page-->
<template>
  <div class="pb-5">
    <div class="w-full self-center flex justify-center">
      <ThePageTitle class="text-center">
        <span class="md:text-5xl sm:text-3xl xs:text-2xl"
          >Einloggen</span
        ></ThePageTitle
      >
    </div>
    <div
      class="flex flex-col justify-center px-6 py-6 lg:px-8 items-start top-24 h-1/2"
    >
      <!-- <div class="sm:mx-auto sm:w-full sm:max-w-sm"> -->
      <!-- <img
        class="mx-auto h-10 w-auto"
        src="assets/cosy-logo.svg"
        alt="Your Company"
      /> -->
      <span
        class="text-center text-lg font-medium leading-8 tracking-tight text-gray-800"
      >
        Bitte Zugangsdaten eingeben.
      </span>
      <!-- </div> -->

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" action="#" method="POST">
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              <!-- Benutzername -->
              Username
            </label>
            <div class="mt-2">
              <input
                id="email"
                name="email"
                type="text"
                v-model="userName"
                @input="this.showError = false"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                <!-- Passwort -->
                Password</label
              >
              <!-- <div class="text-sm">
              <a
                href="#"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Forgot password?</a
              >
            </div> -->
            </div>
            <div class="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                v-model="password"
                @input="this.showError = false"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="text-red-500 font-bold leading-6" v-if="showError">
            Fehler: {{ this.respondMessage }}
          </div>
          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click="this.checkUserData"
            >
              Einloggen
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import { API_URL } from "../config";

export default {
  components: {
    ThePageTitle,
  },
  data() {
    return {
      userName: "",
      password: "",
      respondMessage: "",
      showError: false,
      serverResponse: "",
    };
  },

  methods: {
    checkUserData() {
      let data = {
        username: this.userName,
        password: this.password,
      };
      let vue = this;
      axios
        .post(API_URL + "/users/login", data)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.token;
          localStorage.setItem("token", response.data.token);
          localStorage.setItem(
            "username",
            JSON.stringify(response.data.username)
          );
          localStorage.setItem("userid", response.data.id);
          setTimeout(function () {
            vue.$store.commit("setUser", {
              username: response.data.username,
              id: response.data.id,
            });
            vue.$store.commit("setLoginState", "authenticated");
          }, 1000);
          this.$router.push("/");
          // this.$refs.start.$data.fetchingCyle = true;
        })
        .catch((error) => {
          console.log("error:" + error);
          if (error.response.status == 404)
            this.showErrorMessage("Ungültige Eingabe. Bitte erneut versuchen!");
        });

      this.password = "";
    },
    showErrorMessage(msg) {
      this.respondMessage = msg;
      this.showError = true;
    },
  },
  mounted() {
    var vue = this;
    var token = "";
    if (localStorage && localStorage.getItem("token")) {
      const storedToken = localStorage.getItem("token");
      if (storedToken !== null) {
        token = storedToken;
      }
    }

    // fetch sessions
    axios
      .get(API_URL + "/sessions", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        console.log(response);
        this.$store.commit("setSessions", response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401) {
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          localStorage.removeItem("sessionId");
          localStorage.removeItem("userid");
        }
        this.$store.commit("setLoginState", "unauthorized");
        this.errorMessage = error.message;
        //console.error("There was an error!", error);
      });
  },
};
</script>
