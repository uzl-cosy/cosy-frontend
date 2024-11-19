<!--VIEW COMPONENT: AI-Generated Feedback/Analysis is displayed here-->
<template>
  <div id="feedback" class="w-full flex h-full">
    <!-- Overlay that show a detailed view of the selected speech parameter -->
    <Teleport to="body" v-if="overlay">
      <div
        class="flex flex-row w-full z-50"
        :class="{
          'justify-between':
            this.currentParam > 0 && this.currentParam < this.params.length - 1,
          'justify-end': this.currentParam == 0,
          'justify-start': this.currentParam == this.params.length - 1,
        }"
      >
        <!-- Navigation arrow button-->
        <div
          class="z-20 backdrop-blur-sm 2xl:ml-24 md:ml-12 rounded-full bg-primary/80 2xl:pr-3 md:pr-2 py-1"
          @click="this.currentParam--"
          v-if="this.currentParam > 0"
        >
          <Icon
            iconName="chevronLeft"
            color="white"
            :size="this.windowWidth > 1201 ? '96' : '64'"
          ></Icon>
        </div>

        <!--Speech Parameter Content-->
        <FeedbackOverlay
          class="z-10"
          :title="params[this.currentParam].title"
          :charts="params[this.currentParam].component !== null"
          icon="chart"
          @close-overlay="closeOverlay()"
          :isActive="overlay"
          :addInfo="this.params[this.currentParam].addInfo"
          ><template v-slot:chart>
            <component
              :is="params[this.currentParam].component"
              :ref="this.params[this.currentParam].ref"
            />
          </template>

          <template v-slot:info>
            {{ this.params[this.currentParam].info }}
          </template>
          <template v-slot:additional>
            <component
              :class="{ 'pr-12 py-2': this.currentParam == 4 }"
              :is="this.params[this.currentParam].additional"
              :ref="this.params[this.currentParam].refAdd"
            />
          </template>
        </FeedbackOverlay>

        <!-- Navigation arrow button-->
        <div
          class="z-20 backdrop-blur-sm 2xl:mr-24 md:mr-12 rounded-full bg-primary/80 2xl:pl-3 md:pl-2 py-1"
          @click="this.currentParam++"
          v-if="this.currentParam < 6"
        >
          <Icon
            iconName="chevronRight"
            color="white"
            :size="this.windowWidth > 1201 ? '96' : '64'"
          ></Icon>
        </div>
      </div>
    </Teleport>

    <!-- Main content -->
    <div
      class="flex flex-col w-full"
      :class="{ '-mt-5': this.windowHeight < 950 }"
    >
      <div class="flex items-center ml-1 -mt-4 pt-4">
        <TheBreadcrumb
          :breadcrumbs="breadcrumbs"
          @navigate="
            (e) =>
              !this.dataChanged
                ? e == 'Analysen'
                  ? this.$router.push('/feedbacklist')
                  : e == 'Startseite'
                  ? this.$router.push('/')
                  : ''
                : (this.goBackRequest = true)
          "
        ></TheBreadcrumb>
        <ModuleData
          class="w-fit justify-end z-40 ml-auto mr-0"
          @toggle-visible="moduleDataActive = !moduleDataActive"
        ></ModuleData>
        <div
          class="2xl:text-sm xl:text-xs 2xl:py-2 xl:py-1 mr-0 text-sky-500 cursor-pointer flex"
          @click="
            this.$router.push(
              '/session/' + this.getCurrentFeedback.meta.session_id
            )
          "
        >
          <Icon iconName="backArrow" class="mr-2"></Icon>Zurück zum Termin
        </div>
      </div>
      <div class="flex justify-between pt-1">
        <ThePageTitle class="xl:mb-4 mt-0 pt-0"
          >Analyse:
          <span class="font-semibold text-4xl">
            {{
              this.getNewCase
                ? this.getNewCase.case_name
                  ? this.getNewCase.case_name
                  : ""
                : ""
            }}</span
          >
        </ThePageTitle>
      </div>

      <!-- Data Loading Animation -->
      <div class="m-auto flex flex-col items-center pb-48" v-if="isLoading">
        <p class="my-3 text-xl">Auf Analysedaten warten...</p>
        <Icon size="64" class="animate-spin" iconName="arrowsCircle"></Icon>
      </div>

      <!-- two area component for Feedback Cards on the left and Transcript on the right hand side -->
      <splitpanes
        @resize="paneSize = $event[0].size"
        v-else
        class="grow w-full min-h-0"
        :class="{ 'hide-splitter': !this.viewStates.transcriptActive }"
        :dbl-click-splitter="false"
        :first-splitter="!this.viewStates.transcriptActive"
        @resized="updateDiagrams()"
      >
        <!-- Left Content: Feedback Cards -->
        <pane min-size="40%" :size="paneSize">
          <div
            ref="cardContainer"
            class="h-full flex justify-center overflow-y-auto overflow-x-hidden py-2 w-full"
            :class="{ 'mr-6': this.viewStates.transcriptActive }"
          >
            <div class="h-auto mr-2 w-full">
              <div
                class="flex flex-wrap h-auto justify-start scroll-smooth pr-4 w-full pb-14"
              >
                <!-- Feedback Card: Speech shares -->
                <FeedbackCard
                  v-if="viewStates.allActive"
                  ref="drag1"
                  @open-overlay="openOverlay(0)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  icon="chart"
                  :currentTab="0"
                  :tabCount="2"
                  title="Redeanteile"
                  slotName0="Summe"
                  slotName1="Verlauf"
                  :settings="false"
                >
                  <template v-slot:slot1>
                    <FeedbackSharesChart
                      ref="shares"
                      class="w-full h-full"
                      size="small"
                    >
                    </FeedbackSharesChart>
                  </template>
                  <template v-slot:slot2>
                    <FeedbackSharesGraph
                      ref="sharesGraph"
                      class="w-full h-full -ml-8"
                    ></FeedbackSharesGraph>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Speech shares (pie chart only) -->
                <FeedbackCard
                  v-if="viewStates.structureFeedbackActive"
                  ref="drag1"
                  @open-overlay="openOverlay(0)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  icon="chart"
                  :currentTab="0"
                  :tabCount="2"
                  title="Redeanteile insgesamt"
                  :settings="false"
                >
                  <template v-slot:slot1>
                    <FeedbackSharesChart
                      ref="shares"
                      class="w-full h-full"
                      size="small"
                    >
                    </FeedbackSharesChart>
                  </template>
                </FeedbackCard>

                <!--Feedback Card: Shares-->
                <FeedbackCard
                  v-if="viewStates.structureFeedbackActive"
                  ref="drag2"
                  @open-overlay="openOverlay(0)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  icon="chart"
                  :currentTab="0"
                  :tabCount="1"
                  title="Redeanteile über die Zeit"
                  :settings="false"
                >
                  <template v-slot:slot1>
                    <FeedbackSharesGraph
                      class="w-full h-full"
                    ></FeedbackSharesGraph>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Keywords -->
                <FeedbackCard
                  v-if="viewStates.allActive"
                  ref="drag3"
                  @open-overlay="openOverlay(1)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  title="Genannte Begriffe"
                  icon="document"
                  :currentTab="0"
                  :tabCount="2"
                  :settings="false"
                  slotName0="Wortwolke"
                  slotName1="Liste"
                >
                  <template v-slot:slot1>
                    <div class="flex flex-col w-full">
                      <FeedbackWordcloud
                        ref="words"
                        class="w-full"
                        :showFilterIncoming="showFilter"
                        @update:showFilter="updateShowFilter"
                        @update:wordData="updateWordData"
                        :wordGroupIncoming="wordGroup"
                        :wordsCountIncoming="wordsCount"
                      >
                      </FeedbackWordcloud>
                    </div>
                  </template>

                  <template v-slot:slot2>
                    <FeedbackKeywords
                      ref="words"
                      class="w-full"
                      :showFilterIncoming="showFilter"
                      @update:showFilter="updateShowFilter"
                      @update:wordData="updateWordData"
                      :wordGroupIncoming="wordGroup"
                      :wordsCountIncoming="wordsCount"
                      :isCard="true"
                    >
                    </FeedbackKeywords>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Keywords (list only)-->
                <FeedbackCard
                  v-if="viewStates.semanticFeedbackActive"
                  ref="drag4"
                  @open-overlay="openOverlay(1)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  title="Genannte Begriffe (Liste)"
                  icon="document"
                  :currentTab="0"
                  :tabCount="1"
                  :settings="false"
                >
                  <template v-slot:slot1>
                    <FeedbackKeywords
                      ref="list"
                      class="w-full mt-10 pr-5"
                      :isCard="true"
                    >
                    </FeedbackKeywords>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Keywords (wordcloud only)-->
                <FeedbackCard
                  v-if="viewStates.semanticFeedbackActive"
                  ref="drag5"
                  @open-overlay="openOverlay(1)"
                  @tabCountChanged="handleNewCurrentTab"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  title="Genannte Begriffe (Wolke)"
                  icon="document"
                  :currentTab="0"
                  :tabCount="1"
                  :settings="false"
                >
                  <template v-slot:slot1>
                    <div class="flex flex-col w-full pr-16 mt-10">
                      <FeedbackWordcloud ref="cloud" class="w-full">
                      </FeedbackWordcloud>
                    </div>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Voice Analysis (all in one)-->
                <FeedbackCard
                  v-if="
                    (viewStates.allActive || viewStates.voiceFeedbackActive) &&
                    sumVoiceAnalysis
                  "
                  ref="drag6"
                  @open-overlay="openOverlay(1)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  title="Stimmanalyse"
                  icon="wave"
                  :currentTab="0"
                  :tabCount="1"
                  :menuOptions="['Stimmparameter trennen']"
                  @option1="this.sumVoiceAnalysis = false"
                >
                  <template v-slot:slot1>
                    <div class="flex flex-col w-full">
                      <FeedbackTempoChart
                        ref="tempo"
                        class="w-full"
                        :showSpecs="false"
                        size="small"
                      >
                      </FeedbackTempoChart>
                      <FeedbackLoudnessChart
                        ref="loudness"
                        size="small"
                      ></FeedbackLoudnessChart>
                      <FeedbackPitchChart
                        class="w-full"
                        ref="pitch"
                        :colors="[
                          this.getFeedbackSpeakers[0].color,
                          this.getFeedbackSpeakers[1].color,
                          '#BEBBBB',
                        ]"
                      ></FeedbackPitchChart>
                    </div>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Voice Analysis (loudness)-->
                <FeedbackCard
                  v-if="
                    (viewStates.allActive || viewStates.voiceFeedbackActive) &&
                    !sumVoiceAnalysis
                  "
                  ref="drag7"
                  @open-overlay="openOverlay(3)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  title="Sprechlautstärke"
                  icon="loud"
                  :currentTab="0"
                  :tabCount="1"
                  :menuOptions="[
                    'Stimmenanalysen zusammenführen',
                    // 'zweite option',
                  ]"
                  @option1="this.sumVoiceAnalysis = true"
                >
                  <template v-slot:slot1>
                    <FeedbackLoudnessChart
                      class="w-full"
                      ref="loudness"
                      :colors="[
                        this.getFeedbackSpeakers[0].color,
                        this.getFeedbackSpeakers[1].color,
                        '#BEBBBB',
                      ]"
                    ></FeedbackLoudnessChart>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Voice Analysis (tempo)-->
                <FeedbackCard
                  v-if="
                    (viewStates.allActive || viewStates.voiceFeedbackActive) &&
                    !sumVoiceAnalysis
                  "
                  @open-overlay="openOverlay(3)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  title="Sprechtempo"
                  icon="speedometer"
                  :currentTab="0"
                  :tabCount="1"
                  :menuOptions="[
                    'Stimmenanalysen zusammenführen',
                    // 'zweite option',
                  ]"
                  @option1="this.sumVoiceAnalysis = true"
                >
                  <template v-slot:slot1>
                    <div class="flex flex-col w-full">
                      <FeedbackTempoChart
                        class="w-full"
                        ref="tempo"
                      ></FeedbackTempoChart>
                    </div>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Voice Analysis (pitch)-->
                <FeedbackCard
                  v-if="
                    (viewStates.allActive || viewStates.voiceFeedbackActive) &&
                    !sumVoiceAnalysis
                  "
                  ref="drag9"
                  @open-overlay="openOverlay(1)"
                  @tabCountChanged="handleNewCurrentTab"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  title="Stimmlage"
                  icon="microphone"
                  :tabCount="1"
                  :menuOptions="['Stimmparameter zusammenfügen']"
                  @option1="this.sumVoiceAnalysis = true"
                >
                  <template v-slot:slot1>
                    <FeedbackPitchChart ref="pitch"></FeedbackPitchChart>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Questions -->
                <FeedbackCard
                  v-if="
                    viewStates.allActive || viewStates.semanticFeedbackActive
                  "
                  ref="drag10"
                  @open-overlay="openOverlay(5)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  title="Fragen"
                  icon="question"
                  :settings="false"
                >
                  <template v-slot:slot1>
                    <FeedbackQuestions ref="questions"> </FeedbackQuestions>
                  </template>
                </FeedbackCard>

                <!-- Feedback Card: Scatterplot -->
                <FeedbackCard
                  v-if="
                    viewStates.allActive || viewStates.semanticFeedbackActive
                  "
                  :showEnlarge="false"
                  ref="drag11"
                  @open-overlay="openOverlay(5)"
                  :globalActive="viewStates.feedbackActive"
                  :categoryActive="viewStates.feedbackActive"
                  :isActive="viewStates.feedbackActive"
                  title="Häufigkeit der Begriffe"
                  icon="scatterPlot"
                  :settings="false"
                >
                  <template v-slot:slot1>
                    <div class="flex w-full h-full my-5">
                      <FeedbackKeywordsFrequency ref="">
                      </FeedbackKeywordsFrequency>
                    </div>
                  </template>
                </FeedbackCard>
              </div>
            </div>
          </div>
          <!-- View Navigation bar -->
          <ViewNavigationButtons
            :viewStates="this.viewStates"
            :showFeedback="this.showFeedback"
          ></ViewNavigationButtons>
        </pane>

        <!-- Right Content: Transcript -->
        <pane
          :size="100 - paneSize"
          :min-size="viewStates.transcriptActive ? '30%' : '5%'"
          :max-size="viewStates.transcriptActive ? '60%' : '5%'"
          @dragend="updateDiagrams"
          class="flex"
        >
          <button
            v-if="!isLoading"
            @click="
              toggleTranscript();
              this.transcriptColor =
                this.transcriptColor === 'rgb(0, 97, 122)'
                  ? 'white'
                  : 'rgb(0, 97, 122)';
            "
            class="pointer-events-auto cursor-pointer xl:px-1 md:px-1 rounded-2xl border-2 2xl:text-base xl:text-base md:text-sm font-bold flex mx-auto items-center hover:bg-[#E2E8F0] hover:text-primary"
            :class="{
              ' bg-ocean-dark text-white xl:py-2 md:py-2 w-16':
                !viewStates.transcriptActive,
              'bg-ocean-dark/25 text-ocean-dark border-ocean-dark/25 xl:py-1 md:py-1 w-8 ml-5 rounded-r-none ':
                viewStates.transcriptActive,
            }"
            @mouseover="this.transcriptColor = 'rgb(0, 97, 122)'"
            @mouseleave="
              viewStates.transcriptActive
                ? (this.transcriptColor = 'rgb(0, 97, 122)')
                : (this.transcriptColor = 'white')
            "
          >
            <span
              class="flex justify-start items-center -mx-1.5"
              :class="{ '-ml-6': this.viewStates.transcriptActive }"
            >
              <Icon
                v-if="!viewStates.transcriptActive"
                class="mx-auto"
                size="22"
                iconName="chevronLeft"
                :color="this.transcriptColor"
              /><span
                class="flex flex-col mr-auto -ml-1 items-center mb-0.5 -mt-12"
                :class="{ 'text-sm flex-row': viewStates.transcriptActive }"
              >
                <Icon
                  v-if="!viewStates.transcriptActive"
                  class=""
                  size="24"
                  iconName="document"
                  :color="this.transcriptColor"
                />

                <Icon
                  v-if="viewStates.transcriptActive"
                  class="mx-auto"
                  size="24"
                  iconName="chevronRight"
                  :color="this.transcriptColor"
                />
                <!-- <div class="writing-mode-vertical-rl px-1.5">
                T r a n s k r i p t
              </div> -->
                <div
                  class="-rotate-90 mt-14 tracking-wider"
                  :class="{
                    '-mx-12 text-2xl': !this.viewStates.transcriptActive,
                    ' text-lg -mx-5': this.viewStates.transcriptActive,
                  }"
                >
                  {{
                    this.viewStates.transcriptActive
                      ? "Ausblenden"
                      : "Transkript"
                  }}
                </div></span
              >
            </span>
          </button>
          <FeedbackTranscript
            v-if="viewStates.transcriptActive"
            @reload="updateDiagrams"
            ref="transcript"
            :active="viewStates.transcriptActive"
            @toggleTranscript="toggleTranscript()"
            :content="this.getTranscript"
            :transcripts="this.getTranscript.transcripts"
            class="w-full rounded-l-none border-l-0"
          ></FeedbackTranscript>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>
