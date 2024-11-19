<!--Root Component: App.vue-->
<template>
  <div
    class="wrapper pl-1 overscroll-none w-full overflow-hidden h-screen flex flex-col"
  >
    <header
      class="2xl:pt-2 flex justify-between mr-12 items-start 2xl:my-auto md:-mb-7 top-0 2xl:-mb-3"
      :class="{ '-mb-12 ': windowHeight < 700 }"
      v-if="getLoginState == 'authenticated'"
    >
      <router-link to="/"
        ><img src="./assets/App_Icon_Cosy.svg" alt="CoSy" class="cosy-logo"
      /></router-link>

      <div
        class="mr-auto flex self-center xl:-mt-10"
        v-if="getLoginState == 'authenticated'"
      >
        <div class="mx-2 flex justify-between items-center">
          <!--Audio/AI Status-->
          <Dropdown
            class="mx-2 mb-1 2xl:text-base xl:text-xs lg:text-xs md:text-xs sm:text-xs"
            v-if="getInstances && getCurrentInstance"
            @update="(e) => this.$store.commit('setCurrentInstance', e)"
            :icon-name="VolumeMax"
            :list="
              getInstances.filter((instance) => {
                return instance.name !== getCurrentInstance.name;
              })
            "
            :selected="getCurrentInstance.name"
            :selected-color="red"
          >
          </Dropdown>
        </div>
        <div class="flex justify-between items-center">
          <div
            class="rounded-full p-1.5 h-fit"
            :class="{
              'bg-green-500 ': aiStatus,
              'bg-red-500 ': !aiStatus,
            }"
          ></div>
          <span class="mx-2 2xl:text-lg xl:text-sm text-white">Status </span>
        </div>
      </div>

      <!-- Login State-->
      <TheLoginState
        class="inset-y-0 mt-3"
        v-if="getLoginState && $route.path !== '/login'"
      ></TheLoginState>

      <!-- <NavTeacher
      ></NavTeacher> -->
    </header>
    <div
      v-if="getLoginState !== 'authenticated'"
      class="text-white flex flex-col items-center md:mt-12 -mb-24 overflow-hidden"
    >
      <div
        class="font-semibold 2xl:text-4xl xl:text-2xl md:text-xl sm:text-normal flex items-center md:pb-5"
      >
        <span class="mb-2 flex items-center">
          Willkommen bei
          <div class="w-fit">
            <img
              src="./assets/App_Icon_Cosy.svg"
              alt="CoSy"
              class="cosy-logo-start"
            /></div
        ></span>
        <span> deinem Communication Support System </span>
      </div>
    </div>

    <div class="flex grow overflow-hidden xl:-mt-5">
      <!-- Navigation Bar-->
      <nav class="" v-if="getLoginState == 'authenticated'">
        <ul class="2xl:mt-24 md:mt-20 mb-6">
          <li>
            <router-link
              to="/"
              class="navitem flex flex-row"
              @mouseover="tooltip = 'Startseite'"
              @mouseleave="tooltip = ''"
              ><Icon iconName="home" class="mt-auto" />
              <span
                class="text-xs my-auto"
                :class="{
                  'text-white': $route.fullPath !== '/',
                  'text-primary': $route.fullPath === '/',
                }"
                >Start
              </span>
              <!-- UNUSED: Tooltip -->
              <!-- <span
                v-if="!mobile && tooltip === 'Startseite'"
                class="text-base flex absolute left-16 z-20 rounded-lg"
              >
                <svg viewBox="0 0 7 10">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                </svg>
                <span class="mx-2 bg-white/70"> {{ tooltip }} </span>
              </span> -->
            </router-link>
          </li>
          <li>
            <router-link
              to="/new-session"
              class="navitem flex flex-row"
              @mouseover="tooltip = 'Neuer Termin'"
              @mouseleave="tooltip = ''"
              ><Icon iconName="filePlus" class="mt-auto" />
              <span
                class="text-xs my-auto"
                :class="{
                  'text-white': $route.fullPath !== '/new-session',
                  'text-primary': $route.fullPath === '/new-session',
                }"
                >Neuer Termin</span
              >
              <!-- UNUSED: Tooltip -->

              <!-- <span
                v-if="!mobile && tooltip === 'Neuer Termin'"
                class="text-base flex absolute left-16 z-20 p-2 rounded-lg truncate"
              >
                <svg viewBox="0 0 7 10">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                </svg>
                <span class="mx-2 bg-white/70"> {{ tooltip }} </span>
              </span> -->
            </router-link>
          </li>
          <li>
            <router-link
              to="/courses"
              class="navitem flex flex-row"
              @mouseover="tooltip = 'Meine Termine'"
              @mouseleave="tooltip = ''"
              ><Icon iconName="book" class="mt-auto" />
              <span
                class="text-xs my-auto"
                :class="{
                  'text-white': $route.fullPath !== '/courses',
                  'text-primary': $route.fullPath === '/courses',
                }"
                >Termine
              </span>
              <!-- UNUSED: Tooltip -->
              <!-- <span
                v-if="!mobile && tooltip === 'Meine Termine'"
                class="text-base flex absolute left-16 p-2 z-20 rounded-lg truncate"
              >
                <svg viewBox="0 0 7 10">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                </svg>
                <span class="mx-2 bg-white/70"> {{ tooltip }} </span>
              </span> -->
            </router-link>
          </li>
          <!-- <li>
            <router-link
              to="/actors"
              class="navitem flex flex-row"
              @mouseover="tooltip = 'Schauspieler*innen'"
              @mouseleave="tooltip = ''"
              ><Icon iconName="mask" />
              <span
                v-if="tooltip == 'Schauspieler*innen'"
                class="text-base flex absolute left-16 p-2 rounded-lg truncate"
              >
                <svg viewBox="0 0 7 10">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                </svg>
                <span class="mx-2 bg-white/70"> {{ tooltip }} </span>
              </span></router-link
            >
          </li> -->
          <li>
            <router-link
              to="/feedbacklist"
              class="navitem flex flex-row"
              @mouseover="tooltip = 'Analysen'"
              @mouseleave="tooltip = ''"
              ><Icon iconName="clockRewind" class="mt-auto" />
              <span
                class="text-xs my-auto"
                :class="{
                  'text-white': $route.fullPath !== '/feedbacklist',
                  'text-primary': $route.fullPath === '/feedbacklist',
                }"
                >Analysen
              </span>
              <!-- UNUSED: Tooltip -->

              <!-- <span
                v-if="!mobile && tooltip === 'Analysen'"
                class="text-base flex absolute left-16 p-2 z-20 rounded-lg"
              >
                <svg viewBox="0 0 7 10">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                </svg>
                <span class="mx-2 bg-white/70"> {{ tooltip }} </span>
              </span> -->
            </router-link>
          </li>
          <!-- <li>
            <router-link
              to="/participants"
              class="navitem flex flex-row"
              @mouseover="tooltip = 'Teilnehmer'"
              @mouseleave="tooltip = ''"
              ><Icon iconName="users"></Icon>
              <span
                v-if="tooltip == 'Teilnehmer'"
                class="flex text-base absolute left-16 p-2 rounded-lg"
              >
                <svg viewBox="0 0 7 10">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                </svg>
                <span class="mx-2 bg-white/70"> {{ tooltip }} </span>
              </span></router-link
            >
          </li> -->
          <!-- <li>
            <router-link
              to="/settings"
              class="navitem flex flex-row"
              @mouseover="tooltip = 'Einstellungen'"
              @mouseleave="tooltip = ''"
              ><Icon iconName="settings"></Icon>
              <span
                v-if="!mobile && tooltip === 'Einstellungen'"
                class="z-20 text-base flex absolute left-16 p-2 rounded-lg"
              >
                <svg viewBox="0 0 7 10">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                </svg>
                <span class="mx-2 bg-white/70"> {{ tooltip }} </span>
              </span></router-link
            >
          </li> -->
          <li v-if="feedbackActive">
            <router-link
              to="/feedback"
              class="navitem flex flex-row"
              @mouseover="tooltip = 'Analyse'"
              @mouseleave="tooltip = ''"
              ><div
                class="px-4 py-4 rounded-xl border-4 border-dotted border-sky-300"
              >
                <Icon iconName="document" color="white"></Icon>
              </div>
              <span
                v-if="tooltip === 'Analyse'"
                class="text-base flex absolute z-20 left-16 p-2 0 rounded-lg"
              >
                <svg viewBox="0 0 7 10">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                </svg>
                <span class="mx-2"> {{ tooltip }} </span>
              </span></router-link
            >
          </li>
        </ul>
      </nav>

      <!--Main View-->
      <main
        class="overflow-hidden bg-white rounded-3xl text-left shadow-xl z-70"
        :class="{
          ' w-full h-full p-7': getLoginState == 'authenticated',
          'm-auto px-20  2xl:pt-10 sm:pt-6 ': getLoginState !== 'authenticated',
        }"
        :style="{
          borderRadius:
            getLoginState === 'authenticated' ? '65px 15px 0px 15px' : '25px',
        }"
      >
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.cosy-logo {
  width: 96px;
  height: 96px;
  position: relative;
  left: -5px;
  padding-bottom: 0;
}

