<!-- VIEW COMPONENT: Configuration of a new session -->
<template>
  <div class="container h-full pb-5">
    <Teleport to="body">
      <div
        v-if="saved"
        class="bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center absolute inset-0 z-20"
        id="overlay"
        @click.self="saved = false"
      >
        <div
          @click.self="close"
          class="flex flex-col justify-start absolute w-1/3 rounded-xl py-6 px-3 bg-white shadow-lg left-1/2 inset-1/2-screen"
        >
          <div class="flex">
            <div class="flex flex-col items-center justify-between ml-auto">
              <p class="mx-2 mt-1 leading-1 text-lg font-bold text-center">
                Soll die Konfiguration
                <span class="italic mx-1 text-sky-600">
                  "{{
                    this.getCurrentSession.baseConfig.application_domain
                  }}" </span
                >wirklich <span class="text-rose-800"> gelöscht </span> werden?
              </p>
              <div class="flex justify-center mt-4 mx-auto">
                <div
                  class="cursor-pointer hover:font-bold border-transparent rounded-lg px-4 mx-3 py-1 mt-1"
                >
                  <SmallButton class="hover:bg-red-600" size=""
                    >Ja, löschen</SmallButton
                  >
                </div>
                <div
                  class="cursor-pointer hover:font-bold border-transparent rounded-lg px-4 mx-4 py-1 mt-1"
                >
                  <SmallButton color="outline" size="24">Abbrechen</SmallButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></Teleport
    >
    <Teleport to="body" v-if="deleteRequest">
      <div
        v-if="deleteRequest"
        class="bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center absolute inset-0 z-20"
        id="overlay"
        @click.self="deleteRequest = false"
      >
        <div
          @click.self="close"
          class="flex flex-col justify-start absolute w-1/3 rounded-xl py-6 px-3 bg-white shadow-lg left-1/2 inset-1/2-screen"
        >
          <div class="flex">
            <div class="flex flex-col items-center justify-between ml-auto">
              <p
                class="mx-2 mt-1 leading-1 text-lg font-bold text-center"
                v-if="deleteRequest"
              >
                Soll die Konfiguration
                <span
                  class="italic mx-1 text-sky-600"
                  v-if="this.getCurrentSession"
                >
                  "{{
                    this.getCurrentSession.baseConfig.application_domain
                  }}" </span
                >wirklich <span class="text-rose-800"> gelöscht </span> werden?
              </p>
              <div class="flex justify-center mt-4 mx-auto">
                <div
                  class="cursor-pointer hover:font-bold border-transparent rounded-lg px-4 mx-3 py-1 mt-1"
                  @click="deleteSession()"
                >
                  <SmallButton class="hover:bg-red-600" size=""
                    >Ja, löschen</SmallButton
                  >
                </div>
                <div
                  class="cursor-pointer hover:font-bold border-transparent rounded-lg px-4 mx-4 py-1 mt-1"
                  @click="this.deleteRequest = false"
                >
                  <SmallButton color="outline" size="24">Abbrechen</SmallButton>
                </div>
              </div>
            </div>
            <div
              class="flex ml-auto h-fit justify-end right hover:bg-blue-200 rounded-lg"
              @click="deleteRequest = false"
            >
              <Icon iconName="close" size="32"></Icon>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <!-- <Teleport to="body" v-if="goBackRequest">
      <div
        class="bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center absolute inset-0 z-20"
        id="overlay"
        @click.self="deleteRequest = false"
      >
        <div
          @click.self="close"
          class="flex justify-center absolute w-1/3 rounded-xl py-3 px-3 bg-white shadow-lg left-1/3 inset-1/2-screen"
        >
          <div class="flex flex-col items-center justify-between ml-auto">
            <p class="m-2 text-lg font-bold">
              <span class="text-rose-800"
                >Ungespeicherte {{ elementType }}!
              </span>
              Was wollen Sie tun?
            </p>
            <div class="flex mt-4">
              <SmallButton
                preset="filled"
                size=""
                class="h-fit mr-4"
                @click="
                  this.$refs.api.saveSession();
                  this.goBackRequest = false;
                  this.$store.commit('setCurrentSession', null);
                "
                >Änderungen speichern</SmallButton
              >
              <router-link
                to="/new-session"
                @click="this.$store.commit('setCurrentSession', null)"
                ><SmallButton
                  preset="outlined"
                  class="h-fit mr-4 hover:bg-red-600"
                  size=""
                  >Verwerfen</SmallButton
                ></router-link
              >
              <SmallButton
                preset="outlined"
                size=""
                class="h-fit mr-4"
                @click="this.goBackRequest = false"
                >Abbrechen</SmallButton
              >
            </div>
          </div>
          <div
            class="flex ml-auto h-fit justify-end right hover:bg-blue-200 rounded-lg"
            @click="goBackRequest = false"
          >
            <Icon iconName="close" size="32"></Icon>
          </div>
        </div></div
    ></Teleport> -->
    <div class="flex flex-col justify-start w-full h-full">
      <div class="flex justify-between w-full items-center mb-2">
        <div class="flex flex-col w-full">
          <TheBreadcrumb
            @navigate="
              (e) =>
                !this.isFormDirty
                  ? e == 'Termine'
                    ? this.$router.push('/courses')
                    : e == 'Startseite'
                    ? this.$router.push('/')
                    : ''
                  : (this.goBackRequest = true)
            "
            :breadcrumbs="[
              { name: 'Startseite' },
              { name: 'Termine' },
              { name: 'Neuer Termin' },
            ]"
          ></TheBreadcrumb>
          <div class="flex items-center justify-between w-full">
            <!-- <SmallButton
                preset="outlined"
                class="h-fit mr-4"

                ><Icon size="28" iconName="backArrow" color="gray"></Icon
                ><span class="w-full m-1">Übersicht</span></SmallButton
              > -->
            <ThePageTitle>{{ headline }}:</ThePageTitle>
            <!-- <div class="flex items-center">
              <div
                class="flex mr-12 px-4 py-1 z-1 border-2 rounded-lg"
                :class="{
                  'border-red-600 ': this.deleteRequest,
                  'border-transparent': !this.deleteRequest,
                }"
              >
                <div
                  class="rounded-xl p-2 hover:bg-red-400 flex items-center my-2"
                  @click="this.deleteRequest = true"
                >
                  <Icon size="28" iconName="delete" color="gray"></Icon>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>

      <!-- MultiSteps -->
      <MultiSteps
        ref="api"
        class="h-auto py-3"
        @data-changed="
          (e) => {
            handleChange(e);
          }
        "
        @save="this.isFormDirty = false"
      ></MultiSteps>
    </div>
  </div>
