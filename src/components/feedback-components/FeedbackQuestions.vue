<template>
    <div class="flex flex-col w-full justify-center">
        <!-- Legende -->
        <div class="w-full h-20 flex self-center justify-between bg-white mt-4">
            <div class="flex flex-col items-center w-1/2">
                <div>
                    <div class="flex text-ocean-dark text-lg mb-2 font-bold">
                        {{ speaker1 }}
                    </div>
                    <div class="flex flex-row">
                        <div
                            class="relative w-5 h-5 self-start mr-2 rounded-full bg-blue-600 min-w-[1.25rem] min-h-[1.25rem]">
                        </div>
                        <p>Geschlossen ({{ closedQuestions1 }})</p>
                    </div>
                    <div class="flex flex-row">
                        <div
                            class="relative w-5 h-5 rounded-full border-4 border-blue-600 mr-2 min-w-[1.25rem] min-h-[1.25rem]">
                            <div class="absolute top-0 right-1.5 w-4/6 h-full bg-blue-600 rounded-l-full"></div>
                        </div>
                        <p>Offen ({{ openQuestions1 }})</p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col items-center w-1/2">
                <div>
                    <div class="flex text-ocean-dark text-lg mb-2 font-bold">
                        {{ speaker2 }}
                    </div>
                    <div class="flex flex-row">
                        <div
                            class="relative w-5 h-5 self-start mr-2 rounded-full bg-pink-600 min-w-[1.25rem] min-h-[1.25rem]">
                        </div>
                        <p>Geschlossen ({{ closedQuestions2 }})</p>
                    </div>
                    <div class="flex flex-row">
                        <div
                            class="relative w-5 h-5 rounded-full border-4 border-pink-600 mr-2 min-w-[1.25rem] min-h-[1.25rem]">
                            <div class="absolute top-0 right-1.5 w-4/6 h-full bg-pink-600 rounded-l-full"></div>
                        </div>
                        <p>Offen ({{ openQuestions2 }})</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- questions -->
        <div class="flex mt-8 w-full mb-12">
            <div class="h-52 overflow-auto w-full">
                <ul class="flex flex-col justify-start px-3">
                    <li v-for="item in questionsData" :key="item.value" :class="
                item.speaker === 1
                ? 'flex w-full justify-start items-center my-1'
                : 'flex w-full justify-end items-center my-1'
                ">
                        <!-- Frage Text für Speaker 1 -->
                        <template v-if="item.speaker === 1">
                            <!-- Icon anzeigen basierend auf dem questionType -->
                            <div v-if="item.questionType === 2"
                                class="w-5 h-5 rounded-full bg-blue-600 mr-2 min-w-[1.25rem] min-h-[1.25rem]"></div>
                            <div v-else-if="item.questionType === 1"
                                class="relative w-5 h-5 rounded-full border-4 border-blue-600 mr-2 min-w-[1.25rem] min-h-[1.25rem]">
                                <div class="absolute top-0 right-1.5 w-4/6 h-full bg-blue-600 rounded-l-full"></div>
                            </div>

                            <div
                                class="bg-blue-500/20 text-blue-500 p-1 rounded-md font-bold border-2 border-blue-500 inline-block max-w-[80%] w-auto">
                                {{ item.question }}
                            </div>
                        </template>

                        <!-- Frage Text für Speaker 2 -->
                        <template v-else>
                            <div
                                class="bg-pink-600/20 text-pink-600 p-1 rounded-md font-bold border-2 border-pink-600 inline-block max-w-[80%] w-auto">
                                {{ item.question }}
                            </div>

                            <!-- Icon anzeigen basierend auf dem questionType -->
                            <div v-if="item.questionType === 2"
                                class="w-5 h-5 rounded-full bg-pink-600 ml-2 min-w-[1.25rem] min-h-[1.25rem]"></div>
                            <div v-else-if="item.questionType === 1"
                                class="relative w-5 h-5 rounded-full border-4 border-pink-600 ml-2 min-w-[1.25rem] min-h-[1.25rem]">
                                <div class="absolute top-0 left-1.5 w-4/6 h-full bg-pink-600 rounded-r-full"></div>
                            </div>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import FeedbackTranscriptFilterOptions from "./FeedbackTranscriptFilterOptions.vue";
    import Icon from "../interface-components/Icon.vue";

    export default {
        data() {
            return {
                speaker1: "",
                speaker2: "",
                questionCodesSpeaker1: [],
                questionCodesSpeaker2: [],
                transcriptValuesSpeaker1: [],
                transcriptValuesSpeaker2: [],
                openQuestions1: 0,
                openQuestions2: 0,
                closedQuestions1: 0,
                closedQuestions2: 0,
                showFilter: this.showFilterIncoming,
                questionsData: [], //final
            };
        },
        methods: {
            // Methode 1: Speichert die Fragetypen und die Sprecher-Nummern
            filterQuestionCodes(arr1, arr2) {
                // Leere Arrays für beide Sprecher initialisieren


                // Für Sprecher 1
                arr1.forEach((dataObj) => {
                    dataObj.questions.forEach((questionType) => {
                        if (questionType === 1 || questionType === 2) {
                            this.questionCodesSpeaker1.push({
                                question: "",
                                questionType: questionType, // Fragentyp 1 oder 2
                                speaker: 1, // Sprecher 1
                                startTime: null,
                            });
                        }
                    });
                });

                // Für Sprecher 2
                arr2.forEach((dataObj) => {
                    dataObj.questions.forEach((questionType) => {
                        if (questionType === 1 || questionType === 2) {
                            this.questionCodesSpeaker2.push({
                                question: "",
                                questionType: questionType, // Fragentyp 1 oder 2
                                speaker: 2, // Sprecher 2
                                startTime: null,
                            });
                        }


                    });
                });

                // Ausgabe der beiden Arrays für Debugging-Zwecke
                console.log("Question Codes for Speaker 1: ", this.questionCodesSpeaker1);
                console.log("Question Codes for Speaker 2: ", this.questionCodesSpeaker2);
            },


            // Methode 2: Speichert die Werte (value) und Startzeiten (timeStart) aus dem currentTranscript
            storeTranscriptValues() {


                this.getTranscript.transcripts.forEach((transcript, index) => {
                    transcript.content.forEach((entry) => {
                        if (entry.value.trim() !== "" && entry.value.endsWith("?")) {
                            // Werte basierend auf dem Sprecher in das jeweilige Array speichern
                            if (index + 1 === 1) {
                                // Für Sprecher 1
                                this.transcriptValuesSpeaker1.push({
                                    value: entry.value.trim(),
                                    startTime: entry.timeStart,
                                });
                            } else if (index + 1 === 2) {
                                // Für Sprecher 2
                                this.transcriptValuesSpeaker2.push({
                                    value: entry.value.trim(),
                                    startTime: entry.timeStart,
                                });
                            }
                        }
                    });
                });

                // Ausgabe der beiden Arrays für Debugging-Zwecke
                console.log("Transcript Values for Speaker 1: ", this.transcriptValuesSpeaker1);
                console.log("Transcript Values for Speaker 2: ", this.transcriptValuesSpeaker2);
            },


            // Methode 3: Fügt die gespeicherten values und startTime in das questionsData Array ein
            mergeValuesIntoQuestionsData() {
                // Leere Arrays für die zusammengeführten Daten der beiden Sprecher
                let mergedDataSpeaker1 = [];
                let mergedDataSpeaker2 = [];

                // Für Sprecher 1: Frage-Codes und Transcript-Werte zusammenführen
                let transcriptIndex1 = 0;
                this.questionCodesSpeaker1.forEach((questionObj) => {
                    if (transcriptIndex1 < this.transcriptValuesSpeaker1.length) {
                        const transcriptValue = this.transcriptValuesSpeaker1[transcriptIndex1];

                        questionObj.question = transcriptValue.value;
                        questionObj.startTime = transcriptValue.startTime;

                        mergedDataSpeaker1.push(questionObj);
                        transcriptIndex1++;
                    }
                });

                // Für Sprecher 2: Frage-Codes und Transcript-Werte zusammenführen
                let transcriptIndex2 = 0;
                this.questionCodesSpeaker2.forEach((questionObj) => {
                    if (transcriptIndex2 < this.transcriptValuesSpeaker2.length) {
                        const transcriptValue = this.transcriptValuesSpeaker2[transcriptIndex2];

                        questionObj.question = transcriptValue.value;
                        questionObj.startTime = transcriptValue.startTime;

                        mergedDataSpeaker2.push(questionObj);
                        transcriptIndex2++;
                    }
                });

                // Beide Arrays zusammenführen
                this.questionsData = [...mergedDataSpeaker1, ...mergedDataSpeaker2];

                // Leere oder ungültige Einträge entfernen
                this.questionsData = this.questionsData.filter(
                    (questionObj) => questionObj.question && questionObj.questionType !== 0
                );

                // Nach `startTime` sortieren
                this.questionsData.sort((a, b) => a.startTime - b.startTime);

                console.log("Merged and Sorted Questions Data: ", this.questionsData);
            },

            calculateCount() {
                this.openQuestions1 = 0;
                this.closedQuestions1 = 0;
                this.openQuestions2 = 0;
                this.closedQuestions2 = 0;

                // Iteriere über das questionsData Array
                this.questionsData.forEach((questionObj) => {
                    if (questionObj.speaker === 1) {
                        if (questionObj.questionType === 1) {
                            this.openQuestions1++;
                        } else if (questionObj.questionType === 2) {
                            this.closedQuestions1++;
                        }
                    } else if (questionObj.speaker === 2) {
                        if (questionObj.questionType === 1) {
                            this.openQuestions2++;
                        } else if (questionObj.questionType === 2) {
                            this.closedQuestions2++;
                        }
                    }
                });

                console.log(
                    `Speaker 1 - Open: ${this.openQuestions1}, Closed: ${this.closedQuestions1}`
                );
                console.log(
                    `Speaker 2 - Open: ${this.openQuestions2}, Closed: ${this.closedQuestions2}`
                );
            },
        },
        mounted() {
            this.speaker1 = this.getCurrentFeedback.meta.speakers[0].role;
            this.speaker2 = this.getCurrentFeedback.meta.speakers[1].role;

            // Die Methoden aufrufen, um die Arrays zu füllen
            this.filterQuestionCodes(
                this.getQuestionCodes.speakers[0].data,
                this.getQuestionCodes.speakers[1].data
            );
            this.storeTranscriptValues();
            this.mergeValuesIntoQuestionsData();
            this.calculateCount();
        },
        computed: {
            ...mapGetters({
                getTranscript: "getTranscript",
                getCurrentFeedback: "getCurrentFeedback",
                getQuestionCodes: "getQuestionCodes",
            }),
        },
    };
</script>