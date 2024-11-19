<template>
  <div
    class="flex justify-between items-center z-50 pointer-events-none -mt-16"
  >
    <div class="flex items-center w-fit my-1 rounded-lg z-50">
      <div
        class="flex items-center bg-sky-100 rounded-lg px-1 pointer-events-auto cursor-pointer"
      >
        <Icon
          class="group rounded-lg my-1 w-10 px-0"
          iconName="eye"
          size="32"
          color="rgb(80 80 80)"
          @click="this.showViewChangeBar = !this.showViewChangeBar"
        ></Icon>
        <div
          class="flex items-center w-fit my-1 2xl:text-lg xl:text-base"
          v-if="this.showViewChangeBar"
        >
          <span class="font-bold text-slate-500 mx-3">Ansichtsfilter:</span>
          <div class="flex border-4 rounded-lg border-primary/20">
            <SmallButton
              size=""
              class="item-a z-50 font-bold border-transparent w-40 py-1 rounded-md mx-1"
              preset="outlined"
              @click="showFeedback('all')"
              :highlight="viewStates.allActive"
              ><span
                class="mx-auto"
                :class="{
                  'font-extrabold': viewStates.allActive,
                }"
                >Alle</span
              ></SmallButton
            >
            <SmallButton
              size=""
              class="item-b z-50 font-bold border-transparent w-40 py-1 rounded-md mx-1"
              preset="outlined"
              @click="showFeedback('voice')"
              :highlight="viewStates.voiceFeedbackActive"
              ><span
                class="mx-auto"
                :class="{
                  'font-extrabold': viewStates.voiceFeedbackActive,
                }"
                >Stimmlich</span
              ></SmallButton
            >
            <SmallButton
              size=""
              class="item-d m-auto font-bold border-transparent mx-1 w-40 py-1 rounded-md"
              preset="outlined"
              @click="showFeedback('structure')"
              :highlight="viewStates.structureFeedbackActive"
            >
              <span
                class="mx-auto"
                :class="{
                  'font-extrabold': viewStates.structureFeedbackActive,
                }"
                >Strukturell</span
              ></SmallButton
            >
            <!-- <div class="flex items-center font-bold mx-3 rounded-md">
                  Semantisch
                </div> -->
            <SmallButton
              size=""
              class="item-e text-normal font-bold border-transparent mx-1 w-40 py-1 rounded-md"
              :class="{
                'm-0': viewStates.semanticFeedbackActive,
              }"
              preset="outlined"
              @click="showFeedback('semantic')"
              :highlight="viewStates.semanticFeedbackActive"
              ><span
                class="mx-auto"
                :class="{
                  'font-extrabold ': viewStates.semanticFeedbackActive,
                }"
                >Semantisch</span
              ></SmallButton
            >
          </div>
        </div>
        <Icon
          iconName="chevronLeft"
          class="bg-sky-100 hover:bg-sky-200 rounded-lg h-6 w-6"
          v-if="this.showViewChangeBar"
          size="24"
          @click="this.showViewChangeBar = false"
        ></Icon>
        <Icon
          iconName="chevronRight"
          class="bg-sky-100 hover:bg-sky-200 rounded-lg w-6 h-6"
          v-if="!this.showViewChangeBar"
          size="24"
          @click="this.showViewChangeBar = true"
        ></Icon>
      </div>

      <!-- Info Area -->
      <InfoArea
        alignIcon="left"
        class="my-1 w-auto pointer-events-auto cursor-pointer"
        size="2"
        >Diagramme können mit der Maus verschoben und vergrößert werden. Um die
        Datenpunkte mit den Abschnitten im Transkript abzugelichen, bewegen Sei
        die Maus über die entsprechenden Datenpunkte.
      </InfoArea>
    </div>
  </div>
</template>

<script>
import Icon from "./Icon.vue";
import InfoArea from "./InfoArea.vue";
import SmallButton from "./SmallButton.vue";

export default {
  components: {
    Icon,
    InfoArea,
    SmallButton,
  },
  props: {
    viewStates: Object,
    showFeedback: Function,
  },
  data() {
    return {
      showViewChangeBar: false,
    };
  },
};
</script>
