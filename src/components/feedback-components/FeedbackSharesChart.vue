<!--Feedback Component: FeedbackSharesChart.vue shows the speaker's shares as a pie chart-->
<template>
  <div
    class="flex items-center justify-center w-full"
    :class="{ 'py-7': size == 'small', 'p-6 mx-4 w-full': size == 'big' }"
    v-if="renderComponent"
  >
    <v-chart
      class="mx-auto w-full 2xl:h-72 xl:h-72 md:h-64 sm:h-48"
      :option="option"
    />
  </div>
</template>
<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
  name: "FeedbackSharesChart",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "white",
  },
  props: {
    names: {
      type: Array,
      default: "TODO",
    },
    size: {
      type: String,
      default: "small",
    },
    // myShares: { type: Array, default: [0, 0, 0] },
  },
  data() {
    return {
      transcripts: [],
      renderComponent: true,
      speakers: [],
      shares: [],
      dataValues: [],
      combinedTranscript: [],
      totalTime: 0,
      option: {
        // grid: { top: 25 },
        title: {
          text: "Anteile insgesamt",
          left: 20,
          top: 0,
          textStyle: {
            fontSize: this.windowWidth > 1200 ? 24 : 16,
          },
        },
        tooltip: {
          trigger: "item",
          formatter(params) {
            return `${params.name}: <b>${params.data.valueTime}</b> (${params.data.percent}%) }`;
          },
          // formatter: "{b} : {c} Sek (<b>{d}%</b>)",

          textStyle: {
            fontSize: this.windowWidth > 1200 ? 20 : 12,
          },
        },
        legend: {
          orient: "horizontal",
          top: "center",
          left: "right",
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 14,
          data: [
            { name: "1.Sprecher*in", name: "2.Sprecher*in" },
            { name: "Gleichzeitiges Sprechen", name: "Gesprächspause" },
          ],
          right: 1,
          top: 25,
        },
        series: [
          {
            color: ["#166DE0", "#6F1694", "#F9A8D4", "#DDDDDD"],
            name: "Redeanteil",
            type: "pie",
            left: 75,
            radius: "55%",
            center: ["49%", "60%"],
            fontWeight: "bold",
            avoidLabelOverlap: false,
            data: [
              {
                value: 33,
                valueTime: "",
                name: "Name nicht gefunden",
                percentPrecision: 0,

                label: {
                  show: true,
                  trigger: "item",
                  formatter(params) {
                    return `${params.name}: <b>${params.data.value}</b>`;
                  },
                  backgroundColor: "#FFF",
                  borderColor: "#3BA8D4",
                  borderWidth: 2,
                  borderRadius: 5,
                  padding: this.windowWidth > 1200 ? 10 : 8,

                  color: "#000",
                  fontSize: this.windowWidth > 1200 ? 20 : 12,
                  fontWeight: "bold",
                  lineHeight: this.windowWidth > 1200 ? 10 : 8,
                },
              },
              {
                value: 10,
                valueTime: "",
                percent: 0,
                name: "Name nicht gefunden",
                percentPrecision: 0,

                label: {
                  show: true,
                  formatter(params) {
                    return `${params.name}: <b>${params.data.value}</b>`;
                  },
                  backgroundColor: "#FFF",
                  borderColor: "#A71F60",
                  borderWidth: 2,
                  borderRadius: 5,
                  padding: this.windowWidth > 1200 ? 10 : 8,

                  color: "#000",
                  fontSize: this.windowWidth > 1200 ? 20 : 12,
                  fontWeight: "bold",

                  lineHeight: this.windowWidth > 1200 ? 10 : 8,
                },
              },
              {
                value: 84,
                valueTime: "",
                percent: 0,
                name: "Gleichzeitiges Sprechen",
                percentPrecision: 0,

                label: {
                  show: true,
                  top: "middle",
                  width: 180,
                  formatter(params) {
                    return `${params.name}: <b>${params.data.value}</b>`;
                  },
                  backgroundColor: "#FFF",
                  borderColor: "#F9A8D4",
                  borderWidth: 2,
                  borderRadius: 5,
                  align: "center",
                  padding: this.windowWidth > 1200 ? [8, 0] : [6, -5],

                  color: "#111",
                  fontSize: this.windowWidth > 1200 ? 18 : 10,
                  fontWeight: "bold",

                  lineHeight: this.windowWidth > 1200 ? 10 : 8,
                },
              },
              {
                value: 84,
                valueTime: "",
                percent: 0,
                name: "Pausen",
                percentPrecision: 0,

                label: {
                  show: true,
                  formatter(params) {
                    return `${params.name}: <b>${params.data.value}</b>`;
                  },
                  backgroundColor: "#FFF",
                  borderColor: "#BEBBBB",
                  borderWidth: 2,
                  borderRadius: 5,
                  padding: this.windowWidth > 1200 ? 10 : 8,

                  color: "#111",
                  fontSize: this.windowWidth > 1200 ? 20 : 12,
                  fontWeight: "bold",
                  lineHeight: this.windowWidth > 1200 ? 10 : 8,
                },
              },
            ],

            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
    };
  },
  methods: {
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

    /**
     * Converts a given input (in seconds or a string representation of seconds) to a formatted string in the format of minutes:seconds.miliseconds.
     *
     * @param {number|string} input - The input to be converted. If it is a number, it is assumed to be in seconds. If it is a string, it is parsed as a number.
     * @return {Array<string>} An array containing two strings: the first string is the formatted time in the format of minutes:seconds, and the second string is the formatted time in the format of miliseconds.
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

      return [minutes + ":" + seconds, " " + milsec];
    },
    /**
     * Finds a speaker by ID in the speakers array.
     *
     * @param {number} id - The ID of the speaker to find.
     * @return {Object} The found speaker object or default values if not found.
     */
    getSpeakerById(id) {
      const speaker = this.speakers.find((speaker) => speaker.id === id);
      return speaker
        ? speaker
        : {
            name: "Sprecher*in",
            role: "Rolle",
            id: "",
            color: "#000000",
          };
    },
    /**
     * Parses the label content for each data name in the series.
     *
     * @param {Array} value - The array of values.
     * @return {void} This function does not return a value.
     */
    parseLabelContent(value) {
      const dataNames = this.$data.option.series[0].data;
      for (let i = 0; i < dataNames.length; i++) {
        // dataNames[i].label.formatter = "{textBorder| " + value[i] + "}"; // in case of adding specific styling
        dataNames[i].label.formatter =
          value[i] +
          " (" +
          Number((Number(this.dataValues[i]) / this.totalTime) * 100).toFixed(
            2
          ) +
          " %)";
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
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getFeedbackSpeakers: "getFeedbackSpeakers",
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getCurrentFeedback: "getCurrentFeedback",
      getConversationShares: "getConversationShares",
      getCurrentRecord: "getCurrentRecord",
      getTranscript: "getTranscript",
      getCurrentData: "getCurrentData",
    }),
  },
  async mounted() {
    try {
      this.transcripts = this.getTranscript.transcripts;
      this.combinedTranscript = this.combineTranscript();
      this.shares = this.getCurrentData.conversationShares;

      this.speakers = this.getCurrentFeedback.meta.speakers;
      this.option.series[0].color = [
        this.getFeedbackSpeakers[0].color,
        this.getFeedbackSpeakers[1].color,
        "#F9A8D4",
        "#DDDDDD",
      ];

      this.option.legend.data = [
        this.getFeedbackSpeakers[0].role,
        this.getFeedbackSpeakers[1].role,

        "Gleichzeitiges Sprechen",
        "Gesprächspause",
      ];
      this.option.series[0].data[0].name = this.getFeedbackSpeakers[0].role;
      this.option.series[0].data[1].name = this.getFeedbackSpeakers[1].role;
      this.option.series[0].data[2].name = "Gleichzeitiges Sprechen";
      this.option.series[0].data[3].name = "Gesprächspause";

      const share1 = Math.max(
        0,
        Math.round(
          10 *
            (this.shares.speakers[0].statisticValues.spokenTime -
              this.shares.stats.overlaps)
        ) / 10
      );
      const share2 = Math.max(
        0,
        Math.round(
          10 *
            (this.shares.speakers[1].statisticValues.spokenTime -
              this.shares.stats.overlaps)
        ) / 10
      );

      const share3 = Math.round(10 * this.shares.stats.overlaps) / 10;
      const overlaps = this.shares.stats.overlaps;
      this.totalTime =
        this.combinedTranscript[this.combinedTranscript.length - 1].timeEnd -
        this.combinedTranscript[0].timeStart;
      this.dataValues = [
        share1,
        share2,
        share3,
        this.totalTime - share1 - share2 - overlaps,
      ];

      // First speaker share
      this.option.series[0].data[0].value = share1;
      this.option.series[0].data[0].percent = Math.round(
        (share1 / this.totalTime) * 100
      );

      // Second speaker share
      this.option.series[0].data[1].value = share2;
      this.option.series[0].data[1].percent = Math.round(
        (share2 / this.totalTime) * 100
      );

      // overlaps
      this.option.series[0].data[2].value = overlaps;
      this.option.series[0].data[2].percent = Math.round(overlaps * 100);

      // pauses
      this.option.series[0].data[3].value =
        this.totalTime - share1 - share2 - overlaps;
      this.option.series[0].data[3].percent = Math.round(
        ((this.totalTime - share1 - share2 - overlaps) / this.totalTime) * 100
      );

      const transcript = JSON.parse(JSON.stringify(this.getTranscript)).content;

      this.parseLabelContent([
        (this.option.series[0].data[0].name = this.getFeedbackSpeakers[0].role),
        (this.option.series[0].data[1].name = this.getFeedbackSpeakers[1].role),
        (this.option.series[0].data[2].name = "Gleichzeitiges Sprechen"),
        (this.option.series[0].data[3].name = "Gesprächspause"),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
  width: 500px;
}
</style>
