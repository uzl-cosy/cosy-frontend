<!--FEEDBACK COMPONENT: Transcript containing filter options, transcript chunks, pauses and overlaps-->
<template>
  <div
    class="h-full flex flex-col font-medium 2xl:text-base xl:text-sm text-sky-600 pt-2 border-slate-400 border-2 rounded-lg px-2"
  >
    <!-- HEADER with LEGEND -->
    <div class="flex flex-col w-full px-4 2xl:py-1 py-0 rounded-2xl">
      <div class="flex flex-row justify-between items-center">
        <span
          class="2xl:text-xl xl:text-base text-ocean-dark font-bold sm:mr-0 py-3 w-fit"
        >
          Generiertes Transkript
        </span>
        <div class="mr-auto self-start">
          <!-- Legend -->
          <InfoArea
            alignIcon="left"
            class="my-0 w-auto pointer-events-auto cursor-pointer xl:my-0 absolute"
            size="1"
          >
            <span class="font-extrabold text-sm"
              >Legende der Hervorhebungen </span
            ><br />
            <span class="underline text-cyan-800 font-light text-xs"
              >Begriffe, die genannt werden sollten </span
            ><br />
            <span class="underline text-orange font-light text-xs"
              >Begriffe, die nicht genannt werden sollten.</span
            >
          </InfoArea>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-2xl px-4 overflow-hidden flex flex-col">
      <div
        class="flex flex-col justify-center border-t-2 border-b-2 2xl:text-xl xl:text-base my-0 mr-0"
      >
        <div class="flex flex-row">
          <div class="flex" :class="{ 'flex-col': showFilter }">
            <span
              class="mx-0 mb-1 border-2 mt-2 hover:bg--100 p-2 rounded-lg flex flex-col self-start"
              @click="this.showFilter = !this.showFilter"
              :class="{
                'border-[#00617a]': this.showFilter,
                'border-transparent': !this.showFilter,
              }"
              ><Icon iconName="filter" class="p-0"></Icon>
            </span>

            <span
              v-if="audioData"
              class="mx-0 mb-1 mt-2 hover:bg--100 p-2 border-2 flex flex-col self-start rounded-xl cursor-pointer"
              :class="{
                'border-[#00617a]': this.audioActive,
                'border-transparent': !this.audioActive,
              }"
              @click="this.audioActive = !this.audioActive"
            >
              <Icon iconName="wave" class="p-0"></Icon>
            </span>
          </div>

          <div class="flex flex-col mb-1 mt-2 w-full">
            <div class="flex justify-between mr-4">
              <div
                class="flex flex-col w-fit items-center ml-auto text-base mr-3"
              >
                <div class="flex flex-col" v-if="searchQuery.length > 1">
                  <span class="flex whitespace-nowrap"
                    >Ergebnisse:
                    <p class="mx-1.5 font-bold">
                      {{ this.foundIndices.indexOf(this.currentIndex) + 1 }} von
                      {{ this.foundIndices.length }}
                    </p></span
                  >
                  <!--Navigate through search results-->
                  <span class="flex self-end mr-2"
                    ><Icon
                      iconName="chevronLeft"
                      color="gray"
                      @click="scrollToSection(-1, 'navigate')"
                    ></Icon>

                    <Icon
                      iconName="chevronRight"
                      color="gray"
                      @click="scrollToSection(+1, 'navigate')"
                    ></Icon
                  ></span>
                </div>
              </div>
              <div class="flex items-center">
                <input
                  class="rounded mx-2 my-1 py-1.5"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Suche"
                />
                <Icon
                  v-if="searchQuery.length === 0"
                  iconName="search"
                  color="gray"
                  class="-ml-11"
                ></Icon>
                <Icon
                  v-else
                  iconName="close"
                  color="gray"
                  class="-ml-11"
                  @click="this.searchQuery = ''"
                ></Icon>
              </div>

              <!-- </div> -->
            </div>
            <div v-if="showFilter" class="flex flex-row mt-2 pl-2">
              <!-- Pause Options-->
              <CheckboxOption
                class="mr-14"
                @new-input="(e) => (this.showPauses = e)"
                v-if="showFilter"
                label="Pausen"
                v-model="showPauses"
              >
              </CheckboxOption>
              <FeedbackTranscriptFilterOptions
                class="flex flex-col mb-0 mt-2 ml-2"
                v-if="showFilter && showPauses"
                @filter-option="(e) => setDuration(e, 'pause')"
                :label="'pause'"
                :preselected="pauseDuration"
                :options="[
                  { label: 'Alle', value: 0 },
                  { label: '> 1Sek.', value: 1 },
                  { label: '> 2Sek.', value: 2 },
                  { label: '> 3Sek.', value: 3 },
                ]"
              >
              </FeedbackTranscriptFilterOptions>
            </div>

            <!-- Overlap Option -->
            <div
              v-if="showFilter"
              class="flex flex-row pl-2 mb-2 mt-2 max-w-16"
            >
              <div class="flex flex-row h-full px-0 py-0 rounded-2xl">
                <CheckboxOption
                  class="mr-3"
                  @new-input="(e) => (this.showOverlaps = e)"
                  v-if="showFilter"
                  label="Gleichzeitiges Sprechen"
                  v-model="showOverlaps"
                ></CheckboxOption>
              </div>

              <FeedbackTranscriptFilterOptions
                class="mb-2 mt-1 ml-2"
                v-if="showFilter && showOverlaps"
                @filter-option="(e) => setDuration(e, 'overlaps')"
                :label="'overlaps'"
                :preselected="overlapsDuration"
                :options="[
                  { label: 'Alle', value: 0 },
                  { label: '> 2Sek.', value: 2 },
                  { label: '> 4Sek.', value: 4 },
                  { label: '> 6Sek.', value: 6 },
                ]"
              >
              </FeedbackTranscriptFilterOptions>
            </div>
            <div class="flex pl-2">
              <div class="flex h-full px-0 py-0 rounded-2xl">
                <CheckboxOption
                  class="mr-3"
                  @new-input="(e) => (this.syncTranscriptAndAudio = e)"
                  v-if="showFilter"
                  label="Springe im Transkript zu Audio"
                  v-model="syncTranscriptAndAudio"
                ></CheckboxOption>
              </div>
            </div>
          </div>
        </div>
        <!-- Audioplayer -->
        <div class="flex" v-if="audioActive">
          <AudioPlayer @updateAudioData="handleAudioUpdate"></AudioPlayer>
        </div>
      </div>
      <div
        class="overflow-y-scroll 2xl:px-1 xl:pl-6 w-full py-1 scroll-smooth pb-12"
        ref="transcriptContainer"
      >
        <div class="h-auto">
          <div class="h-full px-2 pr-4">
            <div
              v-for="(val, index) in content"
              :key="index"
              class="transcript-section"
            >
              <div class="flex w-full items-start"></div>
              <!--Pause Element-->
              <FeedbackTranscriptPause
                v-if="
                  Math.floor(val.timeStart - prevItem(index).timeEnd) >=
                    pauseDuration && showPauses
                "
                :time-start="val.timeStart"
                :time-end-prev-item="prevItem(index).timeEnd"
                :last-time-i-minus-one="prevItem(index - 1).timeEnd"
                :last-time-i-in-m-m-s="toMMSS(prevItem(index).timeEnd)"
                :time-precise="timePrecise"
              ></FeedbackTranscriptPause>

              <!--Overlap Element-->
              <FeedbackTranscriptOverlap
                v-if="
                  Math.floor(prevItem(index).timeEnd - val.timeStart) >=
                    overlapsDuration && showOverlaps
                "
                :time-start="val.timeStart"
                :time-end-prev-item="prevItem(index).timeEnd"
                :last-time-i-minus-one="prevItem(index - 1).timeEnd"
                :last-time-i-in-m-m-s="toMMSS(prevItem(index).timeEnd)"
                :time-precise="timePrecise"
              >
              </FeedbackTranscriptOverlap>
              <FeedbackTranscriptChunk
                class="cursor-pointer"
                :chunkIndex="index"
                @scroll-to-highlighted="
                  (e) => {
                    if (!this.scrollBlocker) this.scrollToSection(e, 'search');
                  }
                "
                v-if="val.speakerId !== -1"
                @click="this.$store.commit('setCurrentTime', val.timeStart)"
                :is-speaker-one="val.speakerId === '1'"
                :color="this.getSpeakerById(val.speakerId).color"
                :name="this.getSpeakerById(val.speakerId).role"
                :role="this.getSpeakerById(val.speakerId).role"
                :isActive="
                  (this.getCurrentDataPoint > val.timeStart &&
                    this.getCurrentDataPoint < val.timeEnd) ||
                  this.isActiveAudioTimeSlot(
                    index,
                    val.timeStart,
                    val.timeEnd
                  ) ||
                  index == this.currentIndex
                "
                :searchQuery="this.searchTerm"
                :timeStart="toMMSS(val.timeStart)"
                :time-end="toMMSS(val.timeEnd)"
                :nugget="val.value"
                :before_time="prevItem(index).timeEnd"
                :showMiliSec="showMiliSec"
                :isFirst="val.speakerId !== prevSpeaker(index) || index === 0"
                :highlightTerm="val.keywords ? val.keywords : null"
              ></FeedbackTranscriptChunk>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "../../components/interface-components/Icon.vue";
