<!--Table Component: Lists all available courses AKA sessions-->
<template>
  <Teleport to="body" v-if="duplicateCourse">
    <div
      class="bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center absolute inset-0 z-20"
      id="overlay"
      @click.self="this.duplicateCourse = false"
    >
      <div
        @click.self="close"
        class="flex flex-col justify-start absolute w-fit rounded-xl px-3 bg-ocean-dark/50 shadow-lg inset-1/2-screen"
      >
        <div class="flex flex-col mx-auto justify-center pb-1">
          <div class="flex">
            <span
              class="font-bold 2xl:text-xl md:text-lg ml-auto text-white center mt-2"
              >{{
                !this.getNewSession.baseConfig.application_domain
                  ? "Duplikat"
                  : "Duplikat von Termin " +
                    this.getNewSession.baseConfig.application_domain
              }}</span
            >
            <div
              class="flex ml-auto h-fit justify-end right hover:bg-blue-200 rounded-lg"
              @click="
                this.duplicateCourse = false;
                this.blockOpen = true;
                // this.$store.commit('setCaseConfig', '');
              "
            >
              <Icon iconName="close" size="32"></Icon>
            </div>
          </div>

          <!-- Input Form -->
          <div
            class="w-full h-full flex flex-col items-start mx-auto justify-start rounded-xl"
            :class="{
              'bg-sky-100': !highlightForm,
              'bg-blue-200': highlightForm,
            }"
          >
            <BaseConfig></BaseConfig>
          </div>
          <div class="flex">
            <div class="flex justify-center mx-auto">
              <SmallButton
                v-if="this.duplicateCourse"
                class="mx-2"
                @click="
                  this.duplicate();
                  this.duplicateCourse = false;
                  this.blockOpen = true;
                "
                size=""
                >Speichern</SmallButton
              >

              <SmallButton
                class="mx-2"
                @click="
                  this.duplicateCourse = false;
                  this.$store.commit('setNewCase', '');
                  this.blockOpen = true;
                "
                preset="outline"
                size=""
                >Abbrechen</SmallButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  <div class="w-full">
    <div class="flex item relative 2xl:p-1 justify-between items-center">
      <span class="flex items-center"
        ><Icon class="mr-2" :iconName="icon" color="#213547" />
        <span class="font-light md:text-lg 2xl:text-2xl text-blue-dark">
          <slot /> </span
      ></span>
      <SmallButton
        size=""
        preset="outline"
        class="px-1 py-0.5 ml-auto mx-3"
        @click="toggleFilter"
        ><Icon iconName="filter"></Icon
      ></SmallButton>
      <th v-if="!forDuplicate">
        <router-link to="/courses"
          ><SmallButton
            preset="outlined"
            class="2xl:py-1 2xl:px-2 2xl:text-base md:text-xs mr-5"
            size=""
            ><span class="w-max break-keep">Mehr anzeigen</span></SmallButton
          >
        </router-link>
      </th>
    </div>
    <div class="table overflow-x-auto my-0">
      <div class="flex justify-end" v-if="this.showFilter">
        <CheckboxOption
          @new-input="(e) => (this.hideOld = e)"
          class="ml-1 w-fit whitespace-nowrap text-sm cursor-pointer"
          :value="this.hideOld"
          :modelValue="this.hideOld"
          label="Nur aktuelle anzeigen"
        ></CheckboxOption>
      </div>
      <!--      Table Start-->
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray w-full"
        >
          <tr class="py-2">
            <th
              class="w-5/12 first-letter:2xl:px-8 md:px-7 2xl:py-3 md:py-2 flex"
              @click="
                this.sortBy === 'nameUp'
                  ? (this.sortBy = 'nameDown')
                  : (this.sortBy = 'nameUp')
              "
            >
              <span class="flex items-center cursor-pointer">Titel </span
              ><Icon
                v-if="this.sortBy === 'nameDown'"
                class="mx-1"
                iconName="chevronDown"
              ></Icon>
              <Icon
                v-else-if="this.sortBy === 'nameUp'"
                class="mx-1"
                iconName="chevronUp"
              ></Icon>
            </th>
            <th class="w-2/12 xl:px-2 md:px-1 2xl:py-3 md:py-2">
              <span class="flex items-center">Anzahl Fälle </span>
            </th>
            <th class="w-2/12 2xl:px-2 md:px-1 2xl:py-3 md:py-2">
              <span class="flex items-center">Aufnahmen </span>
            </th>
            <th
              class="2xl:px-8 md:px-7 2xl:py-3 md:py-2"
              :class="{
                'w-3/12': !mobile,
                'w-2/12': mobile,
              }"
              @click="
                this.sortBy === 'dateUp'
                  ? (this.sortBy = 'dateDown')
                  : (this.sortBy = 'dateUp')
              "
            >
              <span class="flex items-center cursor-pointer"
                >Datum
                <Icon
                  v-if="this.sortBy === 'dateDown'"
                  class="mx-1"
                  iconName="chevronDown"
                ></Icon>
                <Icon
                  v-else-if="this.sortBy === 'dateUp'"
                  class="mx-1"
                  iconName="chevronUp"
                ></Icon
              ></span>
            </th>
            <th
              v-if="mobile"
              class="w-1/12 2xl:px-8 md:px-7 2xl:py-3 md:py-2"
            ></th>
          </tr>
        </thead>
        <tbody
          class="bg-blue-100 px-20 w-full rounded-b-2xl"
          v-if="!this.data || this.data.length === 0 || this.sortedData === 0"
        >
          <tr class="bg-blue-100 px-20 py-8 w-auto">
            <td
              class="px-12 col-3 py-8"
              colspan="3"
              v-if="this.data.length === 0"
            >
              Es gibt noch keine Termine
            </td>
          </tr>
          <!-- <tr class="w-full ">
            <td colspan="4" class="w-full mx-auto ">
              <div
                class="flex justify-center 2xl:py-2 xl:py-2 px-3 md:pb-1 md:my-1 mx-auto"
              >
                <SmallButton
                  @click.stop="this.$router.push('/courses')"
                  @click="this.$router.push('/new-session')"
                  class="w-fit flex justify-center pl-4 pr-6 md:py-1.5"
                  size=""
                  color="white"
                >
                  <Icon
                    iconName="filePlus"
                    color="white"
                    size="32"
                    class="mr-3 w-12"
                  ></Icon
                  ><span class="md:text-base 2xl:text-lg w-fit mx-2"
                    >Neuer Termin</span
                  ></SmallButton
                >
              </div>
            </td>
          </tr> -->
        </tbody>
        <!--TBODY-->
        <tbody
          v-else
          class="cursor-pointer overflow-x-hidden overflow-y-auto h-full"
        >
          <!--        TBODY > DIV-->
          <tr
            class="w-full hover:text-white flex flex-col even:bg-blue-100 odd:bg-blue-200 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-sky-700"
            v-for="(item, index) in sortedData"
            :key="item.id"
            @mouseenter="handleEnter(index)"
            @mouseleave="handleLeave(index)"
            @click="open(item.id)"
          >
            <!--        TBODY > DIV > TR1-->
            <td
              class="flex items-center hover:text-white w-full"
              @mouseenter="
                this.forDuplicate ? this.$emit('hover', item.id) : ''
              "
              @mouseleave="this.forDuplicate ? this.$emit('hover', '') : ''"
            >
              <div
                class="w-5/12 px-5 2xl:py-4 xl:py-3 md:py-2 font-medium whitespace-nowrap"
                @click="open(item.id)"
              >
                <div>
                  {{ item.baseConfig.subject_topic }}
                </div>
              </div>
              <div class="w-2/12 px-6" @click="open(item.id)">
                {{ item.caseConfig.cases.length }}
              </div>
              <div class="w-2/12 px-6" @click="open(item.id)">
                {{ item.meta.recorded_cases.length }}
              </div>
              <div
                class="px-6"
                @click="open(item.id)"
                :class="{
                  'w-3/12': !mobile,
                  'w-2/12': mobile,
                }"
              >
                {{
                  item.date.length > 10
                    ? this.format(new Date(item.date), "dd-MM-yyyy HH:mm")
                    : this.format(new Date(item.date), "dd-MM-yyyy HH:mm")
                }}
              </div>
              <div
                class="ml-auto pr-4"
                v-if="mobile && this.hovering !== index"
                @click.prevent="open(item.id)"
                @touchstart="
                  this.hovering === index
                    ? (this.hovering = '')
                    : this.openConfig(index)
                "
              >
                <div class="py-0.5 2xl:px-1.5 md:px-0.5" size="" preset="">
                  <Icon
                    v-if="this.hovering !== index"
                    iconName="dotVertical"
                  ></Icon>
                </div>
              </div>
            </td>
            <!--        TBODY > DIV > TR2-->
            <td
              class="flex items-center w-full justify-start"
              v-if="this.hovering === index && !this.forDuplicate"
            >
              <div
                class="w-auto"
                @click="record(item.id)"
                @mouseover="this.tooltip = 'r' + item.id"
                @mouseleave="this.tooltip = ''"
              >
                <div
                  class="flex justify-center border-4 rounded-lg border-transparent hover:border-blue-500 mx-2"
                >
                  <SmallButton class="py-1.5 2xl:px-2 md:px-1" size="">
                    <Icon iconName="microphone" color="white" size="24"></Icon>
                  </SmallButton>
                  <span
                    v-if="tooltip === 'r' + item.id"
                    class="text-base flex absolute ml-40 mt-8 p-2 rounded-lg truncate"
                  >
                    <svg viewBox="0 0 7 10">
                      <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                    </svg>
                    <span
                      class="mx-2 p-2 rounded-lg bg-white/70 text-slate-600"
                    >
                      Zum Aufnahmebereich
                    </span>
                  </span>
                </div>
              </div>

              <div
                v-if="this.hovering === index && !this.forDuplicate"
                @click="this.setDuplicate(item.id)"
                @mouseover="this.tooltip = 'du' + item.id"
                @mouseleave="this.tooltip = ''"
              >
                <div
                  class="flex justify-center border-4 rounded-lg border-transparent hover:border-blue-500"
                >
                  <SmallButton
                    class="py-1.5 2xl:px-2 md:px-1"
                    size=""
                    preset="outlined"
                  >
                    <Icon
                      iconName="copy"
                      :color="
                        this.tooltip === 'du' + item.id
                          ? 'white'
                          : 'rgb(59 168 212 / var(--tw-bg-opacity))'
                      "
                      size="20"
                    ></Icon>
                  </SmallButton>
                  <span
                    v-if="tooltip === 'du' + item.id"
                    class="text-base flex absolute ml-36 mt-8 p-2 rounded-lg truncate"
                  >
                    <svg viewBox="0 0 7 10">
                      <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                    </svg>
                    <span
                      class="mx-2 p-2 rounded-lg bg-white/70 text-slate-600"
                    >
                      Duplizieren
                    </span>
                  </span>
                </div>
              </div>
              <div
                v-if="this.hovering === index && !this.forDuplicate"
                @mouseover="this.tooltip = 'd' + item.id"
                @mouseleave="this.tooltip = ''"
              >
                <div
                  @click="
                    this.deleteRequest = true;
                    this.selected = index;
                  "
                  v-if="this.selected !== index"
                  class="mx-1 border-4 p-1 border-transparent rounded-lg 2xl:m-2 hover:border-red-500 w-fit"
                  :class="{
                    'border-red-500':
                      this.deleteRequest && this.selected === index,
                  }"
                >
                  <Icon iconName="delete" size="24" color="gray"></Icon>
                  <span
                    v-if="tooltip === 'd' + item.id"
                    class="text-base flex absolute p-2 rounded-lg truncate"
                  >
                    <svg viewBox="0 0 7 10">
                      <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                    </svg>
                    <span
                      class="mx-2 p-2 rounded-lg bg-white/70 text-slate-600"
                    >
                      Löschen
                    </span>
                  </span>
                </div>

                <div
                  class="flex items-center w-fit"
                  v-if="this.deleteRequest & (index === this.selected)"
                >
                  <div class="flex justify-start w-min">
                    <div
                      class="items-center flex w-fit cursor-pointer font-bold border-slate-300 hover:ml-0 hover:border-white border-2 hover:border-4 hover:font-extrabold rounded-lg px-2 mx-1 py-1"
                      @click="
                        this.$emit('delete-session', item.id);
                        this.reset();
                      "
                      @click.prevent="openConfig(item.id)"
                    >
                      <Icon iconName="delete" size="24" color="red"></Icon>
                      <span class="mx-1">Löschen</span>
                    </div>
                    <div
                      class="self-center font-bold border-slate-300 hover:mr-0 hover:border-white border-2 hover:border-4 hover:font-extrabold rounded-lg px-2 mx-1 py-1"
                      @click="reset()"
                      @click.prevent="openConfig(item.id)"
                    >
                      Abbrechen
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full ml-auto" @click.prevent="this.open(id)">
                <span v-if="mobile"
                  ><div
                    class="py-0.5 2xl:px-1.5 md:px-0.5 mx-2"
                    size=""
                    preset=""
                    @click.prevent="this.open(id)"
                  >
                    <SmallButton
                      preset="outline"
                      size=""
                      class="ml-auto py-0.5 px-1 bg-transparent hover:text-white"
                      @click.prevent="this.open(id)"
                      @touchstart="this.hovering = ''"
                      >Anzeigen</SmallButton
                    >
                  </div></span
                >
                <span v-else class="mx-6"></span>
              </div>
            </td>
          </tr>
          <!-- <tr class="rounded-b-lg">
          <div class="2xl:py-2 md:py-1"></div>
        </tr> -->

          <!-- <tr>
            <td colspan="4" v-if="true">
              <div
                class="flex justify-center 2xl:py-2 xl:py-2 px-3 md:pb-1 md:my-1"
              >
                <SmallButton
                  @click.stop="this.$router.push('/courses')"
                  @click="this.$router.push('/new-session')"
                  class="w-fit flex justify-center pl-4 pr-6 md:py-1.5"
                  size=""
                  color="white"
                >
                  <Icon
                    iconName="filePlus"
                    color="white"
                    size="32"
                    class="mr-3 w-12"
                  ></Icon
                  ><span class="md:text-base 2xl:text-lg w-fit mx-2"
                    >Neuer Termin</span
                  ></SmallButton
                >
              </div>
            </td>
          </tr> -->
        </tbody>
        <tr class="w-full" v-if="button">
          <td colspan="4" class="w-full mx-auto">
            <div
              class="flex justify-center 2xl:py-2 xl:py-2 px-3 md:pb-1 md:my-1 mx-auto"
            >
              <SmallButton
                @click.stop="this.$router.push('/courses')"
                @click="this.$router.push('/new-session')"
                class="w-fit flex justify-center pl-4 pr-6 md:py-1.5"
                size=""
                color="white"
              >
                <Icon
                  iconName="filePlus"
                  color="white"
                  size="32"
                  class="mr-3 w-12"
                ></Icon
                ><span class="md:text-base 2xl:text-lg w-fit mx-2"
                  >Neuer Termin</span
                ></SmallButton
              >
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Icon from "../interface-components/Icon.vue";
import SmallButton from "../interface-components/SmallButton.vue";
import { mapGetters } from "vuex";
import { uuid } from "vue-uuid";
import axios from "axios";
import { API_URL } from "../../config";
import BaseConfig from "../steps/BaseConfig.vue";
import CheckboxOption from "../form-components/CheckboxOption.vue";
import { format } from "date-fns";

