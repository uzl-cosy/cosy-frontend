<!--Feedback Component: FeedbackKeywords.vue shows the keywords and their count -->
<template>
  <div class="flex flex-col w-full h-full mb-12">
    <div class="flex flex-row self-end" :class="{ '-mt-9': isCard }">
      <div>
        <div class="flex flex-row self-end mr-2 mb-2">
          <div>
            <div
              class="flex flex-col rounded-lg bg-sky-100 pr-5 -mr-4"
              v-if="this.showFilter"
            >
              <!-- Filter for  wordGroup -->
              <div class="flex items-center font-bold">
                <span class="text-sm ml-2">Wortarten:</span>

                <FeedbackTranscriptFilterOptions
                  class="flex flex-col"
                  @filter-option="(e) => setWordGroup(e, 'keywords')"
                  :label="'keywords'"
                  :options="[
                    { label: 'Alle', value: 0 },
                    { label: 'Nomen', value: 1 },
                    { label: 'Verben', value: 2 },
                    { label: 'Adjektive', value: 3 },
                  ]"
                >
                </FeedbackTranscriptFilterOptions>
              </div>
              <!-- Filter for wordsCount -->
              <div class="flex items-center font-bold">
                <span class="text-sm ml-2">Häufigkeit:</span>

                <FeedbackTranscriptFilterOptions
                  class="flex flex-col"
                  @filter-option="(e) => setWordsCount(e, 'keywordsCount')"
                  :label="'keywordsCount'"
                  :options="[
                    { label: 'Alle', value: 0 },
                    { label: '>1', value: 1 },
                    { label: '>2', value: 2 },
                    { label: '>3', value: 3 },
                  ]"
                >
                </FeedbackTranscriptFilterOptions>
              </div>
              <!-- Filter for words to say / not to say -->

              <div class="flex items-center pl-1">
                <span
                  @click="setSubstantives"
                  :class="{
                    'cursor-pointer text-sm ml-0 border-2 rounded-md p-0.5 border-gray-400 font-normal w-fit text-center my-1':
                      !seeSubstantives,
                    'cursor-pointer text-sm ml-0 border-2 rounded-md p-0.5 border-blue-400 font-bold w-fit text-center':
                      seeSubstantives,
                  }"
                >
                  Nennungen:
                </span>

                <FeedbackSubstantivesFilter
                  v-if="seeSubstantives"
                  class="flex -ml-2"
                  @filter-option="
                    (e) => handleSubstantivesFilterOption(e, 'Nennungen')
                  "
                  :label="'Nennungen'"
                  :options="[
                    { label: 'Alle', value: 0 },
                    { label: 'gewünscht', value: 1 },
                    { label: 'unerwünscht', value: 2 },
                  ]"
                  :preselected="[substantives]"
                />
                <!-- <FeedbackTranscriptFilterOptions v-if="seeSubstantives" class="-ml-2 flex flex-col" :class="{'text-gray-300' : !seeSubstantives}"
                  @filter-option="(e) => setSubstantivesValue(e, 'substantives')" :label="'substantives'" :options="[
                      { label: 'Alle', value: 0 },
                      { label: 'gewünscht', value: 1 },
                      { label: 'unerwünscht', value: 2 },
                    ]">
                </FeedbackTranscriptFilterOptions> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <span
        class="cursor-pointer hover:bg-sky-100 p-2.5 rounded-lg flex w-fit h-fit"
        :class="{ 'bg-sky-100': this.showFilter }"
        @click="
          this.showFilter = !this.showFilter
          // this.seeSubstantives = false;
        "
      >
        <Icon iconName="filter" class="p-0"></Icon>
      </span>
    </div>

    <div class="flex flex-row w-full pt-3 h-full">
      <!--Collumn for Student -->
      <div class="flex-col w-1/2">
        <h1 class="text-blue-500 text-center text-xl font-bold">
          {{ speaker1 }}
        </h1>

        <div v-if="seeSubstantives" class="flex justify-center">genannt</div>

        <div class="my-scroll-container h-40 overflow-auto mt-4">
          <ul class="flex flex-row flex-wrap justify-start">
            <li
              v-for="item in speaker_0_words"
              :key="item.value"
              class="m-2 p-1 rounded-md font-bold border-2"
              :class="{
                'bg-blue-500/20 text-blue-500  border-blue-500':
                  item.color === 'blue',
                'bg-orange/50 border-orange text-white':
                  item.color === 'orange',
                'bg-green-700/50 border-green-700 text-white':
                  item.color === 'green',
              }"
            >
              {{ item.value }} {{ item.count }}
            </li>
          </ul>
        </div>
      </div>

      <!-- column for words not said -->
      <div v-if="seeSubstantives" class="flex mx-2">
        <!-- <div class="h-3/4 bg-black mt-11 mr-4" style="width: 1px"></div> -->

        <div class="flex flex-col w-fit">
          <div class="flex pt-7 w-full whitespace-nowrap justify-center">
            nicht genannt
          </div>
          <div
            class="my-scroll-container h-40 overflow-auto mt-4 border-l-2 border-r-2"
          >
            <ul class="flex flex-row flex-wrap justify-end">
              <li
                v-for="item in this.wordsNotSaid"
                :key="item.value"
                class="m-2 p-1 rounded-md font-bold border-2"
                :class="{
                  'bg-orange/50 border-orange text-white':
                    item.color === 'orange',
                  'bg-green-700/50 border-green-700 text-white':
                    item.color === 'green',
                }"
              >
                {{ item.value }}
              </li>
            </ul>
          </div>
        </div>

        <!-- <div class="h-3/4 bg-black mt-11 ml-4" style="width: 1px"></div> -->
      </div>

      <!--Column for actor -->
      <div class="flex-col w-1/2">
        <h1 class="text-center text-xl font-bold text-pink-600">
          {{ speaker2 }}
        </h1>

        <div v-if="seeSubstantives" class="flex justify-center">genannt</div>
        <div class="my-scroll-container h-40 overflow-auto mt-4">
          <ul class="flex flex-row flex-wrap justify-end">
            <li
              v-for="item in speaker_1_words"
              :key="item.value"
              class="m-2 p-1 rounded-md font-bold border-2"
              :class="{
                'bg-pink-600/20 text-pink-600 border-pink-600':
                  item.color === 'pink',
                'bg-orange/50 border-orange text-white':
                  item.color === 'orange',
                'bg-green-700/50 border-green-700 text-white':
                  item.color === 'green',
              }"
            >
              {{ item.value }} {{ item.count }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import { stemmer } from "stemmer";

import { removeStopwords, deu } from "stopword";
import FeedbackTranscriptFilterOptions from "./FeedbackTranscriptFilterOptions.vue";
import Icon from "../interface-components/Icon.vue";
import FeedbackSubstantivesFilter from "./FeedbackSubstantivesFilter.vue";

export default {
  name: "FeedbackKeywords",
  components: {
    FeedbackTranscriptFilterOptions,
    Icon,
    FeedbackSubstantivesFilter,
  },

  props: {
    names: {
      type: Array,
      default: "TODO",
    },
    showFilterIncoming: {
      type: Boolean,
      default: false,
    },
    wordGroupIncoming: {
      type: Number,
      default: 0,
    },
    wordsCountIncoming: {
      type: Number,
      default: 0,
    },
    isCard: { type: Boolean, default: false },
  },
  data() {
    return {
      speaker_0_words: [],

      speaker_1_words: [],

      speaker1: "",
      speaker2: "",
      wordGroup: this.wordGroupIncoming,
      wordsCount: this.wordsCountIncoming,
      showFilter: this.showFilterIncoming,

      seeSubstantives: false,
      substantives: 0,

      all_speaker_0_words: [],
      all_speaker_1_words: [],
      wordsNotSaid: [],
      wordsToSay: [],
      wordsNotToSay: [],
      all_wordsNotSaid: [],
    };
  },
  methods: {
    setSubstantives() {
      if (this.wordsCount === 0 && this.wordGroup === 0) {
        this.seeSubstantives = !this.seeSubstantives;
        console.log("setSubstantives: " + this.seeSubstantives);
        this.processAllWordGroups(this.wordsCount);
      }
    },

    handleSubstantivesFilterOption(e, label) {
      if (e.label === label && label === "Nennungen") {
        this.substantives = e.selected;
        this.wordGroup = 0;
        this.wordsCount = 0;
        console.log("substantives: " + this.substantives);
        this.showSubstantives(this.substantives);
      } else {
        console.error("unexpected state", e);
      }
    },

    showSubstantives(values) {
      if (values.includes(0)) {
        console.log("showSubstantives: " + values);
        this.processAllWordGroups(this.wordsCount); // Zeigt alle Wörter an
        this.substantivesFilter = values;
      } else {
        // Filter für "gewünscht" (grün) und "unerwünscht" (orange)
        const colorsToShow = [];
        if (values.includes(1)) colorsToShow.push("green");
        if (values.includes(2)) colorsToShow.push("orange");
        console.log("colorsToShow: " + colorsToShow);
        this.substantivesFilter = values;
        // Filtere `speaker_0_words` und `speaker_1_words` basierend auf `colorsToShow`
        this.speaker_0_words = this.all_speaker_0_words.filter((word) =>
          colorsToShow.includes(word.color)
        );
        this.speaker_1_words = this.all_speaker_1_words.filter((word) =>
          colorsToShow.includes(word.color)
        );
        this.wordsNotSaid = this.all_wordsNotSaid.filter((word) =>
          colorsToShow.includes(word.color)
        );
      }
    },

    /**
     * Sets the word group based on the given event and label.
     *
     * @param {Object} e - The event object.
     * @param {string} label - The label to compare against.
     * @return {void}
     */
    setWordGroup(e, label) {
      if (e.label === label && label === "keywords") {
        if (this.seeSubstantives && e.newValue.value !== 0) {
          this.setSubstantives();
          console.log(
            "wordsCount switch wegen countchange: " + e.newValue.value
          );
        }
        this.wordGroup = e.newValue.value;
        console.log("wordGroup: " + this.wordGroup);
      } else {
        console.error("unexpected state", e);
      }
    },

    /**
     * Sets the words count based on the given event and label.
     *
     * @param {Object} e - The event object.
     * @param {string} label - The label to compare against.
     * @return {void}
     */
    setWordsCount(e, label) {
      if (e.label === label && label === "keywordsCount") {
        if (this.seeSubstantives && e.newValue.value !== 0) {
          this.setSubstantives();
          console.log(
            "wordsCount switch wegen countchange: " + e.newValue.value
          );
        }
        this.wordsCount = e.newValue.value;
      } else {
        console.error("unexpected state", e);
      }
    },
    /**
     * Handles the change in word group and performs corresponding actions based on the new value.
     *
     * @param {any} newVal - The new value for the word group.
     * @param {any} newCountVal - The new count value associated with the word group.
     * @return {void}
     */
    onWordGroupChange(newVal, newCountVal) {
      if (newCountVal === undefined) {
        newCountVal = 0;
      }

      switch (newVal) {
        case 0:
          console.log(
            "jetzt wurde gechanged wordGroup: " +
              this.wordGroup +
              " wordsCount: " +
              this.wordsCount
          );
          this.processAllWordGroups(newCountVal);
          break;
        case 1:
          this.newWordGroup("nouns", newCountVal);
          if (this.seeSubstantives) this.substantives = [0];
          break;
        case 2:
          this.newWordGroup("verbs", newCountVal);
          if (this.seeSubstantives) this.substantives = [0];
          break;
        case 3:
          this.newWordGroup("adjectives", newCountVal);
          if (this.seeSubstantives) this.substantives = [0];
          break;
        default:
          console.log("Unbekannter Wert für newVal:", newVal);
      }
    },

    /**
     * Handles the creation of a new word group based on the provided word group name and word count number.
     *
     * @param {string} wordGroupName - The name of the word group.
     * @param {number} wordsCountNumber - The number of words to consider for the word group.
     * @return {void}
     */
    newWordGroup(wordGroupName, wordsCountNumber) {
      let finalWords = [];
      let allSpokenWords = new Set();
      for (let i = 0; i <= 1; i++) {
        // check if word group exists
        if (
          !wordGroupName ||
          !this.getWords.speakers[0].data[0][wordGroupName]
        ) {
          return;
        }

        let objectArray = [];

        for (let j = 0; j < this.getWords.speakers[i].data.length; j++) {
          objectArray = objectArray.concat(
            this.getWords.speakers[i].data[j][wordGroupName]
          );
        }

        // Continued processing of objectArray
        const combinedItems = objectArray.reduce((acc, obj) => {
          if (obj) {
            const { noun, count, color } = obj;
            if (acc[noun]) {
              acc[noun] += count;
            } else {
              acc[noun] = count;
            }
          }
          return acc;
        }, {});

        // Transfer into Array with { value, count, color }
        if (
          Object.entries(combinedItems)
            .map(([value, count, color]) => ({
              value,
              count,
              color: i === 0 ? "blue" : "pink",
            }))
            .filter((item) => item.count > wordsCountNumber).length === 0
        ) {
          switch (wordGroupName) {
            case "nouns":
              this[`speaker_${i}_words`] = [
                {
                  value:
                    "Keine Nomen die häufiger als " +
                    wordsCountNumber +
                    " mal genannt wurden",
                  color: i === 0 ? "blue" : "pink",
                },
              ];
              break;
            case "verbs":
              this[`speaker_${i}_words`] = [
                {
                  value:
                    "Keine Verben die häufiger als " +
                    wordsCountNumber +
                    " mal genannt wurden",
                  color: i === 0 ? "blue" : "pink",
                },
              ];
              break;
            case "adjectives":
              this[`speaker_${i}_words`] = [
                {
                  value:
                    "Keine Adjektive die häufiger als " +
                    wordsCountNumber +
                    " mal genannt wurden",
                  color: i === 0 ? "blue" : "pink",
                },
              ];
              break;
            default:
              console.log("Unbekannter Wert für wordgroupName:", wordGroupName);
          }
        } else {
          finalWords = Object.entries(combinedItems)
            .map(([value, count, color]) => ({
              value,
              count,
              color: i === 0 ? "blue" : "pink",
            }))
            .filter((item) => item.count > wordsCountNumber);
          finalWords.forEach((word) =>
            allSpokenWords.add(word.value.toLowerCase())
          );

          if (this.seeSubstantives) {
            finalWords = this.setKeywordsSubstantives(finalWords);
            /* handle words not said */
            let tempWordsNotSaid = [];

            this.wordsToSay.forEach((word) => {
              if (!allSpokenWords.has(word.toLowerCase())) {
                tempWordsNotSaid.push({
                  value: word,
                  color: "green",
                });
              }
            });

            this.wordsNotToSay.forEach((word) => {
              if (!allSpokenWords.has(word.toLowerCase())) {
                tempWordsNotSaid.push({
                  value: word,
                  color: "orange",
                });
              }
            });

            // Entfernen von Duplikaten aus `tempWordsNotSaid`
            tempWordsNotSaid = tempWordsNotSaid.filter(
              (word, index, self) =>
                index === self.findIndex((w) => w.value === word.value)
            );
          }

          this[`speaker_${i}_words`] = finalWords;
          this[`all_speaker_${i}_words`] = finalWords;
        }
      }
    },
    /**
     * Process all word groups based on the provided words count number.
     *
     * @param {number} wordsCountNumber - The number of words to consider for the word groups.
     * @return {void}
     */
    processAllWordGroups(wordsCountNumber) {
      const wordGroups = ["nouns", "verbs", "adjectives"];
      let allSpokenWords = new Set();

      for (let i = 0; i <= 1; i++) {
        let finalWords = [];

        wordGroups.forEach((wordGroupName) => {
          // check if word group exists
          if (
            !wordGroupName ||
            !this.getWords.speakers[0].data[0][wordGroupName]
          ) {
            console.error(
              "Das angeforderte Objekt ist nicht vorhanden:",
              wordGroupName
            );
            return;
          }

          let objectArray = [];

          for (let j = 0; j < this.getWords.speakers[i].data.length; j++) {
            objectArray = objectArray.concat(
              this.getWords.speakers[i].data[j][wordGroupName]
            );
          }

          // Continued processing of objectArray
          const combinedItems = objectArray.reduce((acc, obj) => {
            if (obj) {
              const { noun, count } = obj;
              if (acc[noun]) {
                acc[noun] += count;
              } else {
                acc[noun] = count;
              }
            }
            return acc;
          }, {});

          // Transfer into Array with { value, count }
          const wordList = Object.entries(combinedItems)
            .map(([value, count]) => ({
              value,
              count,
              color: i === 0 ? "blue" : "pink",
            }))
            .filter((item) => item.count > wordsCountNumber);

          if (wordList.length === 0) {
            console.log("Keine Wörter gefunden");
            switch (wordGroupName) {
              case "nouns":
                finalWords.push({
                  value:
                    "Keine Nomen die häufiger als " +
                    wordsCountNumber +
                    " mal genannt wurden",
                  color: i === 0 ? "blue" : "pink",
                });
                break;
              case "verbs":
                finalWords.push({
                  value:
                    "Keine Verben die häufiger als " +
                    wordsCountNumber +
                    " mal genannt wurden",
                  color: i === 0 ? "blue" : "pink",
                });
                break;
              case "adjectives":
                finalWords.push({
                  value:
                    "Keine Adjektive die häufiger als " +
                    wordsCountNumber +
                    " mal genannt wurden",
                  color: i === 0 ? "blue" : "pink",
                });
                break;
              default:
                console.log(
                  "Unbekannter Wert für wordgroupName:",
                  wordGroupName
                );
            }
          } else {
            finalWords = finalWords.concat(wordList);
          }
        });

        finalWords.forEach((word) =>
          allSpokenWords.add(word.value.toLowerCase())
        );

        if (this.seeSubstantives) {
          finalWords = this.setKeywordsSubstantives(finalWords);
          /* handle words not said */
          let tempWordsNotSaid = [];

          this.wordsToSay.forEach((word) => {
            if (!allSpokenWords.has(word.toLowerCase())) {
              tempWordsNotSaid.push({
                value: word,
                color: "green",
              });
            }
          });

          this.wordsNotToSay.forEach((word) => {
            if (!allSpokenWords.has(word.toLowerCase())) {
              tempWordsNotSaid.push({
                value: word,
                color: "orange",
              });
            }
          });

          // Entfernen von Duplikaten aus `tempWordsNotSaid`
          tempWordsNotSaid = tempWordsNotSaid.filter(
            (word, index, self) =>
              index === self.findIndex((w) => w.value === word.value)
          );

          // Aktualisiere `wordsNotSaid`
          this.wordsNotSaid = tempWordsNotSaid;
          this.all_wordsNotSaid = [...this.wordsNotSaid];
        }

        this[`speaker_${i}_words`] = finalWords;
        this[`all_speaker_${i}_words`] = finalWords;
      }
    },

    setKeywordsSubstantives(keywords) {
      if (this.seeSubstantives) {
        this.wordsToSay = this.getCurrentFeedback.wordsToSay.map((word) =>
          word.toLowerCase()
        );
        this.wordsNotToSay = this.getCurrentFeedback.wordsNotToSay.map((word) =>
          word.toLowerCase()
        );
        /* handle words to say */

        keywords.forEach((word) => {
          if (this.wordsToSay.includes(word.value.toLowerCase())) {
            word.color = "green";
          } else if (this.wordsNotToSay.includes(word.value.toLowerCase())) {
            word.color = "orange";
          }
        });
        return keywords;
      }
    },
  },
  watch: {
    /**
     * A function that handles the change of word group.
     *
     * @param {any} newVal - The new value for the word group.
     * @param {any} oldVal - The old value for the word group.
     * @return {void}
     */
    wordGroup(newVal, oldVal) {
      if (this.seeSubstantives && !newVal === 0) this.setSubstantives();
      this.onWordGroupChange(newVal, this.wordsCount);
      this.$emit("update:wordData", {
        wordGroup: this.wordGroup,
        wordsCount: this.wordsCount,
      });
    },
    /**
     * Handles the change in words count and performs corresponding actions based on the new value.
     *
     * @param {any} newVal - The new value for the words count.
     * @param {any} oldVal - The old value for the words count.
     * @return {void}
     */
    wordsCount(newVal, oldVal) {
      if (this.seeSubstantives && !newVal === 0) {
        this.setSubstantives();
        console.log("wordsCount switch wegen countchange: " + newVal);
      }
      console.log("wordsCount: " + newVal);
      this.onWordGroupChange(this.wordGroup, newVal);
      this.$emit("update:wordData", {
        wordGroup: this.wordGroup,
        wordsCount: this.wordsCount,
      });
    },

    /**
     * A function that handles the change of the showFilter value.
     *
     * @param {boolean} newVal - The new value for the showFilter.
     * @param {boolean} oldVal - The old value for the showFilter.
     * @return {void}
     */
    showFilter(newVal, oldVal) {
      if (newVal === false) {
        this.processAllWordGroups(0);
      } else if (newVal === true) {
        this.onWordGroupChange(this.wordGroup, this.wordsCount);
      }

      this.$emit("update:showFilter", newVal);
      this.$emit("update:wordData", {
        wordGroup: this.wordGroupIncoming,
        wordsCount: this.wordsCountIncoming,
      });
    },
  },

  mounted() {
    this.seeSubstantives = false;
    console.log("seesub: " + this.seeSubstantives);
    this.showFilter = this.showFilterIncoming;
    this.wordGroup = this.wordGroupIncoming;
    this.wordsCount = this.wordsCountIncoming;
    this.onWordGroupChange(this.wordGroup, this.wordsCount);
    this.speaker1 = this.getCurrentFeedback.meta.speakers[0].role;
    this.speaker2 = this.getCurrentFeedback.meta.speakers[1].role;
  },

  computed: {
    ...mapGetters({
      getTranscript: "getTranscript",
      getWords: "getWords",
      getCurrentFeedback: "getCurrentFeedback",
    }),
  },
};
</script>

<style>
.my-scroll-container::-webkit-scrollbar {
  width: 8px; /* Scrollbar-Breite */
  height: 8px; /* Scrollbar-Höhe für horizontale Scrollbars */
}

.my-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1; /* Hintergrund der Scrollbar-Spur */
}

.my-scroll-container::-webkit-scrollbar-thumb {
  background-color: #888; /* Farbe des Scroll-Thumbs */
  border-radius: 4px; /* Runde Ecken */
}
</style>
