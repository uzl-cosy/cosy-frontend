<template>
  <div
    v-if="errorMessage"
    class="mx-auto w-full flex items-center h-48 justify-center pl-10"
  >
    {{ errorMessage }}
  </div>
  <div v-else class="flex flex-col w-full h-80 mb-6">
    <!-- Filter Options -->
    <div class="flex flex-row self-end">
      <div
        class="flex flex-col rounded-lg bg-sky-100 pr-5 -mr-2"
        v-if="showFilter"
      >
        <!-- Filter for wordGroup -->
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
      </div>
      <span
        class="cursor-pointer hover:bg-sky-100 p-2.5 rounded-lg flex w-fit h-fit"
        :class="{ 'bg-sky-100': this.showFilter }"
        @click="
          this.showFilter = !this.showFilter;
          this.seeSubstantives = false;
        "
      >
        <Icon iconName="filter" class="p-0"></Icon>
      </span>
    </div>

    <!-- Scatter Plot -->
    <div class="scatter-plot-container pb-10 pr-6 pl-2">
      <v-chart
        ref="scatterChart"
        :option="chartOption"
        @chart-ready="onChartReady"
        autoresize
        class="scatter-chart"
      ></v-chart>
      <span v-if="loading" class="loading-indicator">
        <Icon size="48" iconName="arrowsCircle" class="animate-spin" />
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import Icon from "../interface-components/Icon.vue";
import FeedbackTranscriptFilterOptions from "./FeedbackTranscriptFilterOptions.vue";

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
]);