import FeedbackTranscriptChunk from "../../components/feedback-components/FeedbackTranscriptChunk.vue";
import CheckboxOption from "../../components/form-components/CheckboxOption.vue";
import { mapState, mapGetters } from "vuex";
import FeedbackTranscriptPause from "./FeedbackTranscriptPause.vue";
import FeedbackTranscriptOverlap from "./FeedbackTranscriptOverlap.vue";
import FeedbackTranscriptFilterOptions from "./FeedbackTranscriptFilterOptions.vue";
import InfoArea from "../interface-components/InfoArea.vue";
import AudioPlayer from "../../components/record-components/AudioPlayer.vue";
import { API_URL } from "../../config";

export default {
  name: "FeedbackTranscript",
  components: {
    InfoArea,
    FeedbackTranscriptFilterOptions,
    FeedbackTranscriptOverlap,
    FeedbackTranscriptPause,
    Icon,
    FeedbackTranscriptChunk,
    CheckboxOption,
    AudioPlayer,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },

    // content: { type: Array, default: [] },
    transcripts: { type: Array, default: [] },
  },
  data() {
    return {
      speakers: [],
      scrollBlocker: false,
      currentIndex: 0,
      searchTimer: 100,
      searchTerm: "",
      foundIndices: [],
      content: [],
      showFilter: false,
      searchQuery: "",
      showPauses: false,
      pauseDuration: 0,
      showOverlaps: false,
      overlapsDuration: 0,
      syncTranscriptAndAudio: false,
      showMiliSec: false,
      metadata: "",
      combinedTranscript: [],
      dataPoint: this.getCurrentDataPoint,
      transcript: [],
      audioActive: false,
      audioData: false,
    };
  },

  methods: {
    /**
     * Fetches the audio file from the server to show or hide audio Icon
     *
     * @param {number} id - The id of the audio file to fetch and play.
     * @return {void} This function does not return a value.
     */
    loadAndPlayAudio(id) {
      let token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      fetch(API_URL + "/audio/" + id, {
        method: "HEAD", // HEAD request checks if the file exists without downloading it
        headers: new Headers({
          Authorization: "Bearer " + token,
        }),
        mode: "cors",
        cache: "default",
      })
        .then((response) => {
          if (response.ok) {
            // File exists
            this.audioData = true;
          } else {
            // No file exists
            throw new Error("No audio data found.");
            this.audioData = false;
          }
        })
        .catch((error) => {
          console.error("There was a problem checking the audio data:", error);
          this.audioData = false;
        });
    },

    /**
     * Update foundIndices based on child component
     *
     * @param {number} index - The index to update foundIndices
     */
    updatefoundIndices(index) {
      if (!this.foundIndices.includes(index)) this.foundIndices.push(index);
    },

    /**
     * Checks if the given index is within the specified time range.
     *
     * @param {number} index - The index to check.
     * @param {number} timeStart - The start time of the range.
     * @param {number} timeEnd - The end time of the range.
     * @return {boolean} True if the index is within the time range, false otherwise.
     */
    isActiveAudioTimeSlot(index, timeStart, timeEnd) {
      // console.log(this.getCurrentAudioTime, timeStart, timeEnd)
      if (
        this.getCurrentAudioTime > timeStart &&
        this.getCurrentAudioTime < timeEnd
      ) {
        if (this.syncTranscriptAndAudio) this.scrollToSection(index, "jump");
        return true;
      }
      return false;
    },

    /**
     * Updates the pauseDuration or overlapsDuration property based on the provided event and label.
     *
     * @param {Object} e - The event object containing the label and newValue properties.
     * @param {string} label - The label used to determine which property to update.
     * @return {void} This function does not return a value.
     */
    setDuration(e, label) {
      if (e.label === label && label === "pause") {
        this.pauseDuration = e.newValue.value;
      } else if (e.label === label && label === "overlaps") {
        this.overlapsDuration = e.newValue.value;
      } else {
        console.error("unexpected state", e);
      }
    },

    /**
     * Combines both speakers transcript arrays to an combinedArray and adds the speakerId to each
     * content chunk outputs an array sorted by timeStart
     *
     * @return {Array} The combined array of content objects sorted by timeStart
     */
    combineTranscript() {
      const combinedArray = [];

      const wordFreqSpeaker_1 = [];
      const wordFreqSpeaker_2 = [];
      this.getCurrentData.words.speakers.forEach((speaker) => {
        if (speaker.speakerId === "1") {
          speaker.data.forEach((dataItem) => {
            wordFreqSpeaker_1.push(dataItem.keywords);
          });
        } else {
          speaker.data.forEach((dataItem) => {
            wordFreqSpeaker_2.push(dataItem.keywords);
          });
        }
      });
      this.transcripts.forEach((transcript) => {
        for (let [index, transcriptElement] of Object.entries(
          transcript.content
        )) {
          transcriptElement.speakerId = transcript.speakerId;
          transcriptElement.speakerIndex = index;
          combinedArray.push(transcriptElement);
        }
      });
      combinedArray.sort(
        (a, b) => parseFloat(a.timeStart) - parseFloat(b.timeStart)
      );

      this.getCurrentData.words.speakers.forEach((speaker, i) => {
        speaker.data.forEach((nlpChunk, j) => {
          const matchingSentences = combinedArray.filter((element) => {
            return (
              parseInt(element.speakerId) === i + 1 &&
              element.timeStart + this.getTranscript.minTimestamp >=
                nlpChunk.recordTimestamp &&
              element.timeEnd + this.getTranscript.minTimestamp <
                nlpChunk.recordTimestamp + 30
            );
          });
          matchingSentences.forEach((sentence, k) => {
            sentence.keywords = nlpChunk.keywords[k];
          });
        });
      });
      return combinedArray;
    },

    /**
     * Highlight matches in the text based on the query.
     *
     * @param {string} text - The text to be highlighted
     * @param {string} query - The query to match in the text
     * @return {object} An object containing the highlighted text and the count of matches
     */
    highlightMatch(text, query) {
      if (!query) {
        return text;
      }

      const regex = new RegExp(query, "ig");
      let count = 0;
      const highlightedText = text.replace(regex, (match) => {
        count++;
        return `<span class="highlight">${match}</span>`;
      });

      return { highlightedText, count };
    },
    /**
     * Scrolls to a specific section based on the provided index and navigation command 'jump' or 'search'.
     *
     * @param {number} index - The index of the section to scroll to.
     * @param {string} navCommand - The navigation command specifying the type of scroll operation.
     */
    scrollToSection(index, navCommand) {
      let myIndex = index;

      if (navCommand == "search") {
        if (this.foundIndices.includes(index)) {
          this.scrollBlocker = true;
        }
        // save all indices of the search result
        this.updatefoundIndices(index);

        if (!this.foundIndices) {
          setTimeout(() => {
            // scroll to the first found index
            if (this.foundIndices.length === 0) return;
            this.currentIndex = this.foundIndices[0];
            myIndex = this.foundIndices[0];
            // Calculate the scroll position based on the target section's position
            const container = this.$refs.transcriptContainer;

            const targetSection = container.querySelectorAll(
              ".transcript-section"
            )[myIndex];

            if (targetSection) {
              // Calculate the scroll position
              const scrollPosition =
                targetSection.offsetTop - container.offsetTop - 100;

              // Apply smooth scrolling effect
              container.scrollTo({
                top: scrollPosition,
                behavior: "smooth",
              });
            }
          }, 1000);
        } else {
          if (this.foundIndices.length === 0) return;

          myIndex = this.foundIndices[0];
          this.currentIndex = this.foundIndices[0];

          const container = this.$refs.transcriptContainer;

          const targetSection = container.querySelectorAll(
            ".transcript-section"
          )[myIndex];

          if (targetSection) {
            // Calculate the scroll position
            const scrollPosition =
              targetSection.offsetTop - container.offsetTop - 100;

            // Apply smooth scrolling effect
            container.scrollTo({
              top: scrollPosition,
              behavior: "smooth",
            });
          }
        }
      } else if (navCommand == "navigate") {
        // naviagte to the next or previous found index
        if (this.foundIndices.length === 0) return;
        let myIndex = 0;
        if (index < 0 && this.foundIndices.indexOf(this.currentIndex) === 0) {
          myIndex = this.foundIndices[this.foundIndices.length - 1];
          this.currentIndex = myIndex;
        } else if (
          index > 0 &&
          this.currentIndex === this.foundIndices[this.foundIndices.length - 1]
        ) {
          myIndex = this.foundIndices[0];
          this.currentIndex = myIndex;
        } else {
          let newIndex = 0;
          if (index === -1) {
            newIndex = this.foundIndices.indexOf(this.currentIndex) - 1;
          } else if (index === +1) {
            newIndex = this.foundIndices.indexOf(this.currentIndex) + 1;
          }
          myIndex = this.foundIndices[newIndex];
          this.currentIndex = myIndex;
        }

        // Calculate the scroll position based on the target section's position
        const container = this.$refs.transcriptContainer;
        const targetSection = container.querySelectorAll(".transcript-section")[
          myIndex
        ];

        if (targetSection) {
          // Calculate the scroll position
          const scrollPosition =
            targetSection.offsetTop - container.offsetTop - 100;

          // Apply smooth scrolling effect
          container.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }
      } else if (navCommand == "jump") {
        // Calculate the scroll position based on the target section's position
        const container = this.$refs.transcriptContainer;
        let i = null;
        let chunk = this.content.find((obj, objIndex) => {
          i = objIndex;
          return obj.timeStart <= myIndex && obj.timeEnd >= index;
        });
        const targetSection = container.querySelectorAll(".transcript-section")[
          index
        ];

        if (targetSection) {
          // Calculate the scroll position
          const scrollPosition =
            targetSection.offsetTop - container.offsetTop - 100;

          // Apply smooth scrolling effect
          container.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    },

    /**
     * Asynchronously reloads the data by updating metadata and speakers, then forces a component update after the next DOM update cycle.
     *
     * @return {Promise<void>}
     */
    async reload() {
      this.metadata = this.getFeedback.metadata;
      this.speakers = this.getFeedbackSpeakers;

      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    getSpeakerById(id) {
      // console.log("speaker", this.getCurrentFeedback.meta.speakers);
      // console.log("is", id);

      const speaker = this.getCurrentFeedback.meta.speakers.find(
        (speaker) => speaker.id === id
      );
      return speaker
        ? speaker
        : { name: "Sprecher*in", role: "Rolle", id: "", color: "#000000" };
    },
    /**
     * Toggles the display of milliseconds in the time shown.
     *
     * @return {void}
     */
    showTimePrecise() {
      this.showMiliSec = !this.showMiliSec;
    },
    /**
     * Returns the speaker ID of the previous item in the content array, if it exists.
     *
     * @param {number} i - The index of the current item in the content array.
     * @return {string|undefined} The speaker ID of the previous item, or undefined if there is no previous item.
     */
    prevSpeaker(i) {
      if (i > 0) return this.content[i - 1].speakerId;
    },
    /**
     * Converts the input time in seconds to a formatted string in MM:SS format with optional milliseconds.
     *
     * @param {number|string} input - The input time in seconds or a string representation of time.
     * @return {Array<string>} An array containing two strings: the first string is the formatted time in the format of MM:SS, and the second string is the formatted time in the format of milliseconds.
     */
    toMMSS(input) {
      if (typeof input != "number") var sec_num = parseInt(input, 10);
      else sec_num = input;
      let milsec = "";
      for (let i = 0; i < 2; i++) {
        milsec += input[input.length - i - 1];
        if (input[input.length - i - 1] == ".") {
          break;
        }
      }
      let hours = Math.floor(sec_num / 3600);
      let minutes = Math.floor(sec_num / 60);
      let seconds = Math.round(sec_num - hours * 3600 - minutes * 60);

      if (hours < 10 && hours != 0) {
        hours = "0" + hours + ":";
      }
      if (hours == 0) hours = "";

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + Math.round(seconds);
      }
      if (milsec != "") milsec = ":" + milsec;

      return Array(minutes + ":" + seconds, " " + milsec);
    },
    /**
     * Returns the previous item in the content array, if it exists.
     *
     * @param {number} i - The index of the current item in the content array.
     * @return {type} The item at the previous index, or 0 if there is no previous item.
     */
    prevItem(i) {
      if (i >= 1) {
        return this.content[i - 1];
      } else return 0;
    },
  },
  computed: {
    /**
     * Returns a filtered array of the transcript items based on a search query.
     *
     * @return {Array} An array of transcript items that match the search query.
     */
    filteredTranscript() {
      const query = this.searchQuery.toLowerCase();
      return this.content.filter((val) =>
        val.value.toLowerCase().includes(query)
      );
    },

    /**
     * Returns a function that retrieves a speaker object from the current feedback's meta speakers array
     * based on the provided speaker id.
     *
     * @param {number} id - The id of the speaker to retrieve.
     * @return {object|null} The speaker object with the matching id, or null if no speaker is found.
     */
    getSpeaker() {
      return (id) => {
        return this.getCurrentFeedback.meta.speakers.find(
          (elem) => elem.id === id
        );
      };
    },
    timePrecise() {
      return this.showMiliSec;
    },
    ...mapState(["currentFeedback"]),
    ...mapGetters({
      getFeedbackSpeakers: "getFeedbackSpeakers",
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getSpeakerRoles: "getSpeakerRoles",
      getSpeakerConfig: "getSpeakerConfig",
      getCurrentDataPoint: "getCurrentDataPoint",
      getTranscript: "getTranscript",
      getFeedbackMeta: "getFeedbackMeta",
      getFeedback: "getFeedback",
      getCurrentFeedback: "getCurrentFeedback",

      getCurrentAudioTime: "getCurrentAudioTime",
      getCurrentData: "getCurrentData",
    }),
  },
  watch: {
    /**
     * Updates the search query term and performs a search operation.
     *
     * This function is triggered whenever the `searchQuery` property changes. It resets the `foundIndices` array,
     * sets `scrollBlocker` to `false`, and resets `searchTerm` and `currentIndex` to their default values.
     *
     * If the length of `searchQuery` is greater than 1, it assigns the value of `searchQuery` to `searchTerm`. This means to prevent multiple searches in the same query.
     *
     * @return {void} This function does not return anything.
     */
    searchQuery() {
      this.foundIndices = [];
      this.scrollBlocker = false;
      this.searchTerm = "";
      this.currentIndex = null;
      if (this.searchQuery.length > 1) {
        this.searchTerm = this.searchQuery;
      }
    },

    /**
     * Finds the index of the element in the `content` array matching the dataPoint (whose `timeStart` and `timeEnd` values enclose the `newValue`).
     * If found, it calls `scrollToSection` with the index and the command "jump".
     *
     * @param {any} newValue - The new value to search for in the `content` array.
     * @param {any} oldValue - The previous value of `newValue`.
     * @return {void} This function does not return anything.
     */
    getCurrentDataPoint(newValue, oldValue) {
      if (newValue !== oldValue) {
        const myIndex = this.content.findIndex((obj) => {
          return obj.timeStart <= newValue && obj.timeEnd >= newValue;
        });
        if (myIndex !== -1) {
          // Scroll to the section based on the new value of getCurrentDataPoint
          this.scrollToSection(myIndex, "jump");
        }
      }
    },
  },
  mounted() {
    this.metadata = this.getFeedback.metadata;

    this.speakers = this.getFeedbackSpeakers;
    this.loadAndPlayAudio(this.getCurrentFeedback.id);
  },
  created() {
    this.speakers = this.getFeedbackSpeakers;
    // this.loadAndPlayAudio(this.getCurrentFeedback.id);

    this.content = this.combineTranscript();
  },
};
</script>
