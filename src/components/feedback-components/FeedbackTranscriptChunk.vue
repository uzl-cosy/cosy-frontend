<!-- Feedback Component: FeedbackTranscriptChunk.vue  contains one share of the dialog with the respective speaker -->
<template>
  <!--  Grid-->
  <div
    class="grid gap-1 grid-cols-[9%_82%_9%] w-full h-auto bg-primary/10 font-medium 2xl:text-xl xl:text-base text-gray-500 items-center justify-items-start rounded-lg p-3"
    :class="{ 'my-2': isFirst, 'mb-2': !isFirst, 'bg-sky-200': showChunk }"
  >
    <!--    Speaker 1: Startzeit-->
    <div class="row-start-1 row-end-1 col-start-1 col-end-1 min-w-12 max-w-12">
      <div v-if="isSpeakerOne">
        <span class="flex text-xs items-start text-sky-600 mr-2">
          {{ timeStart[0] }}
          <span v-if="showMiliSec" class="text-xs font-light">
            {{ timeStart[1] }}
          </span>
        </span>
      </div>
    </div>
    <!--    Speaker 1: Bar-->
    <div
      class="row-start-2 row-end-2 col-start-1 col-end-1 min-w-12 max-w-12"
      :class="{ 'pl-4': showMiliSec, 'pl-2': !showMiliSec }"
    >
      <div
        v-if="isSpeakerOne"
        class="w-4 rounded-lg py-8 h-full min-h-0 mt-0 mb-0 flex justify-center"
        :class="{
          'bg-[#A71F60]': color === '#A71F60',
          'bg-[#3BA8D4]': color === '#3BA8D4',
        }"
      >
        <div class="w-20 h-full">
          <svg
            class="w-12 h-12 z-20"
            viewBox="0 0 70 70"
            xmlns="http://www.w3.org/2000/svg"
            :stroke="color"
            stroke-width="2px"
            fill="white"
          >
            <circle cx="35" cy="40" r="30" />
            <text
              x="27"
              y="51"
              style="font: bold 24px inter; fill: black; stroke: none"
            >
              {{ name[0] }}
            </text>
          </svg>
        </div>
      </div>
    </div>
    <!--    Speaker 1: End time-->
    <div class="row-start-3 row-end-3 col-start-1 col-end-1 min-w-12 max-w-12">
      <div v-if="isSpeakerOne">
        <span class="flex text-xs self-center text-sky-600 mr-0">
          {{ timeEnd[0] }}
          <span v-if="showMiliSec" class="text-xs font-light self-center">
            {{ timeEnd[1] }}
          </span>
        </span>
      </div>
    </div>
    <div
      class="row-start-1 row-end-1 col-start-2 col-end-2 justify-self-stretch"
    ></div>
    <!--    Transcript text-->
    <div
      class="row-start-2 row-end-2 col-start-2 col-end-2 justify-self-stretch md:ml-2"
    >
      <div class="w-full ml-0 justify-stretch text-slate-500">
        <div
          class="align-start items-start"
          :class="
            (isSpeakerOne ? 'ml-0' : 'ml-0', showMiliSec ? 'mr-1' : 'mr-5')
          "
        >
          <span v-if="isFirst" class="text-xs">{{ role }}</span>
          <div class="text-gray-800 font-bold h-full">
            <span
              class=""
              v-html="
                highlightMatches(nugget, searchQuery, chunkIndex, highlightTerm)
              "
            ></span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row-start-3 row-end-3 col-start-2 col-end-2 justify-self-stretch"
    ></div>
    <!--    Speaker 2: Start time-->
    <div class="row-start-1 row-end-1 col-start-3 col-end-3 min-w-12 max-w-12">
      <div v-if="!isSpeakerOne">
        <span class="flex text-xs self-center text-sky-600 mr-10">
          {{ timeStart[0] }}
          <span v-if="showMiliSec" class="text-xs font-light self-center">
            {{ timeStart[1] }}
          </span>
        </span>
      </div>
    </div>
    <!--    Speaker 2: Bar -->
    <div
      class="row-start-2 row-end-2 col-start-3 col-end-3 min-w-12 max-w-12"
      :class="{ 'pl-8': showMiliSec, 'pl-6': !showMiliSec }"
    >
      <div
        v-if="!isSpeakerOne"
        class="w-4 rounded-lg py-10 h-full flex justify-center -ml-4"
        :class="{
          'bg-[#A71F60]': color === '#A71F60',
          'bg-[#3BA8D4]': color === '#3BA8D4',
        }"
      >
        <div class="w-20 h-full">
          <svg
            class="w-12 h-12 z-20"
            viewBox="0 0 70 70"
            xmlns="http://www.w3.org/2000/svg"
            :stroke="color"
            stroke-width="2px"
            fill="white"
          >
            <circle cx="35" cy="40" r="30" />
            <text
              x="27"
              y="51"
              style="font: bold 24px inter; fill: black; stroke: none"
            >
              {{ name[0] }}
            </text>
          </svg>
        </div>
      </div>
    </div>
    <!--    Speaker 2: End time-->
    <div class="row-start-3 row-end-3 col-start-3 col-end-3 min-w-12 max-w-12">
      <div v-if="!isSpeakerOne">
        <span class="flex text-xs self-center text-sky-600 mr-10">
          {{ timeEnd[0] }}
          <span v-if="showMiliSec" class="text-xs font-light self-center">
            {{ timeEnd[1] }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    chunkIndex: Number,
    searchQuery: String,
    isActive: Boolean,
    isFirst: Boolean,
    isSpeakerOne: Boolean,
    nugget: {
      type: String,
      default: "",
    },
    timeStart: {
      type: Array,
      default: ["00:00", ""],
    },
    timeEnd: Array,
    color: {
      type: String,
      default: "black",
    },
    name: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    showMiliSec: {
      type: Boolean,
      default: false,
    },
    highlightTerm: Array,
  },
  data() {
    return { showChunk: false };
  },
  methods: {
    /**
     * Checks if a given letter matches a search query within a nugget string.
     *
     * @param {string} letter - The letter to check for a match.
     * @param {string} nugget - The string to search within.
     * @param {number} currentIndex - The index of the current letter in the nugget.
     * @return {boolean} Returns true if the search query matches the substring of the nugget starting at the current index and spanning the length of the search query. Returns false otherwise.
     */
    isMatch(letter, nugget, currentIndex) {
      const searchQuery = this.searchQuery;
      const queryLength = searchQuery.length;

      if (currentIndex + queryLength > nugget.length) {
        return false; // Not enough characters left for a match
      }

      const substring = nugget.substr(currentIndex, queryLength);
      return substring === searchQuery;
    },

    /**
     * Highlights matches in a given nugget string based on a search query and keyword indices.
     *
     * @param {string} nugget - The string to highlight matches in.
     * @param {string} searchQuery - The search query to match against.
     * @param {number} chunkIndex - The index of the chunk.
     * @param {Array<number>} keywordIndicesArray - An array of indices indicating which words to highlight.
     * @return {string} The nugget string with highlighted matches.
     */
    highlightMatches(nugget, searchQuery, chunkIndex, keywordIndicesArray) {
      if (searchQuery.length < 2) {
        if (!keywordIndicesArray) return nugget;
        let result = "";
        const nuggetArray = nugget.split(" ");

        for (let i = 0; i < nuggetArray.length; i++) {
          if (nuggetArray.length === keywordIndicesArray.length) {
            if (keywordIndicesArray[i] === 1) {
              // highlight keyword
              result += `<span class="underline text-emerald-600">${nuggetArray[i]}</span> `;
            } else if (keywordIndicesArray[i] === 0) {
              // no highlighting
              result += nuggetArray[i] + " ";
            } else if (keywordIndicesArray[i] === -1) {
              result += `<span class="underline text-orange">${nuggetArray[i]}</span> `;
            } else {
              // further highlights possible
            }
          } else {
            return nugget;
          }
        }
        // return nuggetArray.length + " VS " + keywordIndicesArray.length;

        return result;
      }
      const pattern = new RegExp(searchQuery, "gi");
      if (nugget.toLowerCase().includes(searchQuery.toLowerCase())) {
        this.$emit("scroll-to-highlighted", chunkIndex);
      }

      let wordIndex = 0; // track word index
      const nuggetArray = nugget.split(" ");

      return nuggetArray
        .map((word, index) => {
          // Apply search query highlight if search is active
          if (word.toLowerCase().includes(searchQuery.toLowerCase())) {
            word = word.replace(pattern, (match) => {
              // Check if the current word index should be underlined based on keywordIndicesArray
              if (
                keywordIndicesArray &&
                (keywordIndicesArray[index] === 1 ||
                  keywordIndicesArray[index] === -1)
              ) {
                return `<span class="bg-pink-300 underline">${match}</span>`;
              }
              return `<span class="bg-pink-300">${match}</span>`;
            });
          }

          // If keywordIndicesArray[index] is 1 or -1, underline the word regardless of the search query
          if (keywordIndicesArray && keywordIndicesArray[index] === 1) {
            word = `<span class="underline text-emerald-600">${word}</span>`;
          } else if (keywordIndicesArray && keywordIndicesArray[index] === -1) {
            word = `<span class="underline text-orange">${word}</span>`;
          }

          return word;
        })
        .join(" ");
    },
  },
  watch: {
    /**
     * Activates the component based on the value of val.
     *
     * @param {any} val - The value determining whether to activate the component.
     */
    isActive(val) {
      if (val) {
        this.showChunk = true;
        setTimeout(() => {
          this.showChunk = false;
          setTimeout(() => {
            this.showChunk = true;
            setTimeout(() => {
              this.showChunk = false;
            }, 1000);
          }, 300);
        }, 400);
      }
    },
  },
};
</script>
