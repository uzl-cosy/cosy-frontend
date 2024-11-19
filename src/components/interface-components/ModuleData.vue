<!--Information Component: ModuleData.vue shows module data of the session-->
<template>
  <div
    class="text-sm text-primary flex items-center justify-center w-fit mx-auto bg-white"
  >
    <div
      class="w-full text-primary mx-auto flex items-center border-b-2 py-4 ml-auto"
      v-if="getWidth <= 777 && visible && false"
    >
      <div class="flex flex-col items-center ml-auto w-full">
        <p v-if="hasRecordData" class="flex justify-between">
          <strong class="mr-2">Titel:</strong> adfas
          <!-- {{ getCurrentFeedback.meta.recordData.subject_topic }} -->
        </p>
        <p v-if="hasRecordData" class="flex justify-between">
          <strong class="mr-2">Modulname:</strong>sdsf
          <!-- {{ getCurrentFeedback.meta.recordData.subject_name }} -->
        </p>
        <p v-if="hasRecordData" class="flex justify-between">
          <strong class="mr-2">Anwendungsfach:</strong>sdf
          <!-- {{ getCurrentFeedback.meta.recordData.application_domain }} -->
        </p>
        <p v-if="hasRecordData" class="flex justify-between">
          <strong class="mr-2">Thema:</strong>sdf
          <!-- {{ getCurrentFeedback.meta.recordData.event_topic }} -->
        </p>
        <p v-else>Keine Moduldaten vorhanden</p>
      </div>
      <Icon
        iconName="close"
        class="self-start ml-auto cursor-pointer"
        @click="visible = !visible"
      ></Icon>
    </div>

    <div
      class="flex flex-col w-fit items-end mx-4 self-end right-0 ml-auto mb-auto mt-1"
    >
      <SmallButton
        @click="toggle"
        class="font-bold text-base flex items-center cursor-pointer border-2 rounded-lg p-1.5"
        :class="{
          '  ': visible && getWidth >= 777,
          ' flex-col -mb-12 items-center py-1.5 px-2': getWidth <= 777,
        }"
        preset="outlined"
        size=""
      >
        <Icon iconName="study"></Icon>
        <Icon iconName="close" v-if="visible && getWidth <= 777"></Icon>

        <span class="pl-2"> {{ getWidth >= 777 ? "Metadaten" : "" }}</span>
        <Icon
          v-if="!visible && getWidth >= 777"
          iconName="chevronLeft"
          class="mx-1 pointer-events-auto"
        ></Icon
        ><Icon
          v-else-if="getWidth >= 777"
          iconName="chevronDown"
          class="mx-1 pointer-events-auto"
        ></Icon
      ></SmallButton>
      <div
        class="rounded-lg border-2 w-fit px-4 py-1 absolute z-20 bg-white flex"
        :class="{
          'mt-14': getWidth >= 777,
          'mt-9': visible && getWidth >= 777,
          'top-16': !visible && getWidth <= 777,
        }"
        v-if="visible && getWidth >= 777"
      >
        <div class="w-full">
          <p class="flex justify-between py-1">
            <strong class="mr-2">Aufnahemdatum:</strong>
            {{ formatDate(getCurrentFeedback.meta.edit_date) }}
          </p>
          <p v-if="hasRecordData" class="flex justify-between">
            <strong class="mr-2">Titel:</strong> Hier Titel
            {{
              getCurrentFeedback
                ? getCurrentFeedback.meta
                  ? getCurrentFeedback.meta.recordData
                    ? getCurrentFeedback.meta.recordData.subject_topic
                      ? getCurrentFeedback.meta.recordData.subject_topic
                      : ""
                    : ""
                  : ""
                : ""
            }}
          </p>

          <p v-if="hasRecordData" class="flex justify-between">
            <strong class="mr-2">Modulname:</strong>
            {{ getCurrentFeedback.meta.recordData.subject_name }}
          </p>
          <p v-if="hasRecordData" class="flex justify-between">
            <strong class="mr-2">Anwendungsfach:</strong>
            {{ getCurrentFeedback.meta.recordData.application_domain }}
          </p>
          <p v-if="hasRecordData" class="flex justify-between">
            <strong class="mr-2">Thema:</strong>
            {{ getCurrentFeedback.meta.recordData.event_topic }}
          </p>
          <p v-else class="p-2">Keine weiteren Moduldaten vorhanden</p>
        </div>
        <div class="flex flex-col w-full items-start mx-5">
          <RoleLegend
            :color="
              getFeedbackSpeakers
                ? getFeedbackSpeakers[0].color
                  ? getFeedbackSpeakers[0].color
                  : ''
                : ''
            "
            :name="
              getFeedbackSpeakers
                ? getFeedbackSpeakers[0]?.role
                  ? getFeedbackSpeakers[0].role
                  : ''
                : ''
            "
            :role="
              getFeedbackSpeakers
                ? getFeedbackSpeakers[0].role
                  ? getFeedbackSpeakers[0].role
                  : ''
                : ''
            "
            :nugget="
              getFeedbackSpeakers
                ? getFeedbackSpeakers[0].name
                  ? getFeedbackSpeakers[0].name
                  : ''
                : ''
            "
          ></RoleLegend>

          <RoleLegend
            :color="
              getFeedbackSpeakers
                ? getFeedbackSpeakers[1].color
                  ? getFeedbackSpeakers[1].color
                  : ''
                : ''
            "
            :name="
              getFeedbackSpeakers
                ? getFeedbackSpeakers[1].role
                  ? getFeedbackSpeakers[1].role
                  : ''
                : ''
            "
            :role="
              getFeedbackSpeakers
                ? getFeedbackSpeakers[1].role
                  ? getFeedbackSpeakers[1].role
                  : ''
                : ''
            "
            :nugget="
              getFeedbackSpeakers
                ? getFeedbackSpeakers[1].name
                  ? getFeedbackSpeakers[1].name
                  : ''
                : ''
            "
          ></RoleLegend>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { mapGetters } from "vuex";
import Icon from "./Icon.vue";
import SmallButton from "./SmallButton.vue";
import RoleLegend from "./RoleLegend.vue";

export default {
  components: { Icon, SmallButton, RoleLegend },
  data() {
    return {
      visible: false,
      width: window.innerWidth,
    };
  },
  methods: {
    /**
     *  Formats a given date according to the German date format.
     *
     * @param {string | number | Date} inputDate - The date to format.
     * @return {string} The formatted date.
     */ formatDate(inputDate: string | number | Date) {
      const date = new Date(inputDate);

      // Create a formatter for German date format
      const formatter = new Intl.DateTimeFormat("de-DE");

      // Format the date
      const formattedDate = formatter.format(date);
      return formattedDate;
    },

    toggle() {
      this.visible = !this.visible;
      this.$emit("toggle-visible", this.visible);
    },
  },

  computed: {
    ...mapGetters([
      "getCurrentData",
      "getCurrentFeedback",
      "getFeedbackSpeakers",
    ]),
    /**
     * Returns true if the current feedback has record data (i.e. the event topic, subject name,
     * and subject topic are all set), false otherwise.
     * @returns {boolean} - True if there is record data, false otherwise.
     */
    hasRecordData() {
      return (
        this.getCurrentFeedback &&
        this.getCurrentFeedback.meta &&
        this.getCurrentFeedback.meta.recordData
      );
    },
    /**
     * Returns the current width of the window.
     * @returns {number} - The width of the window in pixels.
     */
    getWidth() {
      return this.width;
    },
  },
};
</script>
<style>
@media screen and (max-width: 768px) {
  .mobile-header {
    visibility: hidden;
  }
}
</style>
