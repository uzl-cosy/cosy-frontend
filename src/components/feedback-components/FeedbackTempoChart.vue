<!--Feedback Component: FeedbackTempoChart.vue shows the speaker's tempo as a line chart-->
<template>
  <div
    class="flex items-center justify-center w-full"
    :class="{ 'h-80 mt-6 -mb-6': size !== 'small' }"
    v-if="renderComponent"
  >
    <v-chart
      class="w-full 2xl:h-72 xl:h-64 md:h-56 sm:h-48 m-auto -ml-14"
      :class="{ '-pb-10 -mb-10': size === 'small', 'mt-1': size !== 'small' }"
      :option="option"
      id="tempo"
    />
    <span class="absolute" v-if="loading">
      <Icon
        size="48"
        iconName="arrowsCircle"
        color="gray"
        class="mx-12 animate-spin"
      ></Icon
    ></span>

    <ChartKeyNumber
      class="mr-12"
      v-if="showSpecs"
      :name1="getFeedbackSpeakers[0].role"
      :name2="getFeedbackSpeakers[1].role"
      :number1="Number(average1).toFixed(2)"
      :number2="Number(average2).toFixed(2)"
      measure1="Silben / sek"
      measure2="Silben / sek"
    ></ChartKeyNumber>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import "echarts/lib/component/grid";
