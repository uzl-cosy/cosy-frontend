<!--Feedback Component: FeedbackPitchChart.vue shows the speaker's pitch as a line chart-->
<template>
  <!-- <div
    v-if="this.errorMessage"
    class="mx-auto w-full flex items-center h-48 justify-center pl-10"
  >
    {{ this.errorMessage }}
  </div> -->
  <div
    class="flex flex-col items-center px-6 mr-2 h-80 w-full"
    v-if="renderComponent"
  >
    <v-chart
      id="pitch"
      class="m-auto w-full 2xl:h-72 xl:h-64 md:h-56 sm:h-48 -ml-14"
      :class="{ '-pb-10 -mb-10': size == 'small' }"
      :option="option"
    />
    <span class="absolute" v-if="loading">
      <Icon
        size="48"
        iconName="arrowsCircle"
        color="gray"
        class="mx-12 animate-spin"
      ></Icon
    ></span>
  </div>
</template>
<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import "echarts/lib/component/grid";
import { mapGetters } from "vuex";
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
import Icon from "../interface-components/Icon.vue";
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
  name: "FeedbackPitchChart",
  components: {
    VChart,
    InfoArea,
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
    pitchValues: { type: Array, default: "TODO" },
    size: { type: String, default: "medium" },
  },
  data() {
    return {
      errorMessage: "",
      loading: true,
      renderComponent: true,
      transcript: [],
      rounded: true,
      pitchGlobal: { mean: [], maximum: [], minimum: [], diff: [] },
      timestamps: [],
      timeSamples: [],
      timestampsPrecise: [],
      pitchData: [],
      pitchDataPrecise: {
        data1: [],
        data2: [],
      },
      option: {
        color: this.colors,
        title: {
          text: "",
          left: 20,
          top: 20,
          textStyle: {
            fontSize: 14,
          },
        },
        // grid: { top: 60 },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            store.commit("setCurrentDataPoint", params.dataIndex / 4);
            return `
                 ${params.seriesName}:
                  <b>${params.value} Hz </b></br> <center> ( ${params.name} ) </center>`;
          },
        },
        legend: {
          orient: "vertical",
          data: [],
          right: 0,
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
          name: "Frequenz in Hz",
          nameTextStyle: {
            padding: [0, 12, 14, -24],
            margin: [0, 0, 12, 12],
            fontSize: 16,
            fontStyle: "bold",
            align: "left",
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
            // markArea: {
            //   silent: false,
            //   name: "männer",

            //   itemStyle: {
            //     // decal: { dashArrayy: [5, 5] },
            //     color: "rgb(240, 240, 240)",
            //     opacity: 0.3,
            //   },
            //   data: [
            //     [
            //       {
            //         yAxis: "120",
            //       },
            //       {
            //         yAxis: "300",
            //       },
            //     ],
            //   ],
            // },
          },
          {
            name: "",
            data: [],
            type: "line",
            smooth: true,
          },
          {
            name: "Maximale Stimmfrequenz",
            stack: "x",
            data: [],
            type: "line",
            smooth: true,
            tooltip: {
              formatter: "{a}: <b>{c}</b> </br><center>( {b} ) </center>",
            },
            lineStyle: {
              color: "rgb(240, 240, 240)",
              opacity: 0,
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
            name: "Minimale Frequenzen",
            type: "line",
            stack: "x", // stack name
            smooth: true,
            stackStrategy: "positive", // strategy
            lineStyle: {
              opacity: 0.5, // hide line
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
          //   name: "Gesprächsfrequenzen",
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
          {
            name: "Typische Frequenzen männlicher Personen",
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
            // z: -1,
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
     * Converts the input time in seconds to MM:SS format with optional milliseconds.
     *
     * @param {number|string} input - The input time in seconds to be converted. If it is a string, it is parsed as a number.
     * @return {Array<string>} An array containing two strings: the first string is the formatted time in the format of MM:SS, and the second string is the formatted time in the format of milliseconds.
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
     * Parses the global pitch data from the given JSON input.
     *
     * @param {Array} jsonIn - The JSON input containing pitch data.
     * @return {void} This function does not return a value.
     */
    parsePitchGlobal(jsonIn) {
      let transcript = JSON.parse(
        JSON.stringify(this.getCurrentData.transcript.content)
      );
      for (let i = 0; i < jsonIn.length; i++) {
        this.$data.pitchData.push(jsonIn[i].mean);
        if (
          transcript[i] &&
          transcript[i].speakerId == this.getCurrentFeedback.meta.speakers[0].id
        ) {
          this.$data.option.series[0].data.push(jsonIn[i].mean);
          this.$data.option.series[1].data.push(null);
        } else if (
          transcript[i] &&
          transcript[i].speakerId == this.getCurrentFeedback.meta.speakers[1].id
        ) {
          this.$data.option.series[1].data.push(jsonIn[i].mean);
          this.$data.option.series[0].data.push(null);
        }
        this.pitchGlobal.mean.push(jsonIn[i].mean);
        this.pitchGlobal.maximum.push(jsonIn[i].max);
        this.pitchGlobal.minimum.push(jsonIn[i].min);
      }

      let max = JSON.parse(JSON.stringify(this.pitchGlobal.maximum));
      let min = JSON.parse(JSON.stringify(this.pitchGlobal.minimum));
      this.pitchGlobal.diff = max.map((v, i) => min[i] - v);

      // this.option.series[2].data = this.pitchGlobal.mean;
      this.option.series[2].data = this.pitchGlobal.maximum;
      this.option.series[3].data = this.pitchGlobal.diff;
      this.option.series[4].data = this.pitchGlobal.minimum;

      // this.$data.option.markLine.data = [jsonIn[0], jsonIn[1], jsonIn[2]];
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
    /**
     * Parses the JSON time based on the provided duration.
     *
     * @param {number} duration - The duration value to be parsed
     * @return {Array} The parsed timestamps
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
      this.getCurrentData.pitch.speakers[0].graphData;
    this.option.series[1].data =
      this.getCurrentData.pitch.speakers[1].graphData;
  },
  mounted() {
    if (
      (this.getCurrentData?.pitch &&
        this.getCurrentData.pitch.speakers &&
        this.getCurrentData.pitch.speakers[0].graphData) ||
      this.getCurrentData.pitch.speakers[1].graphData
    ) {
      store = this.$store;

      this.option.legend.data = [
        this.$store.getters.getFeedbackSpeakers[0].role,

        this.$store.getters.getFeedbackSpeakers[1].role,
        "Gesprächsfrequenzen",
      ];
      this.option.series[0].name =
        this.$store.getters.getFeedbackSpeakers[0].role;
      this.option.series[1].name =
        this.$store.getters.getFeedbackSpeakers[1].role;
      this.loading = false;
      return;
    }
    this.errorMessage = "Keine Daten vorhanden";
  },
  computed: {
    ...mapGetters({
      getCurrentFeedback: "getCurrentFeedback",
      getCurrentDataPoint: "getCurrentDataPoint",
      getCurrentData: "getCurrentData",
      getTranscript: "getTranscript",
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