export default {
  name: "FeedbackScatterPlot",
  components: {
    VChart,
    Icon,
    FeedbackTranscriptFilterOptions,
  },
  provide: {
    [THEME_KEY]: "white",
  },
  data() {
    return {
      errorMessage: "",
      loading: true,
      showFilter: false,
      wordGroup: 0, // 0: All, 1: Nouns, 2: Verbs, 3: Adjectives
      wordsCount: 0, // 0: All, 1: >1, 2: >2, 3: >3
      chartOption: {
        color: ["#2563eb", "#db2777"],
        title: {
         
          subtext: "",
        },
        grid: {
          left: "3%",
          right: "7%",
          bottom: "7%",
          containLabel: true,
        },
        tooltip: {
          showDelay: 0,
          formatter: function (params) {
            return (
              params.seriesName +
              "<br/>Wort: " +
              params.name +
              "<br/>Allg. Häufigkeit: " +
              params.value[0] +
              ", Nutzung: " +
              params.value[1]
            );
          },
          axisPointer: {
            show: true,
            type: "cross",
            lineStyle: {
              type: "dashed",
              width: 1,
            },
          },
        },
        toolbox: {
          feature: {
            dataZoom: {},
            brush: {
              type: ["rect", "polygon", "clear"],
            },
          },
        },
        brush: {},
        legend: {
          data: [],
          left: "center",
          bottom: -5,
        },
        xAxis: [
          {
            name: "  Allg. \n  Häufigkeit",
            type: "value",
            scale: false,
            axisLabel: {
              formatter: "{value}",
            },
            splitLine: {
              show: false,
            },
            min: 0,
          },
        ],
        yAxis: [
          {
            name: '           Anzahl der Nennungen \n         im Gespräch', 
            type: "value",
            scale: true,
            axisLabel: {
              formatter: "{value}",
            },
            splitLine: {
              show: false,
            },
            min: 0,
            interval: 1,
          },
        ],
        series: [
          {
            name: "",
            type: "scatter",
            data: [],
          },
          {
            name: "",
            type: "scatter",
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    onChartReady() {
      this.loading = false;
    },
    setWordGroup(e, label) {
      if (e.label === label && label === "keywords") {
        this.wordGroup = e.newValue.value;
        this.updateChartData();
      } else {
        console.error("unexpected state", e);
      }
    },
    setWordsCount(e, label) {
      if (e.label === label && label === "keywordsCount") {
        this.wordsCount = e.newValue.value;
        this.updateChartData();
      } else {
        console.error("unexpected state", e);
      }
    },
    updateChartData() {
      const wordsData = [[], []]; // Index 0 for speaker1, Index 1 for speaker2
      const wordGroupMap = {
        0: null, // All
        1: "nouns",
        2: "verbs",
        3: "adjectives",
      };
      const selectedWordGroup = wordGroupMap[this.wordGroup];

      for (let speakerIndex = 0; speakerIndex <= 1; speakerIndex++) {
        let speakerWords = this.getKeywordFrequencies.filter(
          (item) => item.speaker === speakerIndex
        );

        // Apply word group filter
        if (selectedWordGroup) {
          speakerWords = speakerWords.filter(
            (item) => item.wordGroup === selectedWordGroup
          );
        }

        // Apply words count filter
        speakerWords = speakerWords.filter(
          (item) => item.count > this.wordsCount
        );

        // Prepare data for the scatter plot
        const scatterData = speakerWords.map((word) => {
          return {
            name: word.word,
            value: [word.frequency, word.count],
          };
        });

        wordsData[speakerIndex] = scatterData;
      }

      // Update chart data
      this.chartOption.series[0].data = wordsData[0];
      this.chartOption.series[1].data = wordsData[1];

      // Update the chart
      this.$nextTick(() => {
        this.$refs.scatterChart.setOption(this.chartOption);
      });
    },
    setupKeywordsFrequencies() {
      const keywordFrequencies = [];

      // Loop over both speakers
      for (let speakerIndex = 0; speakerIndex <= 1; speakerIndex++) {
        const speakerData = this.getWords.speakers[speakerIndex];
        if (!speakerData || !speakerData.data) {
          continue;
        }

        // Loop over all data elements for the speaker
        for (const dataElement of speakerData.data) {
          // For each word group
          const wordGroups = ["nouns", "verbs", "adjectives"];
          wordGroups.forEach((wordGroup) => {
            const wordGroupData = dataElement[wordGroup];
            if (!wordGroupData) {
              return;
            }

            const combinedCounts = wordGroupData.reduce((acc, obj) => {
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

            // Create objects with speaker, word, count, wordGroup
            for (const [word, count] of Object.entries(combinedCounts)) {
              keywordFrequencies.push({
                speaker: speakerIndex,
                word: word,
                count: count,
                wordGroup: wordGroup,
                frequency: 0,
              });
            }
            //console.log('keywordFrequencies ' + keywordFrequencies);
          });
        }
      }

      // Create a map for quick access to keywordFrequencies
      const keywordMap = {};
      keywordFrequencies.forEach((keyword) => {
        const key = `${keyword.speaker}_${keyword.word.toLowerCase().trim()}`;
        keywordMap[key] = keyword;
      });

      for (let speakerIndex = 0; speakerIndex <= 1; speakerIndex++) {
        const speakerData = this.getWords.speakers[speakerIndex];
        if (!speakerData || !speakerData.data) {
          continue;
        }

        for (const dataElement of speakerData.data) {
          const freqWordGroups = {
            nounFrequencies: "nouns",
            verbFrequencies: "verbs",
            adjFrequencies: "adjectives",
          };

          for (const [freqWordGroup, wordGroup] of Object.entries(
            freqWordGroups
          )) {
            const freqwordGroupData = dataElement[freqWordGroup];
            if (
              !freqwordGroupData ||
              Object.keys(freqwordGroupData).length === 0
            ) {
              continue;
            }

            for (const [word, frequency] of Object.entries(freqwordGroupData)) {
              const normalizedWord = word.toLowerCase().trim();
              const key = `${speakerIndex}_${normalizedWord}`;
              const keyword = keywordMap[key];

              if (keyword) {
                keyword.frequency = frequency;
              } else {
                keywordFrequencies.push({
                  speaker: speakerIndex,
                  word: word,
                  count: 0,
                  wordGroup: wordGroup,
                  frequency: frequency,
                });
              }
            }
          }
        }
      }
      // Store the data in Vuex store
      this.$store.commit("setKeywordFrequencies", keywordFrequencies);
    },
  },
  mounted() {
    const dataExists = this.getWords;

    if (
      !dataExists ||
      !dataExists.speakers ||
      dataExists.speakers[0].data.length === 0 ||
      dataExists.speakers[1].data.length === 0
    ) {
      this.errorMessage = "Keine Daten vorhanden";
      return;
    }

    this.showFilter = false;
    this.wordGroup = 0;
    this.wordsCount = 0;

    this.speaker1 = this.getCurrentFeedback.meta.speakers[0].role;
    this.speaker2 = this.getCurrentFeedback.meta.speakers[1].role;

    this.chartOption.legend.data = [this.speaker1, this.speaker2];
    this.chartOption.series[0].name = this.speaker1;
    this.chartOption.series[1].name = this.speaker2;

    // Initialize keyword frequencies if not already set
    if (
      !this.getKeywordFrequencies ||
      this.getKeywordFrequencies.length === 0
    ) {
      this.setupKeywordsFrequencies();
      console.log("Keyword frequencies initialized");
    }

    // Process data for the scatter plot
    this.updateChartData();

    this.loading = false;
  },
  computed: {
    ...mapGetters({
      getWords: "getWords",
      getCurrentFeedback: "getCurrentFeedback",
      getKeywordFrequencies: "getKeywordFrequencies",
    }),
  },
};
</script>

<style scoped>
.scatter-plot-container {
  position: relative;
  width: 100%;
  height: 400px;
}

.scatter-chart {
  width: 100%;
  height: 100%;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
