<!--Record component that displays the audio player-->
<template>
  <!-- <div
    class="flex justify-center border-slate-500 border-2 rounded-xl w-fit px-2"
  >
    <Icon
      class="group rounded-lg my-2 w-10 px-0"
      iconName="play"
      size="32"
      color="rgb(80 80 80)"
      @click="this.showViewChangeBar = !this.showViewChangeBar"
    ></Icon>
  </div> -->
  <div class="player w-full" ref="audioPlayer">
    <!--player controls-->
    <div class="player-controls w-full flex justify-evenly items-center px-1">
      <div id="stop">
        <button @click.prevent="stop()" title="Stop" class="player-control">
          <Icon
            iconName="stop"
            v-if="!playing"
            style="filter: invert(50%)"
          ></Icon>
          <Icon iconName="stop" v-else></Icon>
        </button>
      </div>
      <div id="play">
        <button
          @click="
            playing = !playing;
            playing ? play() : pause();
          "
          :title="playing ? 'Pause' : 'Play'"
          class="player-control"
        >
          <Icon iconName="play" v-if="!playing"></Icon>
          <Icon iconName="pause" v-else></Icon>
        </button>
      </div>
      <!--audio timeline-->
      <div id="seek" class="w-full">
        <div class="player-timeline">
          <div
            @click="seek"
            class="h-full absolute z-10 w-full top-0 left-0 bottom-0"
            title="Seek"
          ></div>
          <div
            class="w-0 h-full bg-secondary py-2"
            :style="{ width: percentComplete + '%' }"
          ></div>
        </div>
        <div class="player-time">
          <div class="player-time-current">
            {{ currentSecondsConverted }}
          </div>
          <div class="player-title">
            <p class="mx-5 2xl:text-base xl:text-sm">
              {{ fileName }}
            </p>
          </div>
          <div class="player-time-total text-slate-500">
            {{
              durationSecondsConverted ? durationSecondsConverted : "08:46 min"
            }}
            <!-- 08:46 min -->
          </div>
        </div>
      </div>

      <div id="mute" class="w-auto -mr-3">
        <button @click.prevent="mute" class="player-control" title="Mute">
          <Icon
            iconName="muted"
            style="filter: invert(50%)"
            v-if="!muted"
          ></Icon>
          <Icon iconName="muted" v-else></Icon>
        </button>
      </div>
      <div id="volume w-min">
        <button
          @click="toggleShowVolume"
          @mouseover="this.showVolume = true"
          @mouseleave="this.showVolume = false"
          :title="volumeTitle"
          class="player-control"
        >
          <Icon iconName="volumeMax"></Icon>

          <input
            v-if="showVolume"
            v-model.lazy.number="volume"
            type="range"
            min="0"
            max="100"
            class="player-volume"
          />
        </button>
      </div>
    </div>
    <audio
      :loop="looping"
      ref="audioRef"
      src=""
      @timeupdate="update"
      @loadeddata="load"
      style="display: none"
    ></audio>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Icon from "../interface-components/Icon.vue";
