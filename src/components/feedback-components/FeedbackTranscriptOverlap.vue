<!--Feedback Component: FeedbackTranscriptOverlap.vue contains the transcript overlap element-->
<template>
  <div class="flex w-full items-start">
    <div
      class="flex justify-between items-center my-2 ml-20 py-2 mr-12 w-full text-slate-500 bg-indigo-200 rounded-lg px-3 xl:text-base">
      <div class="m-auto self-center" :class="{
                      'my-8':differenceStartThisItemAndEndPrevItem >= 5,
                      'my-6':differenceStartThisItemAndEndPrevItem < 5 &&
                        differenceStartThisItemAndEndPrevItem >= 3,
                      'my-4':differenceStartThisItemAndEndPrevItem < 3 &&
                        differenceStartThisItemAndEndPrevItem >= 1,
                    }">
        Gleichzeitiges Sprechen: {{ Math.round((timeEndPrevItem - timeStart) * 100) / 100 }}
        <span v-if="Math.round((timeEndPrevItem - timeStart) * 100) / 100 !== 1">
          Sekunden
        </span>
        <span v-else> Sekunde</span>
      </div>
      <span class="flex text-xs self-start mb-3 text-sky-600">{{ lastTimeIInMMS[0] }}
    <span v-if="timePrecise" class="text-xs font-light self-center">
     {{ lastTimeIInMMS[1] }}
    </span>
  </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    timeStart: Number,
    timeEndPrevItem: Number,
    lastTimeIMinusOne: Number,
    lastTimeIInMMS: Number,
    timePrecice: Boolean,
  },
  data () {
    return {}
  },
  computed: {
    /**
     * Calculates the difference between the end time of the previous item and the start time of the current item.
     *
     * @return {number} The difference in seconds.
     */
    differenceStartThisItemAndEndPrevItem () {
      return Math.floor(this.timeEndPrevItem - this.timeStart)
    },
  },
}
</script>