export default {
  data() {
    return {
      loading: true,
      deleteRequest: false,
      selected: "",
      tooltip: "",
      duplicateCourse: false,
      hovering: "",
      blockOpen: true,
      hideOld: false,
      sortBy: "",
      showFilter: false,
    };
  },
  components: {
    Icon,
    SmallButton,
    BaseConfig,
    CheckboxOption,
  },
  props: {
    forDuplicate: { type: Boolean, default: false },
    color: String,
    icon: String,
    size: { type: String, default: "md" },
    button: { type: Boolean, default: true },
    data: {
      type: Array,
      default: () => [],
    },
    labels: Array,
    limit: { type: Number, default: 10 },
  },
  methods: {
    /**
     * Formats a given date into the specified format.
     *
     * @param {Date} date - The date to be formatted.
     * @return {string} The formatted date in the format "dd.MM.yyyy HH:mm".
     */
    format(date) {
      return format(date, "dd.MM.yyyy HH:mm");
    },
    /**
     * Toggles the value of showFilter property.
     *
     * @return {void}
     */
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    /**
     * Sets the hovering ID and toggles the blockOpen after a delay.
     *
     * @param {any} id - The ID to set as hovering.
     * @return {void} No return value.
     */
    openConfig(id) {
      console.log("open-config");
      this.hovering = id;

      this.blockOpen = false;
      setTimeout(() => {
        this.blockOpen = true;
      }, 300);
    },
    /**
     * Sets the hovering ID and emits a hover event if forDuplicate is true.
     *
     * @param {any} id - The ID to set as hovering.
     * @return {void} No return value.
     */
    handleEnter(id) {
      this.hovering = id;
      // TODO @Fabian: wirft Fehler, wenn in /new-session über Termine gehovert wird -> woher kommt das item
      this.forDuplicate ? this.$emit("hover", id) : "";
    },
    /**
     * Sets the ID to an empty string and emits a hover event if forDuplicate is true.
     *
     * @param {any} id - The ID to set to an empty string.
     * @return {void} No return value.
     */
    handleLeave(id) {
      this.hovering = "";
      if (this.forDuplicate) {
        this.$emit("hover", "");
      }
    },
    /**
     * Sets a duplicate session with a new ID and empty recorded cases.
     *
     * @param {any} id - The ID of the session to duplicate.
     * @return {void} No return value.
     */
    setDuplicate(id) {
      this.blockOpen = false;
      this.duplicateCourse = true;

      const newSession = this.getSessions.find((obj) => obj.id === id);
      newSession.id = uuid.v1();
      newSession.meta.recorded_cases = [];
      this.$store.commit("setNewSession", newSession);
      this.$store.commit("setCurrentSessionId", newSession.id);
    },
    /**
     * Duplicates a session by creating a new session with a new ID and empty recorded cases.
     *
     * @param {string} id - The ID of the session to duplicate.
     * @return {void} This function does not return anything.
     */
    duplicate(id) {
      let token = "";
      if (localStorage?.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      const newSession = this.getNewSession;

      if (newSession) {
        axios
          .post(API_URL + "/sessions", newSession, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    /**
     * Resets the selected value and the delete request flag.
     *
     * @return {void}
     */
    reset() {
      this.selected = "";
      this.deleteRequest = false;
    },
    /**
     * A method to force update the component.
     *
     * @return {void} No return value
     */
    forceUpdate() {
      this.$forceUpdate;
    },
    /**
     * Controls the opening behavior based on blockOpen, forDuplicate, and deleteRequest flags.
     *
     * @param {any} id - The ID to be opened.
     * @return {void} No return value.
     */
    open(id) {
      if (this.blockOpen) {
        if (this.forDuplicate) {
          this.$emit("open-config", id);
          console.log("open conf");
        } else if (!this.deleteRequest) {
          // open session
          this.$store.commit("setCurrentSessionId", id);
          this.$router.push({
            path: "/session/" + id,
          });
        }
      }
    },
    /**
     * A method to set the current session ID, set the tab state to the recording tab, and push a new route to "/session/{id}".
     *
     * @param {any} id - The ID of the session.
     * @return {void} No return value.
     */
    record(id) {
      this.$store.commit("setCurrentSessionId", id);
      this.$store.commit("setTabState", { tab: 2, important: true });
      this.$router.push({ path: "/session/" + id });
    },
  },

  computed: {
    /**
     * A method to return sorted data based on different sort criteria and filter out old data if required.
     *
     * @return {Array} The sorted and filtered data.
     */
    sortedData() {
      let data = this.data;
      if (this.sortBy === "dateDown") {
        data = this.data
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (this.sortBy === "dateUp") {
        data = this.data
          .slice()
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (this.sortBy === "nameDown") {
        data = this.data
          .slice()
          .sort((a, b) =>
            a.baseConfig.application_domain.localeCompare(
              b.baseConfig.application_domain
            )
          );
      } else if (this.sortBy === "nameUp") {
        data = this.data
          .slice()
          .sort((a, b) =>
            b.baseConfig.application_domain.localeCompare(
              a.baseConfig.application_domain
            )
          );
      }
      if (this.hideOld) {
        const currentDate = new Date();
        return data.filter((item) => new Date(item.date) >= currentDate);
      }
      return data;
    },

    data() {
      return this.data
        ? this.data
        : Array({
            id: "",
            name: "new Session!",
            type: "session",
            status: "new",
            date: new Date(),
            room_selected: "0",
            baseConfig: {
              application_domain: "y",
              subject_name: "y",
              subject_topic: "x",
              event_topic: "x",
            },
            roomConfig: {
              room_size: "roomsize1",
              room_echo: "echo1",
            },
            caseConfig: {
              case_name: "x",
              case_description: "x",
              case_notes: " ",
            },
            speakerConfig: {
              speaker1_name: "x",
              speaker1_role: "x",
              speaker2_name: "x",
              speaker2_role: "x",
              roles: [
                "Patient*in",
                "Arzt / Ärztin",
                "Hebamme",
                "Pfleger*in",
                "Physiotherapeut*in",
              ],
            },
            audioConfig: {
              mikro1_id: "1",
              mikro1_name: "Nr.1",
              mikro1_brand: "kp",
              mikro2_id: "2",
              mikro2_name: "Nr.2",
              mikro2_brand: "String",
            },
          });
    },
    /**
     * Determines if the current device is a mobile device.
     *
     * @return {boolean} Returns true if the current device is a mobile device, otherwise false.
     */
    mobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
    ...mapGetters({
      getSessions: "getSessions",
      getNewSession: "getNewSession",
      getBaseConfig: "getBaseConfig",
    }),
  },
};
</script>

<style>
@media screen and (min-width: 900px) {
  tbody {
    display: block;
    max-height: 500px;
    overflow-y: scroll;
  }
}

@media screen and (max-width: 1200px) {
  tbody {
    display: block;
    max-height: 380px;
    overflow-y: scroll;
  }
}

@media screen and (min-width: 1200px) and (max-width: 1600px) {
  tbody {
    display: block;
    max-height: 300px;
    overflow-y: scroll;
  }
}
</style>