@media screen and (max-height: 1000px) {
  .cosy-logo-start {
    width: 120px;
    height: 120px;
    position: relative;
    padding-bottom: 0;
  }
}

@media screen and (min-height: 1010px) {
  .cosy-logo-start {
    width: 180px;
    height: 180px;
    position: relative;
    padding-bottom: 0;
  }
}
</style>

<script>
import Icon from "./components/interface-components/Icon.vue";
import axios from "axios";
import TheLoginState from "./components/interface-components/TheLoginState.vue";
import { API_URL } from "./config";
import { mapGetters } from "vuex";
import { store } from "./store";
import Dropdown from "./components/form-components/Dropdown.vue";

export default {
  components: {
    Dropdown,
    Icon,
    TheLoginState,
  },
  data() {
    return {
      healthAI: [],
      aiStatus: false,
      audioStatus: false,
      healthAudio: [],
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      feedbackActive: false,
      tooltip: "",
    };
  },

  created() {
    window.addEventListener("resize", this.resize);
  },
  unmounted() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    /**
     * Navigates to the login page and removes the token from local storage.
     *
     * @return {void}
     */
    handleLogin() {
      this.$router.push("/login");
      localStorage.removeItem("token");
    },
    /**
     * Executes periodic health checks using axios to update healthAI and audioStatus.
     *
     */
    requestHealth() {
      // if (localStorage.getItem("username") !== "cosy") {
      window.setInterval(() => {
        axios
          .get(this.getCurrentInstance.url + "/health")
          .then((response) => {
            this.healthAI = response.data;
            this.aiStatus = true;
          })
          .catch((error) => {
            this.errorMessage = error.message;
            this.aiStatus = false;
            //             console.error("There was an error!", error);
          });
        axios
          .get(this.getCurrentInstance.url + "/health")
          .then((response) => {
            this.healthAudio = response.data;
            // this.$store.commit("setHealthAI", response.data);
            this.audioStatus = true;
          })
          .catch((error) => {
            this.errorMessage = error.message;
            this.audioStatus = false;
            //             console.error("There was an error!", error);
          });
      }, 3000);
      // }
    },
    /**
     * Updates the `windowHeight` and `windowWidth` properties of the component
     * with the current window's height and width.
     *
     * @return {void}
     */

    resize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },
  },
  mounted() {
    const vue = this;
    if (localStorage?.getItem("userid")) {
      const storedData = localStorage.getItem("userid");

      store.commit("setUser", { id: storedData });
    }

    if (localStorage && localStorage.getItem("currentInstance")) {
      const storedInstance = localStorage.getItem("currentInstance");
      store.commit("setCurrentInstance", storedInstance);
    }

    let token = "";
    if (localStorage?.getItem("token")) {
      const storedToken = localStorage.getItem("token");
      if (storedToken !== null) {
        token = storedToken;
      }
    }
    axios
      .get(API_URL + "/sessions", {
        headers: { Authorization: "Bearer " + token },
      })
      .catch((error) => {
        if (error.response.status === 401) vue.$router.replace("/login");
      });
    this.$store.commit("setLoginState", "authenticated");
    this.requestHealth();
    this.$store.commit("setInstances", null);
    if (localStorage?.getItem("currentInstance")) {
      const instance = localStorage.getItem("currentInstance");

      this.$store.commit("setCurrentInstance", instance);
    } else this.$store.commit("setCurrentInstance", this.getInstances[0]);
  },
  beforeUpdate() {
    const vue = this;
    let token = "";
    if (localStorage?.getItem("token")) {
      const storedToken = localStorage.getItem("token");
      if (storedToken !== null) {
        token = storedToken;
      }
    }
    axios
      .get(`${API_URL}/sessions`, {
        headers: { Authorization: "Bearer " + token },
      })
      .catch((error) => {
        if (error.response.status === 401) vue.$router.replace("/login");
      });
  },
  computed: {
    /**
     * Retrieves the username from the local storage if it exists.
     *
     * @return {string|null} The username stored in the local storage, or null if it doesn't exist.
     */
    getUsername() {
      return localStorage?.getItem("username") ?? null;
    },
    ...mapGetters(["getLoginState", "getInstances", "getCurrentInstance"]),
    /**
     * Check if the user is accessing the application from a mobile device.
     *
     * @return {boolean} True if the user is on a mobile device, false otherwise.
     */
    mobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  },
};
</script>