import { API_URL } from "../../config";
function convertTimeHHMMSS(val) {
  const minutes = Math.floor((val % 3600) / 60);
  const seconds = Math.floor(val % 60);

  const formattedTime = [minutes, seconds]
    .map((unit) => unit.toString().padStart(2, "0"))
    .join(":");

  return formattedTime;
}
export default {
  components: { Icon },
  props: {
    name: { type: String, default: "" },
    file: {
      type: String,
      default: null,
    },
    id: Number,
  },
  data() {
    return {
      fileName: "",
      feedbackId: null,
      currentSeconds: 0,
      durationSeconds: 0,
      loaded: false,
      looping: false,
      playing: false,
      previousVolume: 35,
      showVolume: false,
      volume: 100,
    };
  },
  computed: {
    ...mapGetters(["getCurrentAudioTime"]),
    currentSecondsConverted() {
      return convertTimeHHMMSS(this.currentSeconds);
    },
    durationSecondsConverted() {
      return convertTimeHHMMSS(this.durationSeconds);
    },
    muted() {
      return this.volume / 100 === 0;
    },
    percentComplete() {
      return parseInt((this.currentSeconds / this.durationSeconds) * 100);
    },
    progressStyle() {
      return { width: `${this.percentComplete}%` };
    },
    volumeTitle() {
      return `Volume (${this.volume}%)`;
    },
  },
  watch: {
    "$store.state.currentTime": function (newVal, oldVal) {
      console.log("currentTime changed", oldVal, newVal);
      this.$refs.audioRef.currentTime = newVal;
    },
    file(newVal, oldVal) {
      console.log("file link changed", oldVal, newVal);
      this.$refs.audioRef.load();
    },
    volume(newVal, oldVal) {
      console.log("volume changed", oldVal, newVal);
      this.$refs.audioRef.volume = newVal / 100;
    },
  },
  updated() {
    // console.log(this.$refs.audioRef.currentTime);
    this.$store.commit(
      "setCurrentAudioTime",
      Number(this.$refs.audioRef.currentTime).toFixed(4)
    );
  },
  methods: {
    toggleShowVolume() {
      this.showVolume = !this.showVolume;
    },
    play() {
      // console.log(this.$refs.audioRef)
      if (this.$refs.audioRef) {
        this.playing = true;
        this.$refs.audioRef.play();
      }
    },
    download() {
      if (this.$refs.audioRef) {
        this.$refs.audioRef.pause();
        window.open(this.file, "download");
      }
    },
    load() {
      if (this.$refs.audioRef) {
        this.loaded = true;
        this.durationSeconds = parseInt(this.$refs.audioRef.duration);
      } else {
        throw new Error("Failed to load sound file.");
      }
    },
    mute() {
      if (this.muted) {
        this.volume = this.previousVolume;
      } else {
        this.previousVolume = this.volume;
        this.volume = 0;
      }
    },
    seek(e) {
      if (this.loaded) {
        const bounds = e.target.getBoundingClientRect();
        const seekPos = (e.clientX - bounds.left) / bounds.width;
        this.$refs.audioRef.currentTime = parseInt(
          this.$refs.audioRef.duration * seekPos
        );
        this.$store.commit("setCurrentAudioTime", Number(seekPos).toFixed(4));
      }
    },
    stop() {
      this.playing = false;
      this.$refs.audioRef.currentTime = 0;
      this.$refs.audioRef.pause();
    },
    pause() {
      this.playing = false;
      this.$refs.audioRef.pause();
    },
    update() {
      this.currentSeconds = parseInt(this.$refs.audioRef.currentTime);
    },

    loadAndPlayAudio(id) {
      let token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      fetch(API_URL + "/audio/" + id, {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + token,
        }),
        mode: "cors", // Use cors mode to handle cross-origin requests
        cache: "default",
      })
        .then((response) => {
          if (response.ok) {
            return response.blob(); // Convert the response into Blob
          }
          throw new Error("Network response was not ok.");
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          this.$refs.audioRef.src = url;
          this.$refs.audioRef.load();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          //this.$emit("updateAudioData", false);
          // To DO: set flag to hide audio player

          this.fileName = "Aufnahme";
        });
    },
  },
  created() {
    this.looping = this.loop;
    this.feedbackId = this.$route.params.id;
    this.fileName = this.name;
  },
  mounted() {
    this.load();
    // this.looping = this.loop;
    this.loadAndPlayAudio(this.feedbackId);
  },
};
</script>

<style scoped>
.player-wrapper {
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  height: 90vh;
  justify-content: center;
}

.player {
  background-color: rgba(255, 255, 255, 1);
  border-radius: 0.3125rem;
  border: 2px solid rgb(160, 160, 160);
  line-height: 1.5625;
  position: relative;
  margin: 0.5rem 0;
}

.player-controls {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  /* grid-template-areas: "a b c d e f g"; */
  /*max-width: 40rem;*/
}

.player-control {
  background-color: white;
  border: none;
  color: rgb(0, 97, 122);
  cursor: pointer;
  display: flex;
  line-height: 0;
  margin: 0;
  @media screen and (min-width: 1300px) {
    padding: 0.7rem;
  }
  text-decoration: none;
}

.player-timeline {
  background-color: rgba(0, 97, 122, 0.3);
  height: 45%;
  flex-grow: 1;
  /* max-width: 24.8125rem; */
  /* width: 100%; */
  min-width: 10rem;
  position: relative;
  margin: 0.25rem;
}

.player-progress {
  height: 100%;
  width: 0%;
  background-color: #007bff; /* Blue color, change to your preferred color */
  transition: width 0.3s linear; /* Use linear timing for smoother animation */
}

.player-time {
  display: flex;
  justify-content: space-between;
}

.player-volume {
  display: inline-block;
  height: 1.1rem;
  margin: 0 0 0 0.625rem;
  width: 4.925rem;
  background-color: rgb(35 142 133);
}
</style>
