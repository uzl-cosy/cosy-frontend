<!--Configuration component: Base configuration including the course data as well as date and time-->
<template>
  <div class="flex items-start">
    <!-- Date configuration -->
    <div class="bg-sky-100 px-4 rounded-xl pt-4 pb-5 flex items-start">
      <div class="flex flex-col items-center justify-start my-6 mx-2">
        <span class="2xl:my-3 md:my-1 2xl:text-xl md:text-base font-bold"
          >Datum:
        </span>
        <SmallButton
          size=""
          preset="outlined"
          class="my-2 hover:bg-sky-200 flex items-center w-full justify-center"
          @click="setToday()"
        >
          heute
        </SmallButton>
        <SmallButton
          size=""
          preset="outlined"
          class="my-2 hover:bg-sky-200"
          @click="setTomorrow()"
        >
          morgen
        </SmallButton>
      </div>
      <div class="flex flex-col items-center">
        <VDatePicker
          v-if="this.showCalendar"
          mode="dateTime"
          is24hr
          class="2xl:my-4 md:my-2"
          v-model="selectedDate"
          @click="dateChanged"
        />
      </div>
    </div>
    <!-- Course configuration -->
    <div class="flex flex-col w-full ml-4">
      <div
        class="w-full md:max-w-m md:max-h-s h-fit bg-sky-100 rounded-xl 2xl:py-4 xl:py-6 md:py-0.5 px-10 flex flex-col justify-between"
      >
        <InputField
          name="Titel"
          id="2"
          @input="
            updateForm($event.target);
            this.$emit('data-changed', $event.target.value);
          "
          :model="this.editedData.subject_topic"
          :required="true"
        >
          Titel*</InputField
        >
        <InputField
          v-if="showSubject"
          id="0"
          name="anwendungsFach"
          @input="
            updateForm($event.target);
            this.$emit('data-changed', $event.target.value);
          "
          :model="this.editedData.application_domain"
          >Anwendungsfach</InputField
        >
        <InputField
          v-if="showModuleName"
          name="modulname"
          id="1"
          @input="
            updateForm($event.target);
            this.$emit('data-changed', $event.target.value);
          "
          :model="this.editedData.subject_name"
        >
          Modulname</InputField
        >

        <InputField
          v-if="showTopic"
          name="anwendungsThema"
          id="3"
          @input="
            updateForm($event.target);
            this.$emit('data-changed', $event.target.value);
          "
          :model="this.editedData.event_topic"
        >
          Thema (z.B. des Seminars oder Moduls)</InputField
        >
        <span class="flex flex-col justify-center text-sm -ml-3" v-if="showRoom"
          ><span class="text-slate-500 font-bold ml-5">Raum</span>
          <Combobox
            ref="roomSelection"
            :data="
              getRoomConfig
                ? getRoomConfig.rooms
                  ? getRoomConfig.rooms
                  : []
                : []
            "
            :selectedValue="
              getRoomConfig
                ? getRoomConfig.room_selected
                  ? getRoomConfig.room_selected
                  : ''
                : ''
            "
            @update-data="(data) => this.$store.commit('setRoom', data.name)"
          ></Combobox
        ></span>
        <!--Additional fields-->
        <div class="flex py-1 justify-center self-center">
          <span
            class="self-start -ml-2 mr-2 py-1.5 text-slate-500 font-bold"
            v-if="
              !this.showRoom ||
              !this.showTopic ||
              !this.showSubject ||
              !this.showModuleName
            "
            >Weiteres:</span
          >
          <div class="flex flex-col">
            <SmallButton
              v-if="!showSubject"
              size=""
              class="py-1 m-0.5"
              preset="outlined"
              @click="this.showSubject = true"
              ><Icon class="mr-2" size="12" iconName="plus"></Icon
              >Anwendungsfach</SmallButton
            >
            <SmallButton
              v-if="!showModuleName"
              size=""
              class="py-1 m-0.5"
              preset="outlined"
              @click="this.showModuleName = true"
              ><Icon class="mr-2" size="12" iconName="plus"></Icon
              >Modulname</SmallButton
            >
          </div>
          <div class="flex flex-col">
            <SmallButton
              v-if="!showTopic"
              size=""
              class="py-1 m-0.5"
              preset="outlined"
              @click="this.showTopic = true"
              ><Icon class="mr-2" size="12" iconName="plus"></Icon
              >Thema</SmallButton
            >
            <SmallButton
              v-if="!showRoom"
              size=""
              class="py-1 m-0.5"
              preset="outlined"
              @click="this.showRoom = true"
              ><Icon class="mr-2" size="12" iconName="plus"></Icon
              >Raum</SmallButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Icon from "../interface-components/Icon.vue";
