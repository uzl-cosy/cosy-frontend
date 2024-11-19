<!--(UNUSED) Configuration Component: AudioPreview.vue shows a preview of an audio recording -->
  <template>
  <span class="w-full">
    <div
      class="w-4/5 mx-auto flex-col border-2 rounded-xl justify-around items-center px-6 py-1 pb-6"
    >
      <!-- Header and Delete Button -->
      <div class="w-full flex flex-row justify-between py-3">
        <span class="text-xl p-3">Aufnahme am {{ callDate() }} </span>
        <button
          class="w-auto px-4 border-dotted rounded-4 font-bold border-2 border-red-400 mt-1"
          @click="emitDeletion"
        >
          <span class="mr-2 mt-6">X</span> Löschen
        </button>
      </div>
      <span class="flex flex-row items-center mb-1">
        <!-- Play Button -->
        <button
          class="w-auto px-6 pr-2 py-4 mr-6 border rounded-full border-ocean-dark font-bold flex items-center"
        >
          <span>
            <svg height="44" width="44">
              <polygon
                points="0 0 0,42 40,21"
                style="
                  fill: rgba(35, 142, 133, 0.61);
                  stroke: black;
                  border: 2px;
                  stroke-width: 1;
                "
              ></polygon>
            </svg>
          </span>
        </button>
        <AudioSignal class="px-20 py-4 z-0 absolute"></AudioSignal>
        <span class="w-full flex justify-right"
          ><span class="w-5/6"> </span
          ><svg
            class="px-9 item bg-gradient-to-r from-transparent to-white z-10 relative float-right"
          ></svg>
        </span>
      </span>
    </div>
  </span>
</template>
<script>
import Icon from "../../components/interface-components/Icon.vue";
import AudioSignal from "../../components/configuration-components/AudioSignal.vue";

export default {
  name: "AudioPreview",
  components: {
    Icon,
    AudioSignal,
  },
  props: {
    color: String,
    icon: String,
    deleted: Boolean,
  },
  methods: {
    /**
     * Retrieves the current date and formats it as a string in the format "DD/MM/YYYY".
     *
     * @return {String} The formatted current date.
     */
    getFormattedCurrentDate() {
      const date = new Date();
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return formattedDate;
    },
/**
 * Emits a "clicked" event with the argument "delete".
 *
 * @return {void}
 */
    emitDeletion() {
      this.$emit("clicked", "delete");
    },
  },
};
</script>