import Icon from "../interface-components/Icon.vue";
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
import { ref, defineComponent } from "vue";
import InfoArea from "../interface-components/InfoArea.vue";
import axios from "axios";
import { API_URL } from "../../config";
import ChartKeyNumber from "../interface-components/ChartKeyNumber.vue";
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
  name: "FeedbackTempoChart",
  components: {
    VChart,
    InfoArea,
    ChartKeyNumber,
    Icon,
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
    tempoValues: { type: Array, default: "TODO" },
    showSpecs: { type: Boolean, default: true },
    size: { type: String, default: "medium" },
  },
  data() {
    return {
      loading: true,
      renderComponent: true,
      rounded: true,
      tempoGlobal: { mean: [], maximum: [], minimum: [], diff: [] },
      timestamps: [],
      timeSamples: [],
      timestampsPrecise: [],
      tempoData: [],
      transcriptData: [],
      average1: 0,
      average2: 0,
      option: {
        color: [],
        // title: {
        //   text: "Sprechtempo",
        //   left: 45,
        //   top: -5,
        //   bottom: 1,
        //   textStyle: {
        //     fontSize: 22,
        //     // fontStyle: "bold",
        //   },
        // },
        tooltip: {
          trigger: "item",
          formatter: "{a}: <b>{c}Silben pro Chunk</b> <br/>{b}",

          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "item",
          // formatter: "{a}: <b>{c}dB</b> <br/>{b}",
          formatter: function (params) {
            return `
                 ${params.seriesName}:
                  <b>${params.value} Silben pro Sekunde </b></br> <center> ( ${params.name} ) </center>`;
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
          name: "Silben pro Sekunde",
          nameTextStyle: {
            padding: [12, 4, 6, -24],
            // margin: [5, 5, 5, 5],
            fontSize: 15,
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
            name: "",
            data: [],
            type: "line",
            smooth: true,
            markLine: {
              data: [
                {
                  name: "⌀ Sprecher 1",
                  yAxis: 4, // Set the y-axis value for the threshold
                  label: {
                    show: true,
                    position: "end",
                    formatter: "⌀",
                  },
                  tooltip: {
                    formatter: function (params) {
                      // Customize the tooltip content
                      return `
                 ${params.name}: <br>
                  <center><b>${params.value}</b> Silben / Sek</center>`;
                    },
                  },
                  lineStyle: {
                    normal: {
                      type: "dashed",
                      opacity: "0.5",
                    },
                  },
                },
              ],
            },
          },
          {
            name: "",
            data: [],
            type: "line",
            smooth: true,
            markLine: {
              data: [
                {
                  name: "⌀ Sprecher 2",

                  yAxis: 4, // Set the y-axis value for the threshold
                  label: {
                    show: true,
                    position: "end",
                    formatter: "⌀",
                  },
                  lineStyle: {
                    normal: {
                      type: "dashed",
                      opacity: "0.5",
                    },
                  },
                  tooltip: {
                    formatter: function (params) {
                      // Customize the tooltip content
                      return `
                 ${params.name}: <br>
                  <center><b>${params.value}</b> Silben / Sek</center>`;
                    },
                  },
                },
              ],
            },
          },

          {
            name: "Maximales Sprechtempo",
            stack: "x",
            data: [],
            type: "line",
            smooth: true,
            tooltip: {
              formatter: "{a}: <b>{c}</b> </br><center>( {b} ) </center>",
            },
            lineStyle: {
              color: "rgb(35, 142, 133)",
              opacity: 0.1,
              symbol: "none",
            },
            itemStyle: {
              opacity: 0.1,
              borderColor: "#000000",
              borderWidth: 0,
            },
            symbolSize: 1,
          },
          {
            type: "line",
            stack: "x", // stack name
            smooth: true,
            stackStrategy: "positive", // strategy
            lineStyle: {
              opacity: 0, // hide line
            },
            symbol: "none", // hide symbol
            areaStyle: {
              color: "rgb(35, 142, 133)",
              opacity: 0.25,
            },
            tooltip: {
              show: false, // hide value on tooltip
            },
          },
          {
            name: "Minimales Sprechtempo",
            data: [],
            type: "line",
            smooth: true,
            tooltip: {
              formatter: "{a}: <b>{c}</b> </br><center>( {b} ) </center>",
            },
            lineStyle: {
              color: "rgb(35, 142, 133)",
              opacity: 0.1,
              symbol: "none",
            },
            itemStyle: {
              opacity: 0.1,
              borderColor: "#000000",
              borderWidth: 0,
            },
            symbolSize: 1,
            // z: -1,
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getFeedbackSpeakers: "getFeedbackSpeakers",
      getRoomConfig: "getRoomConfig",
      getFeedback: "getFeedback",
      getCurrentSession: "getCurrentSession",
      getCurrentFeedback: "getCurrentFeedback",
      getCurrentConversationElement: "getCurrentConversationElement",
      getCurrentData: "getCurrentData",
    }),
  },
  methods: {
    /**
     * A function that toggles the renderComponent property to trigger a resize of the component.
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
     * Parses the JSON time data and populates timestamps and option xAxis data.
     *
     * @param {Array} jsonIn - The JSON array containing time data
     * @return {Array} The timestamps array after parsing
     */
    parseJSONtime(jsonIn) {
      for (let i = 0; i < jsonIn.length; i++) {
        this.timestamps.push(this.toMMSS(jsonIn[i].timeStart));
        this.timeSamples.push(jsonIn[i]);
        this.option.xAxis.data.push(this.toMMSS(jsonIn[i].timeStart)[0] + "");
      }
      return this.$data.timestamps;
    },
    /**
     * Converts a given input time in seconds to the format of minutes and seconds,
     * optionally including milliseconds.
     *
     * @param {number|string} input - The input time in seconds or a string representation of time.
     * @return {Array} An array containing the time in the format of minutes and seconds,
     *                 and the milliseconds if present.
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

    parseTempoGlobal(jsonIn) {
      this.$data.tempoGlobal = {
        tempo_mean: jsonIn[0],
        tempo_max: jsonIn[1],
        tempo_min: jsonIn[2],
      };

      // this.$data.option.markLine.data = [jsonIn[0], jsonIn[1], jsonIn[2]];
    },
    calculateAverage(array) {
      let total = 0;
      let count = 0;

      array.forEach(function (item, index) {
        // Convert the string to a floating-point number
        const numericValue = parseFloat(item);

        // Check if the conversion was successful (not NaN)
        if (!isNaN(numericValue)) {
          total += numericValue;
          count++;
        }
      });

      return count === 0 ? 0 : total / count;
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

      // console.log(this.transcripts[0])
      let transcripts = this.getTranscript.transcripts;
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
  },
  created() {
    this.transcriptData = this.combineTranscript();

    this.parseJSONtime(
      this.transcriptData[this.transcriptData.length - 1].timeEnd
    );

    this.option.series[0].data =
      this.getCurrentData.tempo.speakers[0].graphData;
    this.option.series[1].data =
      this.getCurrentData.tempo.speakers[1].graphData;

    this.average1 = this.calculateAverage(
      this.getCurrentData.tempo.speakers[0].graphData
    );
    this.average2 = this.calculateAverage(
      this.getCurrentData.tempo.speakers[1].graphData
    );
    this.$data.option.series[0].markLine.data[0].yAxis = this.average1;
    this.$data.option.series[1].markLine.data[0].yAxis = this.average2;
  },
  mounted() {
    store = this.$store;

    this.option.legend.data = [
      this.getFeedbackSpeakers[0].role,
      this.getFeedbackSpeakers[1].role,
    ];
    this.option.series[0].name = this.getFeedbackSpeakers[0].role;
    this.option.series[1].name = this.getFeedbackSpeakers[1].role;
    this.option.color = [
      this.getFeedbackSpeakers[0].color,
      this.getFeedbackSpeakers[1].color,
      "#BEBEBE",
    ];
    this.loading = false;
  },
  computed: {
    ...mapGetters([
      "getFeedbackSpeakers",
      "getCurrentFeedback",
      "getTimeStamps",
      "getConversationShares",
      "getCurrentData",
      "getTranscript",
    ]),
  },
};
</script>

<style scoped>
.chart {
  height: 200px;
  width: 500px;
}
</style>
