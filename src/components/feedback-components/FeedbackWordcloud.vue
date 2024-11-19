<!--Feedback Component: FeedbackWordcloud.vue shows the wordcloud of the spoken words-->
<template>
  <div
    v-if="this.errorMessage"
    class="mx-auto w-full flex items-center h-48 justify-center pl-10"
  >
    {{ this.errorMessage }}
  </div>
  <div v-else class="flex flex-col w-full h-80" v-if="renderComponent">
    <div
      class="absolute flex justify-center mx-auto items-center w-4/5 h-1/2 z-20 left-24 pointer-events-none"
      :class="{ 'z-20': isLoading && renderLoading }"
      v-if="isLoading && renderLoading"
    >
      <!-- Loading animation -->
      <span
        class="flex flex-col items-center w-fit mx-auto py-3 bg-slate-100/90 rounded-lg"
        ><span class="text-lg mx-2 mb-2 font-bold text-primary"
          >Auf Daten warten...</span
        ><Icon
          size="48"
          iconName="arrowsCircle"
          class="mx-12 animate-spin"
        ></Icon
      ></span>
    </div>

    <div class="flex flex-row self-end -mt-10 -mr-12">
      <div
        class="flex flex-col mt-1 -mr-2.5 bg-sky-100 rounded-lg px-2 py-0.5 pr-6 z-20 "
        v-if="this.showFilter"
      >
        <!-- Filter for  wordGroup -->
        <div class="flex items-center font-bold">
          <span class="text-sm">Wortarten:</span>
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
          <span class="text-sm">Häufigkeit:</span>

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
      </div>
      <span class="hover:bg-sky-100 cursor-pointer p-2.5 mt-1 rounded-lg flex w-fit h-fit -mr-1" :class="{'bg-sky-100': this.showFilter}"
        @click="this.showFilter = !this.showFilter">
        <Icon iconName="filter" class="p-0"></Icon>
      </span>
    </div>

    <div
      class="flex flex-col w-full h-52 pb-10 my-8 z-19"
      @mousemove="handleMouseMove"
    >
      <vue-word-cloud
        ref="wordCloud"
        class="w-full h-full bg-white whitespace-pre-line"
        :words="this.words"
        :color="(word) => word[2]"
        :font-variant="(word) => word[3]"
        :spacing="0.3"
        :font-family="Roboto"
        @mouseover="handleMouseOver"
        @mouseleave="clearCurrentWord"
      />

      <!-- Legend of roles -->
      <div class="w-1/2 h-20 flex self-center -mb-24 justify-around bg-white">
        <div class="flex flex-row self-center">
          <div class="w-3 h-3 self-center mr-2 rounded-full bg-blue-600"></div>

          <div class="flex text-ocean-dark">{{ this.speaker1 }}</div>
        </div>

        <div class="flex flex-row self-center">
          <div class="w-3 h-3 self-center mr-2 rounded-full bg-pink-600"></div>

          <div class="flex text-ocean-dark">{{ this.speaker2 }}</div>
        </div>
      </div>

      <div
        v-if="currentWord.word"
        class="fixed bg-white p-2 rounded shadow"
        :style="{ top: `${currentWord.y}px`, left: `${currentWord.x}px` }"
      >
        <p>{{ currentWord.word }}</p>
        <p v-if="currentWord.substantive == `wordsToSay`">
          Dieses Wort <span class="font-bold">sollte</span> genannt werden.
        </p>
        <p v-if="currentWord.substantive == `wordsNotToSay`">
          Dieses Wort sollte <span class="font-bold">nicht</span> genannt
          werden.
        </p>
        <p v-if="currentWord.count != `black`">
          Häufigkeit: {{ currentWord.count }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { stemmer } from "stemmer";
import { removeStopwords, deu } from "stopword";
import Icon from "../interface-components/Icon.vue";
import FeedbackTranscriptFilterOptions from "./FeedbackTranscriptFilterOptions.vue";
import LoadButton from "../interface-components/LoadButton.vue";

export default {
  components: {
    Icon,
    LoadButton,
    FeedbackTranscriptFilterOptions,
  },
  props: {
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
  },
  data() {
    return {
      renderComponent: true,
      errorMessage: "",
      renderLoading: true,
      isLoading: true,
      prevLoading: false,
      words: [],
      speaker1: "",
      speaker2: "",

      currentWord: {
        word: "",
        count: 0,
        substantive: "",
        x: 0,
        y: 0,
      },
      showFilter: this.showFilterIncoming,
      wordGroup: this.wordGroupIncoming,
      wordsCount: this.wordsCountIncoming,
    };
  },
  methods: {
    /**
     * Sets the `isLoading` property to `false`, preventing the loading animation from being displayed.
     *
     * @return {void} This function does not return anything.
     */
    preventLoading() {
      this.isLoading = false;
    },

    /**
     * Handles the mouse over event on a word in the word cloud.
     *
     * @param {MouseEvent} e - The mouse event object.
     * @return {void} This function does not return a value.
     */
    handleMouseOver(e) {
      const word = e.target.firstChild.data;
      const selectedWord = this.words.find((elem) => elem[0] === word);

      if (selectedWord) {
        this.updateCurrentWord(
          selectedWord[0],
          selectedWord[1],
          selectedWord[4],
          e.clientX,
          e.clientY
        );
      }
    },
    /**
     * Update the current word position as the mouse moves.
     *
     * @param {string} word - The word being updated.
     * @param {number} count - The count of the word.
     * @param {string} substantive - The type of the word.
     * @param {number} x - The x-coordinate of the mouse.
     * @param {number} y - The y-coordinate of the mouse.
     * @return {void} This function does not return anything.
     */
    handleMouseMove(e) {
      if (this.currentWord.word) {
        // Update the position as the mouse moves
        this.updateCurrentWord(
          this.currentWord.word,
          this.currentWord.count,
          this.currentWord.substantive,
          e.clientX,
          e.clientY
        );
      }
    },
    /**
     * Clears the current word by resetting it to default values.
     *
     * @return {void} This function does not return anything.
     */
    clearCurrentWord() {
      this.currentWord = {
        word: "",
        count: 0,
        substantive: "",
        x: 0,
        y: 0,
      };
    },
    /**
     * Updates the current word with the given properties.
     *
     * @param {string} word - The word to update.
     * @param {number} count - The count of the word.
     * @param {string} substantive - The type of the word.
     * @param {number} x - The x-coordinate of the word.
     * @param {number} y - The y-coordinate of the word.
     * @return {void} This function does not return anything.
     */
    updateCurrentWord(word, count, substantive, x, y) {
      this.currentWord = {
        word,
        count,
        substantive,
        x,
        y,
      };
    },

    /**
     * Sets the word group based on the given event and label.
     *
     * @param {Object} e - The event object.
     * @param {string} label - The label to compare against.
     * @return {void} This function does not return anything.
     */
    setWordGroup(e, label) {
      if (e.label === label && label === "keywords") {
        this.wordGroup = e.newValue.value;
      } else {
        console.error("unexpected state", e);
      }
    },

    /**
     * Sets the words count.
     *
     * @param {Object} e - The event object.
     * @param {string} label - The label to compare.
     * @return {void} This function does not return anything.
     */
    setWordsCount(e, label) {
      if (e.label === label && label === "keywordsCount") {
        this.wordsCount = e.newValue.value;
      } else {
        console.error("unexpected state", e);
      }
    },
    /**
     * Handles the change in word group and performs corresponding actions based on the new value.
     *
     * @param {number} newVal - The new value for the word group.
     * @param {number} newCountVal - The new count value associated with the word group.
     * @return {void}
     */
    onWordGroupChange(newVal, newCountVal) {
      switch (newVal) {
        case 0:
          this.processAllWordGroups(newCountVal);
          break;
        case 1:
          this.newWordGroup("nouns", newCountVal);
          break;
        case 2:
          this.newWordGroup("verbs", newCountVal);
          break;
        case 3:
          this.newWordGroup("adjectives", newCountVal);
          break;
        default:
          console.log("Unbekannter Wert für newVal:", newVal);
      }
    },

    /**
     * Processes all word groups based on the provided words count number.
     *
     * @param {number} wordsCountNumber - The number of words to consider for the word groups.
     * @return {void}
     */
    async processAllWordGroups(wordsCountNumber) {
      let temp = [];
      const wordsArray = [];
      const wordGroups = ["nouns", "verbs", "adjectives"];

      wordGroups.forEach((wordGroupName) => {
        for (let i = 0; i <= 1; i++) {
          // Check if parameter is valid
          if (
            !wordGroupName ||
            !this.getWords.speakers[0].data[0][wordGroupName]
          ) {
            continue;
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

          // convert into Array with { value, count }
          temp = Object.entries(combinedItems)
            .map(([value, count]) => ({
              value,
              count,
            }))
            .filter((item) => item.count > wordsCountNumber);

          let wordsToSay = [];

          // Iterate through arrays and add words to thewordsToSay
          for (let i = 0; i < this.getCurrentFeedback.wordsToSay.length; i++) {
            wordsToSay = wordsToSay.concat(this.getCurrentFeedback.wordsToSay);
          }

          // Remove duplicates from wordsToSay
          wordsToSay = [...new Set(wordsToSay)];
          wordsToSay = wordsToSay.map((word) => word.toLowerCase());

          temp.forEach((word) => {
            let color = "";
            let fontWeight = "normal";
            let substantives = "";
            if (wordsToSay.includes(word.value.toLowerCase())) {
              color = i === 0 ? "RoyalBlue" : "DeepPink";
              fontWeight = "Bold";
              substantives = "wordsToSay";
            } else {
              color = i === 0 ? "RoyalBlue" : "DeepPink";
            }
            wordsArray.push([
              word.value,
              parseInt(word.count),
              color,
              fontWeight,
              substantives,
            ]);
          });

          let wordsNotToSay = [];

          // Iterate through arrays and add words to thewordsToSay
          for (
            let i = 0;
            i < this.getCurrentFeedback.wordsNotToSay.length;
            i++
          ) {
            wordsNotToSay = wordsNotToSay.concat(
              this.getCurrentFeedback.wordsNotToSay
            );
          }

          // Remove duplicates from wordsToSay
          wordsNotToSay = [...new Set(wordsNotToSay)];
          wordsNotToSay = wordsNotToSay.map((word) => word.toLowerCase());

          wordsArray.forEach((word) => {
            let fontWeight = "normal";
            let substantives = "wordsNotToSay";
            if (wordsNotToSay.includes(word[0].toLowerCase())) {
              fontWeight = "Bold";
              word[3] = fontWeight;
              word[4] = substantives;
            }
          });
        }
      });

      if (wordsArray.length == 0) {
        wordGroups.forEach((wordGroupName) => {
          switch (wordGroupName) {
            case "nouns":
              wordsArray.push([
                "Keine Nomen die häufiger als " +
                  [wordsCountNumber] +
                  " mal genannt wurden",
                "black",
              ]);
              break;
            case "verbs":
              wordsArray.push([
                "Keine Verben die häufiger als " +
                  [wordsCountNumber] +
                  " mal genannt wurden",
                "black",
              ]);
              break;
            case "adjectives":
              wordsArray.push([
                `Keine Adjektive die häufiger als ${wordsCountNumber} mal genannt wurden`,
                "black",
              ]);
              break;
            default:
              console.log("Unbekannter Wert für wordgroupName:", wordGroupName);
          }
        });
      }

      this.words = wordsArray;
    },

    /**
     * Processes the given word group name and word count number.
     *
     * @param {string} wordGroupName - The name of the word group.
     * @param {number} wordsCountNumber - The number of words to consider.
     * @return {void} This function does not return a value.
     */
    newWordGroup(wordGroupName, wordsCountNumber) {
      let temp = [];
      const wordsArray = [];

      for (let i = 0; i <= 1; i++) {
        // Check if parameter is valid
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

        for (const dataElement of this.getWords.speakers[i].data) {
          objectArray = objectArray.concat(dataElement[wordGroupName]);
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

        // Convert into array with { value, count }

        temp = Object.entries(combinedItems)
          .map(([value, count]) => ({
            value,
            count,
          }))
          .filter((item) => item.count > wordsCountNumber);

        let wordsToSay = this.getCurrentFeedback.wordsToSay;

        // Iterate through arrays and add words to thewordsToSay
        /* for (
          let i = 0;
          i < this.getCurrentFeedback.wordsToSay.length;  
          i++
        ) {
          wordsToSay = wordsToSay.concat(
            this.getCurrentFeedback.wordsToSay
          );
        } */

        // Remove duplicates from wordsToSay
        wordsToSay = [...new Set(wordsToSay)];
        wordsToSay = wordsToSay.map((word) => word.toLowerCase());

        temp.forEach((word) => {
          let color = "";
          let fontWeight = "normal";
          let substantives = "";
          if (wordsToSay.includes(word.value.toLowerCase())) {
            color = i === 0 ? "RoyalBlue" : "DeepPink";
            fontWeight = "Bold";
            substantives = "wordsToSay";
          } else {
            color = i === 0 ? "RoyalBlue" : "DeepPink";
          }
          wordsArray.push([
            word.value,
            parseInt(word.count),
            color,
            fontWeight,
            substantives,
          ]);
        });

        let wordsNotToSay = this.getCurrentFeedback.wordsNotToSay;

        // Iterate through arrays and add words to thewordsNotToSay
        /* for (
          let i = 0;
          i < this.getCurrentSession.meta.recorded_cases.length;
          i++
        ) {
          wordsNotToSay = wordsNotToSay.concat(
            this.getCurrentSession.meta.recorded_cases[i].words.wordsNotToSay
          );
        } */

        // Remove duplicates from wordsNotToSay
        wordsNotToSay = [...new Set(wordsNotToSay)];
        wordsNotToSay = wordsNotToSay.map((word) => word.toLowerCase());

        wordsArray.forEach((word) => {
          let fontWeight = "normal";
          const substantives = "wordsNotToSay";
          if (!wordsNotToSay.includes(word[0].toLowerCase())) {
            return;
          }
          fontWeight = "Bold";
          word[3] = fontWeight;
          word[4] = substantives;
        });
      }
      if (wordsArray.length == 0) {
        switch (wordGroupName) {
          case "nouns":
            wordsArray.push([
              "Keine Nomen die häufiger als " +
                [wordsCountNumber] +
                " mal genannt wurden",
              "black",
            ]);
            break;
          case "verbs":
            wordsArray.push([
              "Keine Verben die häufiger als " +
                [wordsCountNumber] +
                " mal genannt wurden",
              "black",
            ]);
            break;
          case "adjectives":
            wordsArray.push([
              `Keine Adjektive die häufiger als ${wordsCountNumber} mal genannt wurden`,
              "black",
            ]);
            break;
          default:
            console.log("Unbekannter Wert für wordgroupName:", wordGroupName);
        }
      }

      this.words = wordsArray;
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
    async showFilter(newVal, oldVal) {
      if (newVal === false) {
        await this.processAllWordGroups(0);
      } else if (newVal === true) {
        this.onWordGroupChange(this.wordGroup, this.wordsCount);
      }
      this.$emit("update:showFilter", newVal);
      this.$emit("update:wordData", {
        wordGroup: this.wordGroup,
        wordsCount: this.wordsCount,
      });
    },
    /**
     * A function that toggles the renderComponent property to trigger a resize of the component.
     *
     * @return {void} This function does not return anything.
     */
    resize() {
      this.renderComponent = false;
      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },
  },
  mounted() {
    const dataExists = this.getWords;

    if (
      (dataExists &&
        dataExists.speakers &&
        dataExists.speakers[0].data.length == 0) ||
      dataExists.speakers[1].data.length == 0
    ) {
      this.errorMessage = "Keine Daten vorhanden";
    }
    if (!this.prevLoading) {
      setTimeout(() => {
        this.isLoading = false;
        this.reload;
      }, 2500);
    }

    this.showFilter = this.showFilterIncoming;
    this.wordGroup = this.wordGroupIncoming;
    this.wordsCount = this.wordsCountIncoming;
    this.onWordGroupChange(this.wordGroup, this.wordsCount);
    this.speaker1 = this.getCurrentFeedback.meta.speakers[0].role;
    this.speaker2 = this.getCurrentFeedback.meta.speakers[1].role;
  },

  computed: {
    ...mapGetters({
      getWords: "getWords",
      getTranscript: "getTranscript",
      getCurrentFeedback: "getCurrentFeedback",
      getCurrentSessionId: "getCurrentSessionId",
      getCurrentSession: "getCurrentSession",
    }),
  },
};
</script>

<style>
.word-with-border {
  border: 1px solid grey;
}
</style>