<style>
.hide-splitter .splitpanes__splitter {
  display: none; /* Hides the splitter */
}
.splitpanes__splitter {
  background-color: #ccc;
  position: relative;
}

.splitpanes__splitter:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.4s;
  background-color: rgb(56 189 248 / 0.25);
  opacity: 0;
  z-index: 1;
}

.splitpanes__splitter:hover:before {
  opacity: 1;
}

.splitpanes--vertical > .splitpanes__splitter:before {
  left: -15px;
  right: -20px;
  height: 100%;
}

.splitpanes--horizontal > .splitpanes__splitter:before {
  top: -30px;
  bottom: -30px;
  width: 100%;
}

.feedback-card {
  background: rgba(72, 139, 143, 0.4);
  background: radial-gradient(
    circle at left top,
    rgba(72, 139, 143, 0.75) 0%,
    rgba(23, 63, 85, 0.75) 100%
  );
  background-position: 100% 100%;
}

.overlay {
  margin-left: -28px;
}

.item-c {
  margin: -6px;
}

.item-c:hover {
  scale: 1.1;
}
</style>
<script>
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import BigButton from "../components/interface-components/BigButton.vue";
import TableCourses from "../components/tables/TableCourses.vue";
import Icon from "../components/interface-components/Icon.vue";
import TheBreadcrumb from "../components/interface-components/TheBreadcrumb.vue";
import FeedbackTranscript from "../components/feedback-components/FeedbackTranscript.vue";
import FeedbackCard from "../components/feedback-components/FeedbackCard.vue";
import SmallButton from "../components/interface-components/SmallButton.vue";
import FeedbackSharesChart from "../components/feedback-components/FeedbackSharesChart.vue";
import FeedbackPitchChart from "../components/feedback-components/FeedbackPitchChart.vue";
import FeedbackTempoChart from "../components/feedback-components/FeedbackTempoChart.vue";
import FeedbackOverlay from "../components/feedback-components/FeedbackOverlay.vue";
import FeedbackSharesGraph from "../components/feedback-components/FeedbackSharesGraph.vue";
import FeedbackLoudnessChart from "../components/feedback-components/FeedbackLoudnessChart.vue";
import FeedbackKeywords from "../components/feedback-components/FeedbackKeywords.vue";
import FeedbackKeywordsFrequency from "../components/feedback-components/FeedbackKeywordsFrequency.vue";
import RoleLegend from "../components/interface-components/RoleLegend.vue";
import { mapGetters } from "vuex";
import InfoArea from "../components/interface-components/InfoArea.vue";
import AudioPlayer from "../components/record-components/AudioPlayer.vue";
import { API_URL } from "../config";
import axios from "axios";
import DragContainer from "../components/interface-components/DragContainer.vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import FeedbackWordcloud from "../components/feedback-components/FeedbackWordcloud.vue";
import FeedbackQuestions from "../components/feedback-components/FeedbackQuestions.vue";
import ModuleData from "../components/interface-components/ModuleData.vue";
import ViewNavigationButtons from "../components/interface-components/ViewNavigationButtons.vue";