</template>

<script>
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import SmallButton from "../components/interface-components/SmallButton.vue";
import MultiSteps from "../components/configuration-components/MultiSteps.vue";
import Icon from "../components/interface-components/Icon.vue";
import TheBreadcrumb from "../components/interface-components/TheBreadcrumb.vue";
import { mapState, mapGetters } from "vuex";

// import "v-calendar/style.css";
// import { DatePicker } from "v-calendar";

export default {
  components: {
    ThePageTitle,
    SmallButton,
    MultiSteps,
    Icon,
    TheBreadcrumb,
  },
  data() {
    return {
      isFormDirty: false,
      saved: false,
      headline: "Neuer Termin",
      elementType: "Sitzung",
      deleteRequest: false,
      goBackRequest: false,
    };
  },
  methods: {
    handleChange(e) {
      this.isFormDirty = e.length > 0;
    },
    /**
     * initiates the delete dialog
     */
    openDelete() {
      this.deleteRequest = true;
    },
    /**
     * Deletes the session and navigates to the home page.
     *
     * This function calls the `deleteSession` method on the `api` component referenced by `$refs.api`.
     * After the session is deleted, it uses the `$router` object to navigate to the home page.
     *
     * @return {void} This function does not return anything.
     */
    deleteSession() {
      this.$refs.api.deleteSession();
      this.$router.push({ path: "/" });
    },
    // requestGoBack() {
    //   this.goBackRequest = true;
    // },

    /**
     * Sets the `isFormDirty` flag to true when the form changes.
     *
     * This function is called whenever the form changes and it updates the `isFormDirty`
     * flag to indicate that there are unsaved changes in the form.
     *
     * @return {void} This function does not return anything.
     */
    onFormChange() {
      this.isFormDirty = true;
    },
    /**
     * Handles the 'beforeunload' event and prompts the user if there are unsaved changes.
     *
     * @param {Event} event - The 'beforeunload' event.
     * @return {string|undefined} The message to display to the user, or undefined if there are no unsaved changes.
     */
    handleBeforeUnload(event) {
      if (this.isFormDirty) {
        const message =
          "Es gibt ungespeicherte Änderungen. Wollen Sie die Änderungen verwerfen?";
        event.returnValue = message;
        return message;
      }
    },
  },

  /**
   * Handles the navigation before leaving the current route.
   *
   * @param {Object} to - The target route object.
   * @param {Object} from - The current route object.
   * @param {Function} next - The callback function to continue the navigation.
   * @return {void}
   */
  beforeRouteLeave(to, from, next) {
    if (this.isFormDirty) {
      const answer = window.confirm(
        "Es gibt ungespeicherte Änderungen. Wollen Sie die Änderungen verwerfen?"
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  computed: {
    ...mapState(["testroom"]),
    ...mapGetters({
      getSpeakers: "getSpeakers",
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getBaseConfig: "getBaseConfig",
    }),
  },

  created() {
    if (!this.getCurrentSession || this.getCurrentSession == null) {
      this.headline = "Neuer Termin";
      this.elementType = "Termin";
      this.$store.commit("setCurrentSession", "new");
    }
  },
};
</script>
