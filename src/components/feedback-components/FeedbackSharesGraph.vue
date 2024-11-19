<!--Feedback Component: FeedbackSharesGraph.vue shows the speaker's shares as an area line chart-->
<template>
  <div class="flex flex-col items-center justify-start pt-3" ref="sharesGraph">
    <div class="w-full ml-96 z-20">
      <ButtonPanelHorizontal
        class="-mb-12 z-20"
        size="small"
        :options="[{ name: 'relativ' }, { name: 'kumulativ' }]"
        @update="
          (e) => {
            console.log(e.name);
            if (e.name == '1') {
              this.option.series[0].data = this.normalizedShares.speaker1;
              this.option.series[1].data = this.normalizedShares.speaker2;
              this.option.series[2].data = this.normalizedShares.speaker3;
            } else {
              this.option.series[0].data = this.shares.speaker1;
              this.option.series[1].data = this.shares.speaker2;
              this.option.series[2].data = this.shares.overlaps;
            }
          }
        "
      ></ButtonPanelHorizontal>
    </div>
    <v-chart class="h-80 w-full" :option="option" />
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, defineComponent } from "vue";
import ButtonPanelHorizontal from "../form-components/ButtonPanelHorizontal.vue";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
]);

export default {
  name: "FeedbackSharesGraph",
  components: {
    VChart,
    ButtonPanelHorizontal,
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
    colors: {
      type: Array,
      default: ["#3BA8D4", "#A71F60", "#F9A8D4"],
    },
  },
  data() {
    return {
      transcriptData: [],
      timeStamps: [],
      windowWidth: window.innerWidth,
      renderComponent: true,
      speakers: [],
      normalizedShares: { speaker1: [], speaker2: [], overlaps: [] },
      shares: [],
      option: {
        color: this.colors,
        title: {
          text: "",
          left: 20,
          top: 2,
          textStyle: {
            fontSize: this.windowWidth > 1200 ? 14 : 8,
          },
        },
        tooltip: {
          // trigger: "item",
          // formatter: function (params) {
          //   store.commit("setCurrentDataPoint", params.dataIndex / 4);
          //   return `${params.name}: <b>${params.data.valueTime}</b> (${params.data.percent}%) }`;
          // },
          // // formatter: "{b} : {c} Sek (<b>{d}%</b>)",
          // textStyle: {
          //   fontSize: this.windowWidth > 1200 ? 20 : 12,
          // },
        },

        tooltip: {
          trigger: "axis",
          function(params) {
            store.commit("setCurrentDataPoint", params.dataIndex / 4);
            return `${params.name}: <b>${params.data}</b> spricht) }`;
          },
          // axisPointer: {
          //   type: "line",
          //   lineStyle: {
          //     color: "rgba(0,0,0,0.2)",
          //     width: 1,
          //     type: "solid",
          //   },
          // },
        },
        legend: {
          orient: "vertical",
          data: ["1.Sprecher*in", "2.Sprecher*in", "Gleichzeitiges Sprechen"],
          right: 5,
          itemHeight: 10,
          itemGap: 5,
          textStyle: {
            lineHeight: 3,
            fontSize: 12,
          },
          top: -5,
        },
        toolbox: {
          left: "left",
          itemSize: 20,
          bottom: 0,
          left: "center",
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
          },
        },
        yAxis: {
          type: "value",
          name: "Redeanteile",
          nameTextStyle: {
            padding: [0, 12, 14, -10],
            margin: [0, 0, 12, 12],
            fontSize: 16,
            fontStyle: "bold",
            align: "left",
          },
          axisLabel: {
            formatter: "{value}",
          },
        },

        xAxis: {
          type: "category",
          // interval: 0,
          // data: 0,
          name: "Zeit",
          nameTextStyle: {
            fontSize: 14,
            fontStyle: "bold",
            align: "left",
            padding: [12, 12, 1, 0],
            overflow: "breakAll",
          },
          nameLocation: "end",
          data: [],
        },

        dataZoom: [
          {
            type: "inside",
            throttle: 50,
          },
        ],

        series: [
          {
            name: "share1",
            type: "line",
            smooth: false,
            data: [],
            symbol: "none",

            stack: "Total",
            areaStyle: {},
            lineStyle: {
              color: "rgba(0,0,0,0)", // Transparent line
            },
            emphasis: {
              focus: "series",
            },
          },
          {
            name: "share2",
            data: [],
            type: "line",
            symbol: "none",

            smooth: false,
            stack: "Total",
            areaStyle: {},
            lineStyle: {
              color: "rgba(0,0,0,0)", // Transparent line
            },
            emphasis: {
              focus: "series",
            },
          },
          {
            name: "share3",
            data: [],
            type: "line",
            symbol: "none",
            lineStyle: {
              color: "rgba(0,0,0,0)", // Transparent line
            },

            smooth: false,
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
          },
          // {
          //   name: "",
          //   data: [],
          //   type: "line",
          //   stack: "Total",
          //   areaStyle: {},
          //   emphasis: {
          //     focus: "series",
          //   },
          //   smooth: true,
          // },
          // {
          //   name: "",
          //   data: [],
          //   type: "area",
          //   smooth: true,
          //   // markLine: {
          //   //   data: [
          //   //     {
          //   //       name: "Durchschnittlicher Pitch",
          //   //       // yAxis: pitchGlobal[0],
          //   //       symbol: "none",
          //   //       lineStyle: { color: "#000000", symbol: "none" },
          //   //     },
          //   //     {
          //   //       name: "Maximaler Pitch",
          //   //       // yAxis: pitchGlobal[1],
          //   //       symbol: "none",
          //   //       lineStyle: { color: "#000000", symbol: "none" },
          //   //     },
          //   //     {
          //   //       name: "Minimaler Pitch",
          //   //       // yAxis: pitchGlobal[2],
          //   //       symbol: "none",
          //   //       lineStyle: { color: "#000000", symbol: "none" },
          //   //     },
          //   //   ],
          //   // },
          // },
        ],
      },
    };
  },
  methods: {
    /**
     * A method that handles the resize event.
     *
     * @return {void} No return value.
     */
    onResize() {
      this.isRenderingComponent = false;

      this.$nextTick(() => {
        this.isRenderingComponent = true;
      });
    },
    /**
     * Asynchronously reloads the component by toggling the renderComponent property.
     *
     * @return {Promise<void>} A promise that resolves when the component has been reloaded.
     */
    async reload() {
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },

    /**
     * Converts the input time in seconds to a formatted string in MM:SS format with optional milliseconds.
     *
     * @param {number|string} input - The input time in seconds to be converted. If it is a number, it is assumed to be in seconds. If it is a string, it is parsed as a number.
     * @return {Array<string>} An array containing two strings: the first string is the formatted time in the format of minutes:seconds, and the second string is the formatted time in the format of milliseconds.
     */
    toMMSS(input) {
      const seconds = parseInt(input, 10);
      let minutes = Math.floor(seconds / 60);
      let extraSeconds = seconds % 60;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;

      let milsec = "";
      for (let i = 0; i < 2; i++) {
        milsec += input[input.length - i - 1];
        if (input[input.length - i - 1] == ".") {
          break;
        }
      }

      if (milsec != "") milsec = ":" + milsec;

      return Array(minutes + ":" + extraSeconds, " " + milsec);
    },

    /**
     * Finds a speaker by ID in the speakers array.
     *
     * @param {number} id - The ID of the speaker to find.
     * @return {Object} The found speaker object or default values if not found.
     */
    getSpeakerById(id) {
      let speaker = this.speakers.find((speaker) => speaker.id === id);
      if (speaker) {
        return speaker;
      } else
        return { name: "Sprecher*in", role: "Rolle", id: "", color: "#000000" };
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
          Number(
            this.shares[i].value /
              (this.shares[0].value +
                this.shares[1].value +
                this.shares[2].value)
          ).toFixed(2) *
            100 +
          " %)";
      }
    },

    /**
     * Calculates the time in MM:SS format for each timestamp in the given array and adds it to the x axis .
     *
     * @param {Array} timestamps - An array of timestamps in seconds.
     */
    calculateTime(timestamps) {
      for (let i = 0; i < timestamps.length; i++) {
        this.option.singleAxis.data.push(this.toMMSS(timestamps[i]));
      }
    },

    /**
     * Parses the JSON time based on the provided duration and updates the x-axis data.
     *
     * @param {number} duration - The duration value to be parsed
     */
    parseJSONtime(duration) {
      let rounded = Math.round(duration);

      let length;
      if (rounded < duration) {
        rounded++;
        length = rounded * 2 - 1;
      } else length = rounded * 2;

      for (let i = 1; i < length; i++) {
        this.$data.option.xAxis.data.push(this.toMMSS(i * 0.5)[0]);
        this.$data.option.xAxis.data.push(this.toMMSS(i * 0.5)[0] + ":50");
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
      const combinedLoudness = [];

      const transcripts = this.getTranscript.transcripts;
      transcripts.forEach((transcript) => {
        transcript.content.forEach((contentObject) => {
          contentObject.speakerId = transcript.speakerId;
          combinedArray.push(contentObject);
        });
      });
      combinedArray.sort(
        (a, b) => parseFloat(a.timeStart) - parseFloat(b.timeStart)
      );

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
      getCurrentData: "getCurrentData",
      getTranscript: "getTranscript",
    }),
  },
  created() {
    this.transcriptData = this.combineTranscript();

    this.parseJSONtime(
      this.transcriptData[this.transcriptData.length - 1].timeEnd
    );

    const speakingTimes1 = this.getCurrentData.loudness.speakers[0].graphData;
    const speakingTimes2 = this.getCurrentData.loudness.speakers[1].graphData;
    const result1 = [];
    const result2 = [];
    const result3 = [];

    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;

    const cumulative1 = [];
    const cumulative2 = [];
    const cumulative3 = [];

    for (let i = 0; i < speakingTimes1.length; i++) {
      if (!speakingTimes1[i] && speakingTimes2[i]) {
        result2.push(1);
        result1.push(0);
        result3.push(0);
        counter2++;
      } else if (!speakingTimes2[i] && speakingTimes1[i]) {
        result1.push(1);
        result2.push(0);
        result3.push(0);
        counter1++;
      } else if (speakingTimes1[i] && speakingTimes2[i]) {
        result3.push(1);
        result2.push(0);
        result1.push(0);
        counter3++;
      } else {
        result2.push(0);
        result1.push(0);
        result3.push(0);
      }
      cumulative1.push(counter1);
      cumulative2.push(counter2);
      cumulative3.push(counter3);
    }

    this.shares.speaker1 = result1;
    this.shares.speaker2 = result2;
    this.shares.overlaps = result3;

    this.normalizedShares.speaker1 = cumulative1;
    this.normalizedShares.speaker2 = cumulative2;
    this.normalizedShares.overlaps = cumulative3;

    this.option.series[0].data = result1;
    this.option.series[1].data = result2;
    this.option.series[2].data = result3;
  },
  mounted() {
    this.option.legend.data = [
      this.getFeedbackSpeakers[0].role,
      this.getFeedbackSpeakers[1].role,
      "Gleichzeitiges Sprechen",
    ];
    this.option.series[0].name = this.getFeedbackSpeakers[0].role;
    this.option.series[1].name = this.getFeedbackSpeakers[1].role;

    this.option.series[2].name = "Gleichzeitiges Sprechen";
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
  width: 500px;
}
</style>