export default {
  components: {
    ThePageTitle,
    BigButton,
    TableCourses,
    Icon,
    TheBreadcrumb,
    FeedbackTranscript,
    FeedbackCard,
    SmallButton,
    FeedbackPitchChart,
    FeedbackTempoChart,
    FeedbackSharesChart,
    FeedbackOverlay,
    FeedbackLoudnessChart,
    FeedbackSharesGraph,
    FeedbackKeywords,
    RoleLegend,
    InfoArea,
    AudioPlayer,
    DragContainer,
    Splitpanes,
    Pane,
    FeedbackWordcloud,
    FeedbackQuestions,
    ModuleData,
    FeedbackKeywordsFrequency,
    ViewNavigationButtons,
  },
  data() {
    return {
      paneSize: 95,
      isLoading: true,
      feedback: null,
      dataAvailable: {
        all: false,
        transcript: false,
        loudness: false,
        tempo: false,
        pitch: false,
        shares: false,
        words: false,
      },
      tabForView: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      sumVoiceAnalysis: false,
      audioFile: null,
      params: [
        {
          title: "Redeanteile",
          component: FeedbackSharesChart,
          info: "Viele Faktoren wie Gesprächskontext, Kommunikationstypen, Gesprächsthemen etc. können die Verteilung und den Verlauf der Redeanteile beeinflussen, sodass es keinen Idealwert gibt. Üblich ist jedoch ein erhöhter Redeanteil der Patient*innen am Anfang von Arztgesprächen, bevor in der Phase der Diagnose und Therapieplanung die Ärztin oder der Arzt im Vordergrund des Gespräches ist.",
          additional: FeedbackSharesGraph,
          ref: "sharesChart",
          refAdd: "sharesGraph",
          addInfo:
            "Die Daten sind im Diagramm akkumuliert über die Zeit dargestellt. In jedem Datenpunkt sind also die Informationen der gesamten bisherigen Konversation enthalten. ",
        },
        {
          title: "Genannte Begriffe",

          component: FeedbackKeywords,
          info: "Die im Gespräch verwendeten Begriffe spiegeln oft zentrale Themen und Anliegen wider. Sie können Unterschiede in der Sichtweise oder im Wissensstand zwischen den Kommunikationspartnern aufzeigen. Diese Unterschiede können eine Rolle für das gegenseitige Verständnis spielen und beeinflussen, wie Informationen und Botschaften im Gespräch vermittelt und aufgenommen werden.",
          additional: FeedbackWordcloud,
          addInfo: "Hier kommen bald weitere Infos",
          ref: "words",
        },
        {
          title: "Sprechlautstärke",

          component: null,
          info: "Die 'normale' Sprechlautstärke liegt je nach Sprechsituation bei 62-66 Dezibel (dB). Kurzfristig kann der Mensch richtig laut – bis 120 bis 130 Dezibel – sein (wie eine Motorsäge). In Bezug auf die Stimme ist Lautstärke nicht gleichbedeutend mit Volumen (=Resonanzqualität).",
          additional: FeedbackLoudnessChart,
          addInfo: "Hier kommen bald weitere Infos",
          ref: "loudness",
        },
        {
          title: "Stimmmodulation",
          component: null,
          info: "Die Stimmlage hängt von der Anatomie der Sprechorgane und von der körperlich-mentalen Verfassung des Sprechers ab, sodass es keinen Normalwert gibt. Da Männer etwa ein Viertel längere Stimmlippen haben als Frauen, erzeugen sie einen Grundton von rund 125 Hertz. Die normale Frequenz der weiblichen Stimme liegt bei durchschnittlich 200 Hertz, bei Kindern beträgt sie rund 400 Hertz. Trainierte Sängerinnen und Sänger schaffen ein Vielfaches dieser Frequenz. Der gesamte Stimmumfang beider Geschlechter ist gleich. Er umfasst zwischen 1,3 bis 2,5 Oktaven, setzt bei Männern allerdings eine Oktave tiefer ein als bei Frauen",
          additional: FeedbackPitchChart,
          addInfo: "Hier kommen bald weitere Infos",
          ref: "pitch",
        },

        {
          title: "Sprechtempo",

          component: null,
          info: "Viele Faktoren wie Gesprächskontext, Kommunikationstypen, Gesprächsthemen etc. können die Verteilung und den Verlauf der Redeanteile beeinflussen, sodass es keinen Idealwert gibt. Üblich ist jedoch ein erhöhter Redeanteil der Patient*innen am Anfang von Arztgesprächen, bevor in der Phase der Diagnose und Therapieplanung die Ärztin oder der Arzt im Vordergrund des Gespräches ist.",
          additional: FeedbackTempoChart,
          addInfo: "Hier kommen bald weitere Infos",
          ref: "tempo",
        },

        {
          title: "Fragen",

          component: null,
          info: "Fragearten die gestellt wurden.",
          additional: FeedbackQuestions,
          addInfo: "Hier kommen bald weitere Infos",
          ref: "questions",
        },
        {
          title: "Häufigkeit der Begriffe",

          component: null,
          info: "Häufigkeit der in der Konversation genannten Begriffe in der deutschen Sprache.",
          additional: FeedbackKeywordsFrequency,
          addInfo: "Hier kommen bald weitere Infos",
          ref: "frequency",
        },
      ],
      currentParam: 0,
      overlay: false,

      viewStates: {
        allActive: true,
        feedbackActive: false,
        voiceFeedbackActive: false,
        structureFeedbackActive: false,
        semanticFeedbackActive: false,
        transcriptActive: false,
      },
      transcriptColor: "white",
      breadcrumbs: [
        {
          id: "1",
          name: "Startseite",
        },
        {
          id: "2",
          name: "Analysen",
        },
        {
          id: "3",
          name: "",
        },
      ],
      optionsSpeechShare: {},
      seriesSpeechShare: [44, 55, 41, 17, 15],
      room: {},
      sessions: [],
      currentSessionId: "",
      showFilter: false,
      wordGroup: 0,
      wordsCount: 0,
    };
  },
  methods: {
    getFeedbackId() {
      return this.$route.params.id;
    },

    handleNewCurrentTab(newVal) {
      this.tabForView = newVal;
    },

    /**
     * Initializes the component by saving the current feedback ID in the store,
     * requesting the current feedback, and fetching the session ID from local storage.
     * If a session ID is found, it is set in the store and the session is fetched.
     * Finally, the fetchData method is called.
     *
     * @return {Promise<void>} A promise that resolves when the initialization is complete.
     */
    async init() {
      // save current feedbackId in store
      const feedbackId = this.$route.params.id;
      this.$store.commit("setCurrentFeedbackId", feedbackId);

      //request current feedback
      this.fetchFeedback(feedbackId);

      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        this.$store.commit("setCurrentSessionId", sessionId);
        this.fetchSession(sessionId);
      }

      this.fetchData();
    },
    /**
     * Asynchronously fetches data from the server after a delay of 1800 milliseconds.
     *
     * @return {Promise<void>} A promise that resolves when the data has been fetched and the loading indicator has been turned off.
     */
    fetchData() {
      setTimeout(() => {
        this.fetchCurrentData(this.feedback.measuresId);
        this.fetchTranscript(this.feedback.transcript.transcriptId);
        this.isLoading = false;
      }, 1800);
      // console.log('feedbackMeta', feedbackMeta)
    },

    async updateDiagrams() {
      console.log("resize");
      setTimeout(() => {
        this.swapLoading = false;
      }, 1000);

      if (this.$refs.loudness) this.$refs.loudness.resize();
      if (this.$refs.pitch) this.$refs.pitch.resize();
      if (this.$refs.tempo) await this.$refs.tempo.resize();

      if (this.$refs.shares) this.$refs.shares.resize();
      if (this.$refs.sharesGraph) this.$refs.sharesGraph.resize();
    },

    /**
     * Fetches the current feedback from the server using the given id.
     * The token from local storage is used to authenticate the request.
     *
     * @param {string} id - the id of the feedback to fetch
     * @return {Promise<void>} A promise that resolves when the feedback has been fetched and stored in the vuex store.
     */
    fetchFeedback(id) {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }

      axios
        .get(API_URL + "/analysis/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.$store.commit("setCurrentFeedback", response.data._doc);
          this.feedback = response.data._doc;
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },

    fetchSession(id) {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }

      axios
        .get(API_URL + "/sessions/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.sessions = response.data;
          this.$store.commit("setCurrentSession", response.data);
          console.log("session", response.data);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },

    /**
     * Converts the input time in seconds to a formatted string in MM:SS format with optional milliseconds.
     *
     * @param {number} input - The input time in seconds to be converted.
     * @return {Array} An array containing the formatted time string in MM:SS format and the milliseconds if present.
     */
    toMMSS(input) {
      if (typeof input != "number") {
        var sec_num = parseInt(input, 10);
      } else sec_num = input;
      let tmp = sec_num + "";

      var milsec = "";
      for (let i = 1; i < tmp.length; i++) {
        if ("" + tmp[i - 1] == ".") {
          milsec += tmp[i];
          if (tmp[i + 1]) milsec += tmp[i + 1];
          break;
        }
      }

      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor(sec_num / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      seconds = parseInt(seconds);
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (milsec != "") milsec = ":" + milsec;

      return [minutes + ":" + seconds, " " + milsec];
    },
    lastTime(i) {
      if (i >= 1) {
        return this.transcript[i - 1].timeEnd;
      } else return 0;
    },
    closeOverlay() {
      console.log("close");
      this.overlay = false;
      // window.removeEventListener("click", this.closeOverlay);
    },
    openOverlay(elem) {
      this.currentParam = elem;
      this.overlay = true;
      // window.addEventListener("click", this.closeOverlay);
    },
    toggleTranscript() {
      this.viewStates.transcriptActive = !this.viewStates.transcriptActive;
      if (this.viewStates.transcriptActive) {
        this.paneSize = 60;
      } else this.paneSize = 95;
      // if (this.viewStates.transcriptActive) {
      // if (this.$refs.drag1) {
      setTimeout(() => {
        if (this.$refs.shares) this.$refs.shares.resize();
        if (this.$refs.sharesGraph) this.$refs.sharesGraph.resize();
        // this.$refs.drag1.setWidth(this.$refs.cardContainer.clientWidth);
        // }
        if (this.$refs.drag2) {
          // this.$refs.drag2.setWidth(this.$refs.cardContainer.clientWidth);
        }
        if (this.$refs.drag3) {
          // this.$refs.drag3.setWidth(this.$refs.cardContainer.clientWidth);
        }

        if (this.$refs.drag4) {
          // this.$refs.drag4.resize();
          // this.$refs.drag4.setWidth(this.$refs.cardContainer.clientWidth);
        }

        if (this.$refs.drag5) {
          if (this.$refs.loudness) this.$refs.loudness.resize();

          // this.$refs.drag5.resize();
          // this.$refs.drag5.setWidth(this.$refs.cardContainer.clientWidth);
        }
        if (this.$refs.drag6) {
          // this.$refs.drag6.resize();
          if (this.$refs.loudness) this.$refs.loudness.resize();
          if (this.$refs.pitch) this.$refs.pitch.resize();
          if (this.$refs.tempo) this.$refs.tempo.resize();
        }

        if (this.$refs.drag7) {
          // this.$refs.drag7.resize();
          if (this.$refs.loudness) this.$refs.loudness.resize();
        }

        if (this.$refs.drag8) {
          // this.$refs.drag8.resize();
          if (this.$refs.tempo) this.$refs.tempo.resize();
        }

        if (this.$refs.drag9) {
          // this.$refs.drag9.resize();
          if (this.$refs.pitch) this.$refs.pitch.resize();
        }
        if (this.$refs.drag10) {
          if (this.$refs.questions) this.$refs.questions.resize();
        }
        this.updateDiagrams();
      }, 200);
    },
    toggleFeedback() {
      this.viewStates.feedbackActive = !this.viewStates.feedbackActive;
    },
    submit() {
      this.$emit("feedback");
    },
    showFeedback(category) {
      if (category == "all") {
        this.viewStates.voiceFeedbackActive = false;
        this.viewStates.structureFeedbackActive = false;
        this.viewStates.semanticFeedbackActive = false;
        if (!this.viewStates.allActive) {
          this.viewStates.allActive = true;
        } else {
          this.viewStates.feedbackActive = !this.viewStates.feedbackActive;
        }
      } else if (category == "voice") {
        this.viewStates.allActive = false;
        if (!this.viewStates.voiceFeedbackActive) {
          this.viewStates.voiceFeedbackActive = true;
        } else {
          console.log("voice3");

          this.viewStates.feedbackActive = !this.viewStates.feedbackActive;
        }

        this.viewStates.voiceFeedbackActive = true;
        this.viewStates.structureFeedbackActive = false;
        this.viewStates.semanticFeedbackActive = false;
      } else if (category == "structure") {
        this.viewStates.allActive = false;

        if (this.viewStates.structureFeedbackActive) {
          this.viewStates.feedbackActive = !this.viewStates.feedbackActive;

          return;
        }
        this.viewStates.structureFeedbackActive = true;
        this.viewStates.voiceFeedbackActive = false;
        this.viewStates.semanticFeedbackActive = false;
      } else if (category == "semantic") {
        this.viewStates.allActive = false;

        if (this.viewStates.semanticFeedbackActive) {
          this.viewStates.feedbackActive = !this.viewStates.feedbackActive;
          return;
        }
        this.viewStates.feedbackActive = true;
        this.viewStates.semanticFeedbackActive = true;
        this.viewStates.voiceFeedbackActive = false;
        this.viewStates.structureFeedbackActive = false;
      }
    },
    // changeView(state) {
    //   this.bus.$emit('changeView', {
    //     feedbackActive: state
    //   });
    fetchCurrentData(id) {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      axios
        .get(API_URL + "/analysis/data/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response);
          this.$store.commit("setCurrentData", response.data._doc);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },

    fetchSessionData(sessionId, caseId) {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      axios
        .get(API_URL + "/sessions/" + sessionId, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          // this.sessions = response.data;
          console.log(response);
          this.$store.commit("setCurrentSession", response.data);
          this.$store.commit(
            "setCase",
            response.data.caseConfig.cases.find(
              (element) => element.case_id === caseId
            )
          );
          this.breadcrumbs[this.breadcrumbs.length - 1].name =
            response.data.baseConfig.subject_topic;
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },

    fetchAnalysisData() {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      axios
        .get(API_URL + "/analysis", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.$store.commit("setAnalysisObjects", response.data);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },
    fetchTranscript(id) {
      var token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      axios
        .get(API_URL + "/analysis/transcript/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.$store.commit("setTranscript", response.data._doc);
        })
        .catch((error) => {
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },
    //change showFilter state in component wordCloud and Keywords
    updateShowFilter(value) {
      this.showFilter = value;
    },
    updateWordData({ wordGroup, wordsCount }) {
      this.wordGroup = wordGroup;
      this.wordsCount = wordsCount;
    },
  },
  computed: {
    ...mapGetters({
      getFeedbackSpeakers: "getFeedbackSpeakers",
      getSpeakerRoles: "getSpeakerRoles",
      getRoomConfig: "getRoomConfig",
      getCurrentSession: "getCurrentSession",
      getSessions: "getSessions",
      getCurrentFeedback: "getCurrentFeedback",
      getConversationShares: "getConversationShares",
      getNewCase: "getNewCase",
      getSpeakers: "getSpeakers",
      getTranscript: "getTranscript",
      getCurrentRecord: "getCurrentRecord",
      getCurrentData: "getCurrentData",
      getCurrentSessionId: "getCurrentSessionId",
    }),
  },
  mounted() {
    this.init();

    // } else {
    //   let feedbackId = localStorage.getItem("feedbackId");
    //   if (feedbackId) {
    //     this.$store.commit("setCurrentFeedback", feedbackId);
    //   } else this.$router.push("/");
    // }
    this.swapLoading = false;
    this.feedback = this.getCurrentData;

    if (this.getTranscript) {
      this.dataAvailable.transcript = true;
    }
    // this.dataAvailable.all = true;
    if (this.getCurrentData) {
      if (
        this.getCurrentData.words &&
        this.getCurrentData.words.speakers[0] &&
        this.getCurrentData.words.speakers[0].data
      ) {
        this.dataAvailable.words = true;
      }
      if (
        this.getCurrentData.conversationShares &&
        this.getCurrentData.conversationShares.speakers[0] &&
        this.getCurrentData.conversationShares.speakers[0].data
      ) {
        this.dataAvailable.shares = true;
      }
      if (
        this.getCurrentData.pitch &&
        this.getCurrentData.pitch.speakers[0] &&
        this.getCurrentData.pitch.speakers[0].data
      ) {
        this.dataAvailable.pitch = true;
      }
      if (
        this.getCurrentData.loudness &&
        this.getCurrentData.loudness.speakers[0] &&
        this.getCurrentData.loudness.speakers[0].data
      ) {
        this.dataAvailable.loudness = true;
      }
      if (
        this.getCurrentData.tempo &&
        this.getCurrentData.tempo.speakers[0] &&
        this.getCurrentData.tempo.speakers[0].data
      ) {
        this.dataAvailable.tempo = true;
      }
    }

    // this.room = this.$store.getters.getCurrentRoom;
    // this.$store.commit("setCurrentSession", this.$store.state.sessions[0].id);
  },
  created() {
    let sessionId = null;
    if (this.getCurrentSessionId) {
      sessionId = this.getCurrentSessionId;
    } else if (this.getCurrentFeedback) {
      sessionId = this.getCurrentFeedback.id;
    }
    if (sessionId) {
      localStorage.setItem("sessionId", sessionId);
    }
    this.fetchAnalysisData();
    this.fetchSessionData(sessionId);

    if (!this.getCurrentSession) {
      // this.$store.commit("setCurrentSession", this.getSessions[0].id);
    }
  },
  watch: {
    sumVoiceAnalysis(val) {
      if (val) {
        this.viewStates.voiceFeedbackActive = true;
      }
    },
    // overlay(val) {
    //   if (val) {
    //     document
    //       .getElementById("background")
    //       .addEventListener("click", this.closeOverlay);
    //   }
    // },
  },
};
</script>