import SmallButton from "../interface-components/SmallButton.vue";
import InputField from "../form-components/InputField.vue";
import { mapState, mapGetters } from "vuex";
import Combobox from "../form-components/Combobox.vue";

export default {
  name: "BaseConfig",
  components: {
    InputField,
    SmallButton,
    Icon,
    Combobox,
  },
  props: {
    showCalendar: { type: Boolean, default: true },
  },
  data() {
    return {
      showRoom: false,
      showTopic: false,
      showSubject: false,
      showModuleName: false,
      editedData: {
        application_domain: "",
        subject_topic: "",
        subject_name: "",
        event_topic: "",
        room_selected: "",
      },
      selectedDate: new Date(),
      room: "",
    };
  },
  methods: {
    /**
     * Formats a given date into a string representation using the German (de) locale.
     *
     * @param {Date} date - The date to be formatted.
     * @return {Intl.DateTimeFormat} - The formatted date string.
     */
    formatDate(date) {
      return new Intl.DateTimeFormat("de", {
        year: "numeric",
        month: "short",
        weekday: "long",
        day: "numeric",
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
        timeZone: "Europe/Berlin",
      });
    },
    /**
     * Updates the selected date to be tomorrow's date and commits the updated date to the store.
     *
     * @return {void}
     */
    setTomorrow() {
      let today = new Date();
      let tomorrow = today;
      this.selectedDate = new Date(tomorrow.setDate(today.getDate() + 1));
      this.$store.commit("setDate", this.selectedDate);
    },
    /**
     * A function that handles the change of date based on the selected date being null or not.
     *
     * @param {Event} e - The event triggering the date change.
     * @return {void} - No return value.
     */
    dateChanged(e) {
      if (this.selectedDate == null) {
        this.selectedDate = this.getCurrentSession.date;
      } else this.$store.commit("setDate", this.selectedDate);
    },
    /**
     * Updates the selected date to be the current date and commits the updated date to the store.
     *
     * @return {void}
     */
    setToday() {
      this.selectedDate = new Date();
      this.$store.commit("setDate", this.selectedDate);
    },
    /**
     * A function that checks the selected date against today's date and tomorrow's date and updates the respective flags.
     *
     * @return {void} No return value.
     */
    checkDate() {
      const today = new Date();
      const tomorrow = today;
      tomorrow.setDate(today.getDate() + 1);

      if (this.selectedDate == new Date()) {
        this.today = true;
      } else if ((this.selectedDate = tomorrow)) {
        this.tomorrow = true;
      }
    },
    /**
     * Updates the base configuration in the store with the given target.
     *
     * @param {Object} target - The target object containing the id and value to update.
     * @return {void}
     */
    updateForm(target) {
      var payload = [target.id, target.value];
      this.$store.commit("setBaseConfig", payload);
    },
    /**
     * Updates the room in the store with the provided target.
     *
     * @param {Object} target - The target object to set the room.
     * @return {void}
     */
    updateRoom(target) {
      this.$store.commit("setRoom", target);
    },
  },
  computed: {
    baseConfig() {
      return this.getBaseConfig;
    },
    /**
     * Check if the selected date is today.
     *
     * @return {boolean} true if selected date is today, false otherwise
     */
    today() {
      let today = new Date();
      console.log(today);

      if (this.selectedDate == today) {
        return true;
      } else return false;
    },
    /**
     * A description of the entire function.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    tomorrow() {
      const tom = new Date();
      const tod = new Date();
      tom.setDate(tod.getDate() + 1);
      for (var i = 0; i < 10; i++) {
        if (this.selectedDate[i] != tom[i]) return false;
      }
      return true;
    },
    /**
     * Retrieves all sessions from the Vuex store.
     *
     * @return {Array} An array of session objects.
     */
    sessions() {
      return this.$store.getters.getAllSessions;
    },
    /**
     * Returns the current session.
     *
     * @return {Object} The current session object.
     */
    session() {
      return this.getCurrentSession;
    },
    ...mapState(["currentSession"]),
    ...mapGetters({
      getSpeakers: "getSpeakers",
      getBaseConfig: "getBaseConfig",
      getCurrentSession: "getCurrentSession",
      getRoomConfig: "getRoomConfig",
      getAllSessions: "getAllSessions",
    }),
  },
  mounted() {
    this.editedData = this.baseConfig;

    // check if there is data in the store
    if (this.getBaseConfig.application_domain !== "") {
      this.showSubject = true;
    }

    if (this.getBaseConfig.event_topic !== "") {
      this.showTopic = true;
    }
    if (this.getBaseConfig.subject_name !== "") {
      this.showModuleName = true;
    }
    this.room = this.getCurrentSession;
    if (this.getRoomConfig.room_selected !== "") {
      this.showRoom = true;
    }

    this.selectedDate = this.getCurrentSession.date;
  },
};
</script>
