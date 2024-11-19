<!--Feedback Component: Feedbackloudness.vue shows the loudness of the speaker as a line chart -->
<template>
  <div
    class="flex flex-col items-center mr-2 py-8 h-80 w-full"
    v-if="renderComponent"
  >
    <v-chart
      id="loudness"
      class="mx-auto w-full 2xl:h-72 xl:h-64 md:h-56 sm:h-48 -ml-14"
      :class="{ '-pb-10 -mb-10': size == 'small' }"
      :option="option"
    />
  </div>
</template>
<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import "echarts/lib/component/grid";
import * as echarts from "echarts";

import { mapState, mapGetters } from "vuex";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkLineComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkLineComponent,
  GridComponent,
]);
let store;
export default {
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
    colors: {
      type: Array,
      default: ["#3BA8D4", "#A71F60", "#BEBBBB"],
    },
    size: { type: String, default: "medium" },
  },
  data() {
    return {
      renderComponent: true,
      rounded: true,
      loudnessGlobal: { mean: [], maximum: [], minimum: [], diff: [] },
      timestamps: [],
      timeSamples: [],
      timestampsPrecise: [],
      transcriptData: [],
      loudnessData: [],
      loudnessDataPrecise: {
        data1: [],
        data2: [],
      },
      option: {
        color: this.colors,
        title: {
          text: "",
          left: 20,
          top: 8,
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a}: <b>{c}dB</b> <br/>{b}",
          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "item",
          // formatter: "{a}: <b>{c}dB</b> <br/>{b}",
          formatter(params) {
            store.commit("setCurrentDataPoint", params.dataIndex / 4);
            return `
                 ${params.seriesName}:
                  <b>${params.value} dB </b></br> <center> ( ${params.name} ) </center>`;
          },
        },
        legend: {
          orient: "vertical",
          data: [],
          right: 8,
          top: 0,
          textStyle: {
            fontSize: 14,
          },
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
        yAxis: {
          type: "value",
          name: "Relative Lautstärke",
          nameTextStyle: {
            padding: [0, 12, 14, -24],
            margin: [0, 0, 12, 12],
            fontSize: 16,
            fontStyle: "bold",
            align: "left",
          },
          axisLabel: {
            formatter: "{value}",
          },
        },
        dataZoom: [
          {
            type: "inside",
            throttle: 50,
          },
        ],

        series: [
          {
            name: "loudness1",
            data: [],
            type: "line",
          },
          {
            name: "loudness2",
            data: [],
            type: "line",
            smooth: true,
          },

          // {
          //   name: "Mittlere Lautstärke",
          //   data: [],
          //   type: "line",
          //   smooth: true,
          //   tooltip: {
          //     formatter: "{a}: <b>{c}</b> </br><center>( {b} ) </center>",
          //   },
          //   lineStyle: { color: "#000000", opacity: 0.15, symbol: "none" },
          //   itemStyle: { opacity: 0.1 },
          // },
          {
            name: "Maximale Lautstärke",
            stack: "x",
            data: [],
            type: "line",
            smooth: true,
            tooltip: {
              formatter: "{a}: <b>{c}</b> </br><center>( {b} ) </center>",
            },
            lineStyle: {
              color: "rgb(240, 240, 240)",
              opacity: 1,
              symbol: "none",
            },
            itemStyle: {
              opacity: 0,
              borderColor: "#000000",
              borderWidth: 0,
            },
            symbolSize: 1,
          },
          {
            name: "Minimale Lautstärke",
            type: "line",
            stack: "x", // stack name
            smooth: true,
            stackStrategy: "positive", // strategy
            lineStyle: {
              opacity: 0, // hide line
            },
            symbol: "none", // hide symbol
            areaStyle: {
              color: "rgb(230, 230, 230)",
              opacity: 1,
            },
            tooltip: {
              show: false, // hide value on tooltip
            },
          },
          // {
          //   name: "Gesprächslautstärke",
          //   data: [],
          //   type: "line",
          //   smooth: true,
          //   tooltip: {
          //     formatter: "{a}: <b>{c}</b> </br><center>( {b} ) </center>",
          //   },
          //   lineStyle: {
          //     color: "rgb(240, 240, 240)",
          //     opacity: 1,
          //     symbol: "none",
          //   },
          //   itemStyle: {
          //     opacity: 0,
          //     borderColor: "#000000",
          //     borderWidth: 0,
          //   },
          //   symbolSize: 1,
          //   // z: -1,
          // },
        ],
      },
    };
  },

  methods: {
    /**
     * Combines both speakers transcript arrays to an combinedArray and adds the speakerId to each
     * content chunk outputs an array sorted by timeStart
     *
     * @return {Array} The combined array of content objects sorted by timeStart
     */
    combineTranscript() {
      const combinedArray = [];
      const combinedLoudness = [];

      // console.log(this.transcripts[0])
      const transcripts = this.getTranscript.transcripts;
      transcripts.forEach((transcript) => {
        // console.log(transcript)
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
     * Parses the JSON time duration and populates timestamps and option xAxis data.
     *
     * @param {number} duration - The duration value to be parsed
     * @return {Array} The timestamps array after parsing
     */
    parseJSONtime(duration) {
      let rounded = Math.round(duration);

      let length;
      if (rounded < duration) {
        rounded++;
        length = rounded * 2 - 1;
      } else length = rounded * 2;

      for (let i = 1; i < length; i++) {
        this.$data.timestamps.push(this.toMMSS(i * 0.5)[0]);
        this.$data.timestamps.push(this.toMMSS(i * 0.5)[0] + ":50");

        this.$data.option.xAxis.data.push(this.toMMSS(i * 0.5)[0]);
        this.$data.option.xAxis.data.push(this.toMMSS(i * 0.5)[0] + ":50");
      }
      return this.$data.timestamps;
    },
    /**
     * Converts the input time in seconds to MM:SS format.
     *
     * @param {number} input - The input time in seconds to be converted
     * @return {Array} An array containing the minutes and seconds in MM:SS format
     */
    toMMSS(input) {
      const seconds = parseInt(input, 10);
      let minutes = Math.floor(seconds / 60);
      let extraSeconds = seconds % 60;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;

      var milsec = "";
      for (let i = 0; i < 2; i++) {
        milsec += input[input.length - i - 1];
        if (input[input.length - i - 1] == ".") {
          break;
        }
      }

      return Array(minutes + ":" + extraSeconds, " " + milsec);
    },

    /**
     * Parses the global data for the chart based on the input JSON.
     *
     * @param {Array} jsonIn - The input JSON data for parsing
     */
    parseDataGlobal(jsonIn) {
      const transcript = this.transcriptData;

      // Initialize minimum and maximum arrays for each point
      const minimumValues = jsonIn.map((entry) => entry.min);
      const maximumValues = jsonIn.map((entry) => entry.max);

      // Calculate the overall minimum and maximum for adjustment
      const minimum = Math.min(...minimumValues);
      const maximum = Math.max(...maximumValues);

      this.loudnessGlobal.mean = jsonIn.map((entry) =>
        Number((entry.mean + Math.abs(minimum)).toFixed(1))
      );
      this.loudnessGlobal.maximum = jsonIn.map((entry) =>
        Number((entry.max + Math.abs(minimum)).toFixed(1))
      );
      this.loudnessGlobal.minimum = jsonIn.map((entry) =>
        Number((entry.min + Math.abs(minimum)).toFixed(1))
      );

      this.loudnessData = jsonIn.map((entry) =>
        Number((entry.mean + Math.abs(minimum)).toFixed(0))
      );

      this.$data.option.series[0].data = jsonIn.map((entry, index) =>
        transcript[index] &&
        transcript[index].speakerId ==
          this.getCurrentFeedback.meta.speakers[0].id
          ? Number((entry.mean + Math.abs(minimum)).toFixed(0))
          : null
      );

      this.$data.option.series[1].data = jsonIn.map((entry, index) =>
        transcript[index] &&
        transcript[index].speakerId ==
          this.getCurrentFeedback.meta.speakers[1].id
          ? Number((entry.mean + Math.abs(minimum)).toFixed(0))
          : null
      );

      const max = [...this.loudnessGlobal.maximum];
      const min = [...this.loudnessGlobal.minimum];
      this.loudnessGlobal.diff = max.map((v, i) => min[i] - v);

      this.option.series[2].data = this.loudnessGlobal.maximum;
      this.option.series[3].data = this.loudnessGlobal.diff;
      this.option.series[4].data = this.loudnessGlobal.minimum;
    },
  },
  created() {
    this.transcriptData = this.combineTranscript();

    this.parseJSONtime(
      this.transcriptData[this.transcriptData.length - 1].timeEnd
    );
    this.option.series[0].data =
      this.getCurrentData.loudness.speakers[0].graphData;
    this.option.series[1].data =
      this.getCurrentData.loudness.speakers[1].graphData;
  },
  mounted() {
    store = this.$store;
    this.option.legend.data = [
      this.getFeedbackSpeakers[0].role,
      this.getFeedbackSpeakers[1].role,
      "Gesprächslautstärke",
    ];
    this.option.series[0].name = this.getFeedbackSpeakers[0].role;

    this.option.series[1].name = this.getFeedbackSpeakers[1].role;
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getFeedbackSpeakers: "getFeedbackSpeakers",
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getCurrentFeedback: "getCurrentFeedback",
      getCurrentConversationElement: "getCurrentConversationElement",
      getTranscript: "getTranscript",
      getCurrentData: "getCurrentData",
    }),
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
  width: 500px;
}
</style>
