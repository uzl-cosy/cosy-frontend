<!--Component that contains the step-by-step process of the preparation and execution process of the recording -->
<template>
  <!--Overlay: Asks for confirmation before redirecting to the analysis page-->
  <Teleport to="body" v-if="redirectRequest">
    <div
      class="bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center absolute inset-0 z-20"
      id="overlay"
      @click.self="redirectRequest = false"
    >
      <div
        @click.self="close"
        class="flex justify-start absolute w-fit rounded-xl py-6 px-3 bg-ocean-dark/50 shadow-lg inset-1/2-screen"
      >
        <div class="flex flex-col mx-auto items-center">
          <div class="flex justify-between w-full mx-10">
            <span
              class="font-bold text-xl w-full flex justify-center mx-auto mt-1 mb-6 text-white"
            >
              Neuste Analyse anzeigen
            </span>
            <div
              class="flex ml-auto w-fit h-fit justify-end right hover:bg-blue-200 rounded-lg"
              @click="this.redirectRequest = false"
            >
              <Icon iconName="close" size="32"></Icon>
            </div>
          </div>
          <div
            class="w-fit h-full flex flex-col items-start my-auto mx-auto justify-start px-12 py-8 rounded-xl"
            :class="{
              'bg-sky-100': !highlightForm,
              'bg-blue-200': highlightForm,
            }"
          >
            <div class="my-5">
              Sie können nun die Analyseergebnisse anschauen
            </div>

            <div class="flex">
              <SmallButton
                class="mx-2 mt-5 py-3"
                size=""
                @click="
                  this.$store.commit(
                    'setCurrentFeedback',
                    this.getCurrentRecord.feedbackId
                  );
                  this.$router.push(
                    '/feedback/' + this.getCurrentRecord.feedbackId
                  );
                "
              >
                <Icon
                  class="mx-2"
                  color="white"
                  size="32"
                  iconName="presentation"
                ></Icon
                >Analyse ansehen
              </SmallButton>
              <SmallButton
                class="mx-2 mt-5 py-3"
                preset="outlined"
                size=""
                @click="this.deleteRecord()"
              >
                <Icon class="mx-2" size="32" iconName="delete"></Icon>Analyse
                löschen
              </SmallButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  <!-- data:{{ this.$data.deleteConfirm }} coomp: {{ this.deleteConfirm }} -->

  <div class="px-1 w-full flex flex-col items-start text-slate-500 h-full">
    <div class="flex flex-col w-full justify-center items-start">
      <!-- Stepper that walks the user through the preparation and execution process of the recording-->
      <Stepper :steps="steps" @setCurrentStep="(v) => goTo(v)" class="h-full">
        <div class="flex flex-col items-center w-auto">
          <span v-if="currentStep == 0">
            <!--Step 0: Select Case-->
            <div class="flex w-full">
              <span
                v-if="this.getCaseConfig.case_selected"
                class="flex flex-col mx-5 text-slate-600 w-full mb-5"
                ><span
                  class="font-bold 2xl:text-xl xl:text-base text-slate-600 mb-5"
                  >Gewählt</span
                >
                <span class="flex w-full">
                  <Combobox
                    :selectedValue="
                      this.getCurrentRecord.case.case_id &&
                      this.getCaseConfig.cases.find(
                        (obj) =>
                          obj.case_id === this.getCurrentRecord.case.case_id
                      ).case_name
                        ? this.getCaseConfig.cases.find(
                            (obj) =>
                              obj.case_id === this.getCurrentRecord.case.case_id
                          ).case_name
                        : ''
                    "
                    :data="this.cases"
                    @update-data="
                      (data) => {
                        this.$store.commit('setCurrentRecord', {
                          case: { case_id: this.getCurrentRecord.case.case_id },

                          words: {
                            wordsToSay: this.getCaseConfig.cases.find(
                              (obj) => obj.case_id === data.id
                            ).case_wordsToSay,
                            wordsNotToSay: this.getCaseConfig.cases.find(
                              (obj) => obj.case_id === data.id
                            ).case_wordsNotToSay,
                          },
                        });
                        this.$store.commit('selectCase', data.id);
                      }
                    "
                  ></Combobox>
                  <!-- Case information -->
                  <span
                    class="mx-5 flex flex-col"
                    v-if="this.getCaseConfig.case_selected.case_name"
                  >
                    <span
                      class="flex"
                      v-if="this.getCaseConfig.case_selected.case_description"
                    >
                      <span class="font-bold mr-2">Beschreibung:</span>
                      <p class="2xl:w-96 md:w-48">
                        {{ this.getCaseConfig.case_selected.case_description }}
                      </p> </span
                    ><span
                      v-if="this.getCaseConfig.case_selected.case_notes"
                      class="flex"
                    >
                      <span class="font-bold mr-2">Notizen:</span>
                      <p class="w-96">
                        {{ this.getCaseConfig.case_selected.case_notes }}
                      </p>
                    </span>
                    <span
                      v-if="this.getCaseConfig.case_selected.case_requisites"
                      class="flex"
                    >
                      <span class="font-bold mr-2">Requisiten:</span>
                      <p class="w-96">
                        {{ this.getCaseConfig.case_selected.case_requisites }}
                      </p>
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </span>
          <span v-if="currentStep == 1">
            <!--Step 1: Speaker Registration-->
            <div
              v-if="true"
              class="flex flex-col items-center text-slate-600 px-12"
            >
              <!--Moodle Instruction (unused)-->
              <!-- <div
                v-if="false"
                class="w-full bg-primary rounded-lg m-2 p-5 flex flex-col text-white"
              >
                <span> Bitte in Moodle eingeben:</span
                ><span class="text-white text-xl">12342</span>
              </div>
              <div
                v-if="false"
                class="w-full bg-primary rounded-lg m-2 p-5 text-white flex flex-col"
              >
                <span> Bitte in Moodle eingeben:</span
                ><span class="text-white text-xl">12342</span>
              </div> -->
              Bitte Sprecher:innencodes eingeben:
              <div class="flex justify-between w-full">
                <!-- switch between manuell and code registration for speaker 1 -->
                <span class="w-max flex self-start">
                  <div
                    class="bg-[#3BA8D4]/50 2xl:text-xl xl:text-normal rounded-full w-fit p-1 px-2 leading-5"
                  >
                    1.
                  </div>
                </span>
                <div
                  class="flex flex-col w-1/2 items-center pb-4 px-2"
                  v-if="manualRegistration1 == false"
                >
                  <div
                    v-if="
                      this.getCurrentSession &&
                      this.getCurrentSession.speakerConfig &&
                      this.getCurrentSession.speakerConfig.speaker1 &&
                      this.getCurrentSession.speakerConfig.speaker1
                        .speaker1_code
                    "
                    class="flex flex-col items-center my-3 p-1 mx-4 border-2 rounded-lg"
                  >
                    <div class="flex text-center">
                      {{ this.codes[0].speakerId }} ist eingecheckt
                    </div>
                    <div class="p-5">
                      <icon
                        iconName="check"
                        :size="48"
                        class="animate-[bounce_2s_infinite]"
                      ></icon>
                    </div>
                  </div>

                  <div v-else>
                    <!--Speaker code for Speaker 1-->
                    <CodeGenerator
                      class=""
                      value="/"
                      :label="
                        this.getCurrentRecord.case.case_id
                          ? this.getCaseConfig.cases.find(
                              (obj) =>
                                obj.case_id ===
                                this.getCurrentRecord.case.case_id
                            ).case_role1
                            ? this.getCaseConfig.cases.find(
                                (obj) =>
                                  obj.case_id ===
                                  this.getCurrentRecord.case.case_id
                              ).case_role1
                            : this.getCurrentRecord.speaker1.role
                          : this.getCurrentRecord.speaker1.role
                      "
                      :code="codes ? codes[0].code : ''"
                    >
                    </CodeGenerator>
                    <SmallButton
                      preset="outlined"
                      size=""
                      @click="manualRegistration1 = true"
                      class="xl:text-sm md:text-xs justify-center whitespace-nowrap"
                    >
                      Mit Sprechercode registrieren</SmallButton
                    >
                  </div>
                </div>
                <div v-else class="flex flex-col items-center px-1">
                  <!--Speaker form for Speaker 1-->
                  <SpeakerForm
                    :speakerID="1"
                    :speakerName="this.getCurrentRecord.speaker1.name"
                    mikroColor="blue"
                    :mikroNumber="
                      this.getAudioConfig
                        ? this.getAudioConfig.micro1_name[3]
                        : ''
                    "
                    :selectedRole="this.getCurrentRecord.speaker1.role"
                    :roles="this.getRoles"
                    :student="true"
                  >
                  </SpeakerForm>
                  <!-- <div>
                    <SmallButton
                      preset="outlined"
                      size=""
                      @click="manualRegistration1 = false"
                      class="px-2 xl:text-sm md:text-xs justify-center whitespace-nowrap"
                    >
                      Mit QR Code registrieren</SmallButton
                    >
                  </div> -->
                </div>

                <!-- switch between manuell and code registration for Speaker 2 -->
                <span class="w-max flex self-start">
                  <div
                    class="bg-pink-300 2xl:text-xl xl:text-normal rounded-full w-fit p-1 px-1.5 leading-5"
                  >
                    2.
                  </div>
                </span>
                <div
                  class="flex flex-col w-1/2 items-center pb-4 px-2"
                  v-if="manualRegistration2 == false"
                >
                  <div
                    v-if="
                      this.getCurrentSession &&
                      this.getCurrentSession.speakerConfig &&
                      this.getCurrentSession.speakerConfig.speaker2 &&
                      this.getCurrentSession.speakerConfig.speaker2
                        .speaker2_code
                    "
                    class="flex flex-col items-center my-3 p-1 mx-4 border-2 rounded-lg"
                  >
                    <div class="flex text-center">
                      {{ this.codes[1].speakerId }} ist eingecheckt
                    </div>
                    <div class="p-5">
                      <icon
                        iconName="check"
                        :size="48"
                        class="animate-[bounce_2s_infinite]"
                      ></icon>
                    </div>
                  </div>

                  <div v-else>
                    <!--Speaker code  for Speaker 2-->
                    <CodeGenerator
                      class=""
                      :label="
                        this.getCurrentRecord.case.case_id
                          ? this.getCaseConfig.cases.find(
                              (obj) =>
                                obj.case_id ===
                                this.getCurrentRecord.case.case_id
                            ).case_role2
                            ? this.getCaseConfig.cases.find(
                                (obj) =>
                                  obj.case_id ===
                                  this.getCurrentRecord.case.case_id
                              ).case_role2
                            : this.getCurrentRecord.speaker2.role
                          : this.getCurrentRecord.speaker2.role
                      "
                      :code="codes ? (codes[1] ? codes[1].code : '') : ''"
                    >
                    </CodeGenerator>
                    <SmallButton
                      preset="outlined"
                      size=""
                      @click="manualRegistration2 = true"
                      class="xl:text-sm md:text-xs justify-center px-2 whitespace-nowrap"
                    >
                      Mit Sprechercode registrieren</SmallButton
                    >
                  </div>
                </div>
                <div v-else class="flex flex-col items-center px-1">
                  <!--Speaker Form for Speaker 2-->
                  <SpeakerForm
                    :speakerID="2"
                    :speakerName="this.getCurrentRecord.speaker2.name"
                    mikroColor="blue"
                    :mikroNumber="
                      this.getAudioConfig
                        ? this.getAudioConfig.micro2_name[3]
                        : ''
                    "
                    :selectedRole="this.getCurrentRecord.speaker2.role"
                    :roles="this.getRoles"
                    :student="false"
                    :codesManuell1="false"
                    :codesManuell2="false"
                  >
                  </SpeakerForm>
                </div>
              </div>
              <span class="text-sm pl-4 pb-2 text-slate-400">
                *Ausgeblendet, weil es Teil der Logindaten der jeweiligen Person
                für das Studiportal ist.
              </span>
            </div>
            <!-- Feedback and Data Usage Configuration (unsued)-->
            <!-- <div class="flex items-start justify-start pl-20 mt-4">
              <div class="flex flex-col items-center justify-start -mr-72 z-10">
                <ButtonPanelHorizontal
                  :underline="true"
                  size="small"
                  class="self-start pr-3 pb-4 rounded-xl mb-5 -mt-2"
                  :options="[
                    { name: 'Parameter', detail: '' },
                    { name: 'Datenschutz', detail: '' },
                  ]"
                  base=""
                  @update="
                    (e) => {
                      if (e.name == '0') {
                        this.showFeedback = true;
                        this.showData = false;
                      } else {
                        this.showData = true;
                        this.showFeedback = false;
                      }
                    }
                  "
                  :checked="this.showFeedback ? '0' : '1'"
                ></ButtonPanelHorizontal>
              </div>

              <FeedbackConfig
                class="ml-12"
                v-if="showFeedback"
              ></FeedbackConfig>
              <DataUsageConfig class="" v-if="showData"></DataUsageConfig>
            </div> --> </span
          ><span v-if="currentStep == 2">
            <!-- Step 2: Microphone Status-->
            <div v-if="!openTutorial" class="flex flex-col items-center">
              <div class="-mt-14 w-fit z-0 self-end">
                <SmallButton
                  preset="outlined"
                  t
                  size=""
                  class="mx-2 py-3 w-fit whitespace-nowrap xl:text-base md:text-sm"
                  @click="openTutorial = !openTutorial"
                >
                  <Icon class="mr-3 w-8" iconName="info_circle"></Icon>Anleitung
                  zur Befestigung einblenden
                </SmallButton>
              </div>
              <div class="flex justify-between xl:my-5 md:my-2">
                <div
                  class="flex flex-col items-center justify-between bg-sky-100 px-3 rounded-lg xl:my-5 mx-2"
                >
                  <MicroSpeakerStatus
                    :role="this.getCurrentRecord.speaker1.role"
                    :microName="this.getAudioConfig.micro1_name"
                    :microStatus="this.microConfig.item1.status"
                    :microColor="this.getAudioConfig.micro1_color"
                  >
                  </MicroSpeakerStatus>
                  <!-- Calibration Button (unused)-->
                  <!-- <CalibrationButton
                    :calibrated="this.calibrated1"
                    :testRecord="this.testRecord1"
                    :recordBlocker="this.testRecord2"
                    @toggleRecord="
                      this.testRecord1 = !this.testRecord1;
                      this.sendCalibrateRequest(this.testRecord1, '1');
                    "
                    @setCalibrate="(e) => (this.calibrated1 = e)"
                    @calibrate="
                      this.sendCalibrateRequest(this.testRecord1, '1')
                    "
                  ></CalibrationButton> -->
                </div>
                <div
                  class="flex flex-col items-center justify-between bg-sky-100 px-3 rounded-lg xl:my-5 mx-2"
                >
                  <MicroSpeakerStatus
                    :role="this.getCurrentRecord.speaker2.role"
                    :microName="this.getAudioConfig.micro2_name"
                    :microStatus="this.microConfig.item2.status"
                    :microColor="this.getAudioConfig.micro2_color"
                  >
                  </MicroSpeakerStatus>

                  <!-- Calibration Button (unused)-->
                  <!-- <CalibrationButton
                    :calibrated="this.calibrated2"
                    :testRecord="this.testRecord2"
                    :recordBlocker="this.testRecord1"
                    @toggleRecord="
                      this.testRecord2 = !this.testRecord2;
                      this.sendCalibrateRequest(this.testRecord2, '2');
                    "
                    @setCalibrate="(e) => (this.calibrated2 = e)"
                    @calibrate="
                      this.sendCalibrateRequest(this.testRecord2, '2')
                    "
                  ></CalibrationButton> -->
                </div>
              </div>
            </div>
            <div v-else>
              <!--Show Tutorial-->
              <div class="flex my-4 w-full">
                <div class="flex mx-1 w-full">
                  <ImageStepsCard
                    @calibrate="
                      (e) =>
                        this.sendCalibrateRequest(
                          e,
                          this.getCurrentRecord.speaker1.name
                        )
                    "
                    :imageSrc="this.microConfig.item1.imageSrc"
                    number="1"
                    :speakerRole="this.getCurrentRecord.speaker1.role"
                    :status="this.microConfig.item1.status"
                    icon="roundError"
                    :speaker="this.getCurrentRecord.speaker1.role"
                  ></ImageStepsCard>
                </div>
                <div class="flex flex-col items-end mx-2 w-full">
                  <div class="-mt-16 my-3">
                    <SmallButton
                      preset="outlined"
                      size=""
                      class="mx-2 py-3 w-fit whitespace-nowrap"
                      @click="openTutorial = !openTutorial"
                    >
                      <Icon class="mr-3 w-8" iconName="info_circle"></Icon
                      >Anleitung zur Befestigung ausblenden
                    </SmallButton>
                  </div>
                  <div class="flex mx-1 w-full">
                    <ImageStepsCard
                      @calibrate="
                        (e) =>
                          this.sendCalibrateRequest(
                            e,
                            this.getCurrentRecord.speaker2.name
                          )
                      "
                      :speakerRole="this.getCurrentRecord.speaker2.role"
                      :imageSrc="this.microConfig.item2.imageSrc"
                      :number="2"
                      :status="this.microConfig.item2.status"
                      icon="roundError"
                      :speaker="this.getCurrentRecord.speaker2.role"
                    ></ImageStepsCard>
                  </div>
                </div>
              </div>
            </div>
          </span>

          <span v-if="currentStep == 3">
            <!-- Step 3: Keyword Tracking -->
            <div class="flex flex-row">
              <TextFieldWords
                :caseWords="this.getCurrentRecord.words.wordsToSay"
                :caseNotWords="this.getCurrentRecord.words.wordsNotToSay"
              ></TextFieldWords>
            </div>
          </span>

          <span v-if="currentStep == 4">
            <!-- Step 4: Recording Step-->
            <div
              class="flex flex-row justify-between w-full xl:px-4 xl:py-5 items-center my-2"
            >
              <div class="flex">
                <!-- Button: Start the record -->
                <RecordButton
                  id="startRecord"
                  :disabled="edit"
                  v-if="
                    this.recordingStatus == 'initial' ||
                    (this.recordingStatus == 'stopped' && !deleteConfirm)
                  "
                  class="w-max my-auto"
                  :color="this.recordingStatus"
                  @click="
                    this.recordingStatus = 'recording';
                    requestRecording('start');
                  "
                  :recordButtonState="this.recordingStatus"
                >
                  <span class="xl:mx-2 xl:mr-6 md:mr-3">{{ Buttontext }} </span>

                  <div
                    class="xl:p-3 md:py-3 rounded-full border-2 border-black"
                  >
                    <Icon
                      class="w-8"
                      iconName="microphone"
                      color="red"
                      :size="this.windowWidth > 1200 ? '48' : '24'"
                    >
                    </Icon>
                  </div>
                </RecordButton>
                <!-- Button: Confirm stopping the record -->
                <RecordButton
                  :disabled="edit"
                  v-else-if="this.recordingStatus == 'requestStop'"
                  :recordButtonState="this.recordingStatus"
                  class="w-max border-red-600 border-double border-4 my-auto"
                >
                  <span class="z-0 xl:mx-2 xl:text-xl md:text-base"
                    >Soll die Aufnahme wirklich gestoppt werden?
                    <div class="flex justify-evenly">
                      <div
                        class="hover:border-white border border-transparent rounded-lg xl:px-8 md:px-4 mt-2 py-2"
                        @click="
                          stopRecord();
                          this.recordingStatus = 'stopped';
                        "
                      >
                        Beenden & Speichern
                      </div>
                      <div
                        class="hover:border-white border border-transparent rounded-lg px-8 mt-2 py-2"
                        @click="this.recordingStatus = 'recording'"
                      >
                        Fortsetzen
                      </div>
                    </div>
                  </span>
                </RecordButton>

                <!-- Button: Stop Record -->
                <RecordButton
                  v-else-if="recordingStatus == 'recording'"
                  @click="recordingStatus = 'requestStop'"
                  class="w-max my-auto xl:px-3 flex justify-evenly border-red-600 border-double border-4"
                  :recordButtonState="this.recordingStatus"
                >
                  <span class="z-0 xl:mx-2">Aufnahme stoppen</span>
                  <div
                    class="xl:mx-4 md:mx-2 rounded-full bg-red-200 xl:py-4 md:py-3 animate-pulse"
                    v-if="this.recordingStatus == 'recording'"
                  >
                    <Icon
                      class="mx-4 animate-pulse"
                      :size="this.windowWidth > 1200 ? '48' : '24'"
                      iconName="microphone"
                      color="red"
                    />
                  </div>
                </RecordButton>
              </div>
              <svg
                viewBox="0 0 9 12"
                class="w-6 mt-6"
                style="margin-right: -20px; margin-left: -16px"
              >
                <line
                  x1="0.5"
                  y1="5"
                  x2="10"
                  y2="5"
                  stroke="lightblue"
                  stroke-width="1"
                  stroke-dasharray="0.9"
                ></line>
              </svg>
              <div
                class="flex flex-col items-center w-auto bg-sky-100 rounded-xl mx-5"
              >
                <MicroSpeakerStatus
                  :role="this.getCurrentRecord.speaker1.role"
                  :microName="this.getAudioConfig.micro1_name"
                  :microStatus="this.microConfig.item1.status"
                  :microColor="this.getAudioConfig.micro1_color"
                >
                </MicroSpeakerStatus>
                <MicroSpeakerStatus
                  :role="this.getCurrentRecord.speaker2.role"
                  :microName="this.getAudioConfig.micro2_name"
                  :microStatus="this.microConfig.item2.status"
                  :microColor="this.getAudioConfig.micro2_color"
                >
                </MicroSpeakerStatus>
              </div>
            </div> </span
          ><span v-if="currentStep == 5" class="w-fit flex">
            <!-- Step 5: Analysis can be obtained after it is loaded -->
            <div class="w-full h-full flex flex-col mx-3 my-5 items-center">
              <span
                class="text-bold xl:text-lg md:text-sm text-slate-600 my-4 w-fit"
              >
                Die Analyse für den Fall
                {{ this.getCaseConfig.case_selected.case_name }} ist
                abgeschlossen:
              </span>
              <RecordButton
                :disabled="edit"
                v-if="deleteConfirm"
                :recordButtonState="this.recordingStatus"
                class="w-max border-red-600 border-double border-4 my-auto"
              >
                <span class="z-0 xl:mx-2 xl:text-xl md:text-base"
                  >Soll die Aufnahme wirklich gelöscht werden?
                  <div class="flex justify-evenly">
                    <div
                      class="hover:border-white border border-transparent rounded-lg xl:px-8 md:px-4 mt-2 py-2"
                      @click="
                        this.deleteRecord();
                        this.recordingStatus = 'initial';
                      "
                    >
                      Löschen
                    </div>
                    <div
                      class="hover:border-white border border-transparent rounded-lg px-8 mt-2 py-2"
                      @click="
                        this.recordingStatus = 'stopped';
                        this.deleteConfirm = false;
                      "
                    >
                      Abbrechen
                    </div>
                  </div>
                </span>
              </RecordButton>
              <LoadButton
                v-else
                @click="waitForFeedback ? '' : (this.redirectRequest = true)"
                :loading="waitForFeedback"
                color="white"
                icon="presentation"
                text="Warte auf Analyse..."
                >Analyse ansehen</LoadButton
              >
            </div>
            <div class="rounded-xl pr-2">
              <div class="flex justify-center ml-24">
                <div
                  class="flex items-center mb-5 bg-[#3BA8D4]/50 w-auto rounded-xl my-4 py-2 xl:px-6 md:px-3 h-max mx-5 border-2"
                >
                  <Icon
                    class="mr-8 w-8"
                    iconName="users"
                    color="rgb(71 85 105)"
                    size="32"
                  />
                  <div class="flex flex-col items-start">
                    <span
                      class="w-fit xl:text-lg md:text-base font-bold text-slate-600 whitespace-nowrap pr-3"
                      >{{ this.getCurrentRecord.speaker1.role }}
                    </span>
                  </div>
                </div>
                <div
                  class="flex items-center mb-3 bg-red-200 w-auto rounded-xl my-4 py-2 xl:px-3 md:px-2 h-max border-2"
                >
                  <Icon
                    class="mr-8 w-8"
                    iconName="users"
                    color="rgb(71 85 105)"
                    size="32"
                  />
                  <div class="flex flex-col items-start">
                    <span
                      class="w-fit xl:text-lg md:text-base font-bold text-slate-600 whitespace-nowrap pr-3"
                      >{{ this.getCurrentRecord.speaker2.role }}
                    </span>
                  </div>
                </div>
              </div>

              <DataUsageConfig class="mr-2 -mt-7"></DataUsageConfig>
            </div>
          </span>

          <SmallButton
            size=""
            class="self-start ml-4 2xl:py-4 xl:py-3 md:py-2.5 2xl:px-8 xl:px-6 md:px-5 xl:text-sm md:text-xs font-bold"
            preset="filled"
            @click="this.nextStep()"
            v-if="this.currentStep < 4"
            >Weiter</SmallButton
          >
        </div>
      </Stepper>

      <!-- Record handle options -->
      <div
        class="justify-between my-8 flex items-center self-center w-fit"
        v-if="currentStep == 5"
      >
        <SmallButton
          preset="outlined"
          size=""
          class="w-auto my-2 mx-2 py-2 flex justify-between"
          @click="newRecord()"
        >
          <Icon iconName="arrowsCircle" class="mr-3"></Icon>Aufnahme wiederholen
        </SmallButton>
        <!-- <span v-if="deleteConfirm" class="text-[#3BA8D4] font-bold px-1"
          >Aufnahme wirklich löschen?</span
        > -->
        <SmallButton
          preset="outlined"
          size=""
          class="mx-2 h-fit my-2 w-auto py-2 flex justify-between"
          @click="!deleteConfirm ? deleteRecord() : ''"
        >
          <Icon
            iconName="delete"
            class="mr-3"
            :color="deleteConfirm ? 'red' : '#00617a'"
          ></Icon
          >Aufnahme löschen
        </SmallButton>

        <SmallButton
          preset="outlined"
          class="mx-2 my-2 w-auto py-2 flex justify-between"
          size=""
          @click="newConfiguration()"
        >
          <Icon iconName="settings" class="mr-3"></Icon>Neue Konfiguration
        </SmallButton>
      </div>
    </div>
  </div>
</template>
<script>
import RecordButton from "./RecordButton.vue";
import ImageStepsCard from "../configuration-components/ImageStepsCard.vue";
// import Dropdown from "../form-components/Dropdown.vue";
import SmallButton from "../interface-components/SmallButton.vue";
// import BigButton from "../interface-components/BigButton.vue";
import DataUsageConfig from "../steps/DataUsageConfig.vue";
// import FeedbackConfig from "../steps/FeedbackConfig.vue";
import SpeakerForm from "../configuration-components/SpeakerForm.vue";
import Combobox from "../form-components/Combobox.vue";
// import TableCases from "../tables/TableCases.vue";
import Stepper from "../form-components/Stepper.vue";
import Icon from "../interface-components/Icon.vue";
import { mapGetters, mapState } from "vuex";
import axios from "axios";
import LoadButton from "../interface-components/LoadButton.vue";
// import InfoArea from "../interface-components/InfoArea.vue";
import { API_URL } from "../../config";
// import ButtonPanelHorizontal from "../form-components/ButtonPanelHorizontal.vue";
import MicroSpeakerStatus from "./MicroSpeakerStatus.vue";
// import CalibrationButton from "./CalibrationButton.vue";
import CodeGenerator from "../configuration-components/CodeGenerator.vue";
import TextFieldWords from "../form-components/TextFieldWords.vue";

export default {
  components: {
    RecordButton,
    ImageStepsCard,
    // Dropdown,
    SmallButton,
    DataUsageConfig,
    // FeedbackConfig,
    SpeakerForm,
    Combobox,
    // TableCases,
    Stepper,
    Icon,
    LoadButton,
    // BigButton,
    // InfoArea,
    // ButtonPanelHorizontal,
    MicroSpeakerStatus,
    // CalibrationButton,
    CodeGenerator,
    TextFieldWords,
  },
  data() {
    return {
      deleteConfirm: false,
      newFeedbackId: "",
      newTranscriptId: "",
      windowWidth: window.innerWidth,
      manualRegistration1: true,
      manualRegistration2: true,
      registrationCode1: { code: "", status: "open" },
      registrationCode2: { code: "", status: "open" },
      codes: [],
      errorMessage: "",
      openTutorial: false,
      testRecord1: false,
      testRecord2: false,
      redirectRequest: false,
      cases: [],
      steps: [
        {
          name: "Fallbeispiel wählen",
          description: "",
          href: "#case",
          status: "current",
          icon: "mask",
          completed: false,
        },
        {
          name: "Sprecher*innen wählen",
          description: "",
          href: "#sprecher",
          status: "upcoming",
          icon: "document",
          completed: false,
        },
        {
          name: "Mikrofone einrichten",
          description: "",
          href: "#mikrofone",
          status: "upcoming",
          icon: "tool",
          completed: false,
        },
        {
          name: "Schlüsselwörter angeben",
          description: "",
          href: "#words",
          status: "upcoming",
          icon: "textInput",
          completed: false,
        },
        // {
        //   name: "Mikrofone einrichten",
        //   description: "",
        //   href: "#mikrofoneAn",
        //   status: "upcoming",
        //   icon: "microphone",
        //   completed: false,
        // },
        {
          name: "Aufnahme starten",
          description: "",
          href: "#Aufnahme",
          status: "upcoming",
          icon: "microphone",
          completed: false,
        },
        {
          name: "Analyse einsehen",
          description: "",
          href: "#Analyse",
          status: "disabled",
          icon: "search",
          completed: false,
        },
      ],
      recordingStatus: "initial",
      selectedCase: "",
      caseLabels: ["Name", "Beschreibung"],
      microConfig: {
        item1: {
          imageSrc: "../src/assets/v2-Mikrofon-rot.png",
          speaker: "",
          steps: [
            "Bitte Mikrofon 1 anschalten",
            // "Mikrofon an der Kleidung von" + this.getSpeaker1 + " befestigen.",
          ],
          color: "blue",
          number: "2",
          status: 0,
          counter: 10,
        },
        item2: {
          speaker: "",
          imageSrc: "../src/assets/v2-Mikrofon-blau.png",
          steps: [
            "Bitte Mikrofon 1 anschalten",
            // "Mikrofon an der Kleidung" + this.getSpeaker2 + " befestigen.",
          ],
          color: "red",
          number: "1",
          status: 0,
          counter: 10,
        },
      },
      speaker: "",
      iconUser1: "users",
      iconUser2: "users",
      showData: true,
      showFeedback: false,
      session: {
        baseConfig: {
          application_domain: "",
          subject_name: "",
          subject_topic: "",
          event_topic: "",
        },
        roomConfig: {
          room_size: "roomsize1",
          room_echo: "echo1",
          room_selected: "1",
          rooms: [
            { name: "Seminarraum 23", color: "" },
            { name: " Banach", color: "" },
            { name: "Raum X1", color: "" },
            { name: "Tüftl", color: "" },
            { name: "C2", color: "" },
          ],
        },
        caseConfig: {
          case_name: "",
          case_description: "",
          case_notes: " ",
        },
        speakerConfig: {
          speaker1_name: "",
          speaker1_role: "",
          speaker2_name: "",
          speaker2_role: "",
          roles: [
            { name: "Patient*in" },
            { name: "Arzt / Ärztin" },
            { name: "Hebamme" },
            { name: "Physiotherapeut*in" },
          ],
        },
        audioConfig: {
          micro1_id: "1",
          micro1_name: "Nr.1",
          micro1_color: "blue",
          micro1_brand: "kp",
          micro2_id: "2",
          micro2_name: "Nr.2",
          micro2_brand: "String",
          micro2_color: "red",
          microphones: [
            { name: "Nr.1", color: "red" },
            { name: "Nr.2", color: "blue" },
            { name: "Nr.3", color: "green" },
          ],
        },
      },
      waitForFeedback: true,
      stopButton: true,
      modalActive: false,
      showConfirm: false,
      edit: false,
      recordVisible: false,
      Buttontext: "Aufnahme starten",
      currentStep: 0,
    };
  },
  methods: {
    deleteRecord() {
      if (!this.deleteConfirm) {
        this.deleteConfirm = true;
      } else {
        this.currentStep = 4;

        var token = "";
        if (localStorage && localStorage.getItem("token")) {
          const storedToken = localStorage.getItem("token");
          if (storedToken !== null) {
            token = storedToken;
          }
        }
        let vue = this;
        axios
          .delete(API_URL + "/analysis/" + this.getCurrentRecord.feedbackId, {
            headers: { Authorization: "Bearer " + token },
          })
          .then(() => {
            vue.newRecord();

            //reset record status
            this.$store.setCurrentRecord({
              words: {
                wordsToSay: [],
                wordsNotToSay: [],
              },
              speaker1: {
                id: "1",
                color: "#3BA8D4",
                name: "",
                role: "Rolle 1",
                student: true,
                dataUsage: [
                  { name: "saveTranscript", checked: true },
                  { name: "saveRecord", checked: true },
                  { name: "saveAnalysis", checked: true },
                ],
                parameters: [
                  { name: "tempo", checked: true },
                  { name: "pitch", checked: true },
                  { name: "loudness", checked: true },
                  { name: "shares", checked: true },
                  { name: "pauses", checked: true },
                  { name: "words", checked: true },
                ],
                verified: false,
              },
              speaker2: {
                id: "2",
                color: "#A71F60",
                name: "",
                role: "Rolle 2",
                student: false,
                dataUsage: [
                  { name: "saveTranscript", checked: true },
                  { name: "saveRecord", checked: true },
                  { name: "saveAnalysis", checked: true },
                ],
                parameters: [
                  { name: "tempo", checked: true },
                  { name: "pitch", checked: true },
                  { name: "loudness", checked: true },
                  { name: "shares", checked: true },
                  { name: "pauses", checked: true },
                  { name: "words", checked: true },
                ],
                verified: false,
              },
              case: { id: "", name: "" },
              calibrated: false,
              recordStatus: "not recorded",
              feedbackId: null,
            });
          })
          .catch((error) => {
            this.errorMessage = error.message;
          });
        this.deleteConfirm = false;
      }
    },
    /**
     * Updates the status of the steps based on the current step.
     *
     * @param {void} This function does not have any parameters.
     * @return {void} This function does not return anything.
     */
    nextStep() {
      if (this.currentStep == 0) {
        this.steps[0].status = "hidden";
        this.steps[1].status = "current";
        this.currentStep++;
        return;
      }

      this.errorMessage = "";
      for (let i = 0; i <= this.currentStep; i++) {
        this.steps[this.currentStep - i].status = "hidden";
      }

      this.steps[this.currentStep].status = "complete";
      this.currentStep++;
      this.steps[this.currentStep].status = "current";
    },
    /**
     * Updates the status of the steps in the `steps` array based on the given `step` parameter.
     *
     * @param {number} step - The step to navigate to.
     * @return {void} This function does not return anything.
     */
    goTo(step) {
      if (step <= 1) {
        this.currentStep = step;
        this.errorMessage = "";
        for (let i = 0; i < this.steps.length - 1; i++) {
          if (i < step) {
            this.steps[i].status = "complete";
          } else if (i == step) {
            this.steps[i].status = "current";
          } else this.steps[i].status = "upcoming";
        }
        if (this.getCurrentRecord.recordStatus == "stopped") {
          this.steps[5].status = "upcoming";
        }

        this.steps[step].status = "current";
        return;
      }
      if (
        step >= 2 &&
        this.getCurrentRecord.speaker1 &&
        this.getCurrentRecord.speaker2
      ) {
        if (step === 5) {
          if (this.getCurrentRecord.recordStatus == "stopped") {
            this.errorMessage = "";
            this.currentStep = step;

            for (let i = 0; i < this.steps.length; i++) {
              if (i < step) {
                this.steps[i].status = "complete";
              } else if (i == step) {
                this.steps[i].status = "current";
              }
            }
          } else return;
        } else if (step == 4) {
          this.errorMessage = "";
          this.currentStep = step;
          for (let i = 0; i < this.steps.length; i++) {
            if (i < step) {
              this.steps[i].status = "complete";
            } else if (i == step) {
              this.steps[i].status = "current";
            } else this.steps[i].status = "upcoming";
          }
          if (this.getCurrentRecord.recordStatus !== "stopped") {
            this.steps[5].status = "disabled";
          }
        } else {
          this.errorMessage = "";
          this.currentStep = step;
          for (let i = 0; i < this.steps.length; i++) {
            if (i < step) {
              this.steps[i].status = "complete";
            } else if (i == step) {
              this.steps[i].status = "current";
            } else this.steps[i].status = "upcoming";
          }
        }
      }
    },
    /**
     * Sets the microphone configuration in the Vuex store. (unused)
     *
     * @param {Event} e - The event object containing the microphone selection.
     * @param {number} number - The number of the microphone.
     * @return {void} This function does not return anything.
     */
    setMic(e, number) {
      this.$store.commit("setMicrophone", [
        number,
        e.value,
        this.getAudioConfig.microphones[e.value[3] - 1].color,
      ]);
    },
    /**
     * Selects a case based on the provided event and updates the step status.
     *
     * @param {any} e - The event object containing information about the selection
     * @return {void}
     */
    selectCase(e) {
      this.$store.commit("selectCase", e);

      this.steps[0].completed = true;
    },
    /**
     * Request recording based on the given command.
     *
     * @param {string} command - The command to execute. Possible values are "start" and "stop".
     * @return {void} This function does not return anything.
     */
    requestRecording(command) {
      if (command == "start") {
        this.$store.commit("setCurrentRecord", {
          speaker1: { id: "1" },
          speaker2: { id: "2" },
        });

        // analysis data object for the new record
        let new_analysis = {
          user_ids: [this.getUsers[0]],

          session_id: this.getCurrentSession.id,
          edit_date: new Date(),
          case_id: this.getCurrentRecord.case.case_id,
          speakers: [
            this.getCurrentRecord.speaker1,
            this.getCurrentRecord.speaker2,
          ],
          wordsToSay:
            this.getSubstantives && this.getSubstantives.wordsToSay
              ? this.getSubstantives.wordsToSay
              : [],
          wordsNotToSay:
            this.getSubstantives && this.getSubstantives.wordsNotToSay
              ? this.getSubstantives.wordsNotToSay
              : [],
        };

        // server request
        var token = "";
        if (localStorage && localStorage.getItem("token")) {
          const storedToken = localStorage.getItem("token");
          if (storedToken !== null) {
            token = storedToken;
          }
        }
        let newId = "";
        axios
          .post(API_URL + "/analysis", new_analysis, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((response) => {
            console.log("DB request response", response.data.feedbackId);
            newId = response.data;
            this.$store.commit("setCurrentRecord", {
              feedbackId: newId.feedbackId,
              recordStatus: "recording",
            });
            this.newFeedbackId = response.data.feedbackId;

            // data object for the recording
            const data = {
              wordsToSay:
                this.getSubstantives && this.getSubstantives.wordsToSay
                  ? this.getSubstantives.wordsToSay
                  : [],
              wordsNotToSay:
                this.getSubstantives && this.getSubstantives.wordsNotToSay
                  ? this.getSubstantives.wordsNotToSay
                  : [],
              feedbackId: newId.feedbackId,
            };
            console.log(data);
            axios
              .post(this.getCurrentInstance.url + "/recording/start", data)
              .then((response) => {
                console.log("start", response);
              });
          })
          .catch((error) => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
      }

      if (command == "stop") {
        axios.post(this.getCurrentInstance.url + "/recording/stop");
        this.$store.commit("setRecordedCase", this.getCurrentRecord);
        this.$store.commit("setCurrentRecord", { recordStatus: "stopped" });
      }
    },
    /**
     * Stops the recording process and sets up the next step.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    stopRecord() {
      this.currentStep = 5;
      this.steps[this.currentStep].status = "current";

      this.requestRecording("stop");

      // Define the interval duration (e.g., 5000 ms = 5 seconds)
      const intervalDuration = 1000;
      let timer;

      timer = setInterval(this.requestData, intervalDuration);

      this.showConfirm = false;
      this.Buttontext = "Neue Aufnahme starten";
      this.stopButton = false;
      this.hidePreviousSteps();
    },

    // Function to request data from the server
    requestData() {
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
          let el = response.data.find((obj) => {
            return obj.id === this.newFeedbackId;
          });
          this.newTranscriptId = el.transcript.transcriptId;
        })
        .then((res) => {
          axios
            .get(API_URL + "/analysis/transcript/" + this.newTranscriptId, {
              headers: { Authorization: "Bearer " + token },
            })
            .then((response) => {
              // console.log(response.data._doc);
              let transcript = response.data._doc;
              if (
                transcript.transcripts[0].content.length > 0 ||
                transcript.transcripts[1].content.length > 0
              ) {
                this.waitForFeedback = false;
              }
            })
            .catch((error) => {
              this.errorMessage = error.message;
              console.error("There was an error!", error);
            });
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    /**
     * Hides all previous steps in the steps array by setting their status to "hidden".
     *
     * @return {void} This function does not return anything.
     */
    hidePreviousSteps() {
      for (let i = 0; i < this.steps.length - 1; i++) {
        this.steps[i].status = "hidden";
      }
    },
    /**
     * Sets the status of the steps in the `steps` array to "upcoming", "complete", or "current"
     * based on the current step and resets the current step to 4.
     *
     * @return {void} This function does not return anything.
     */
    newRecord() {
      this.steps[5].status = "disabled";
      this.currentStep = 4;
      this.steps[4].status = "current";
      for (let i = 0; i < this.steps.length - 2; i++) {
        this.steps[i].status = "complete";
      }
    },

    /**
     * Resets the current configuration and sets the first step as the current step.
     *
     * @param {void} This function does not take any parameters.
     * @return {void} This function does not return anything.
     */
    newConfiguration() {
      this.currentStep = 0;
      for (let i = 0; i < this.steps.length; i++) {
        this.steps[i].status = "upcoming";
      }
      this.steps[0].status = "current";
    },

    /**
     * Decrements the current step if it is greater than zero.
     *
     * @return {void}
     */
    previous() {
      if (this.currentStep > 0) this.currentStep -= 1;
    },

    /**
     * Retrieves the microphone status from the server and updates the local state accordingly.
     *
     * @return {Promise<void>} A promise that resolves when the microphone status is successfully retrieved and the local state is updated.
     */
    getMicroStatus() {
      axios
        .get(this.getCurrentInstance.url + "/status")
        .then((response) => {
          console.log(response.data.microphones);
          if (response.data.microphones[0].active == "1") {
            this.microConfig.item1.counter = 30;
            this.microConfig.item1.status = "1";
          } else if (this.microConfig.item1.counter >= 0)
            this.microConfig.item1.counter--;

          if (this.microConfig.item1.counter <= 0) {
            this.microConfig.item1.status = "0";
          }
          if (response.data.microphones[1].active == "1") {
            this.microConfig.item2.counter = 30;
            this.microConfig.item2.status = "1";
          } else if (this.microConfig.item2.counter >= 0)
            this.microConfig.item2.counter--;
          if (this.microConfig.item2.counter <= 0)
            this.microConfig.item2.status = "0";
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    /**
     * Fetches code data from the API and updates the component's state. (unused feature)
     *
     * @return {Promise<void>} A Promise that resolves when the code data is fetched and the component's state is updated.
     */
    fetchCodeData() {
      const vue = this;
      const token =
        localStorage && localStorage.getItem("token")
          ? localStorage.getItem("token")
          : "";
      axios
        .get(API_URL + "/codes", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.codes = response.data;
        })
        .catch((error) => {
          if (error.response.status == 401) vue.$router.replace("/login");
          this.errorMessage = error.message;
          //console.error("There was an error!", error);
        });
    },
  },
  mounted() {
    this.$emit("resetFlags");
    let caseConf = JSON.parse(JSON.stringify(this.getCaseConfig.cases));
    for (let i = 0; i < caseConf.length; i++) {
      this.cases.push({ name: caseConf[i].case_name, id: caseConf[i].case_id });
    }
    this.steps[1].completed = this.speakerSelected;
    this.steps[0].completed = this.caseSelected;
    this.steps[2].completed = this.microphoneSelected;

    if (localStorage.getItem("username") !== "cosy") {
      window.setInterval(() => {
        this.getMicroStatus();
      }, 2000);
    }
    // check micro status

    this.fetchCodeData();

    this.session = this.getCurrentSession;

    this.microConfig.item1.color = this.getAudioConfig.micro1_color;
    this.microConfig.item2.color = this.getAudioConfig.micro2_color;
    this.microConfig.item1.name = this.getAudioConfig.micro1_name;
    this.microConfig.item2.name = this.getAudioConfig.micro2_name;
    this.microConfig.item1.number = this.getAudioConfig.micro1_id;
    this.microConfig.item2.number = this.getAudioConfig.micro2_id;
  },
  watch: {
    deleteConfirm(newValue) {
      console.log("deleteConfirm changed:", newValue);
    },
  },
  computed: {
    isDeleteConfirm() {
      return this.deleteConfirm;
    },
    ...mapState(["currentSession"]),
    ...mapGetters({
      getSpeakers: "getSpeakers",
      getBaseConfig: "getBaseConfig",
      getCurrentSession: "getCurrentSession",
      getRoomConfig: "getRoomConfig",
      getAudioConfig: "getAudioConfig",
      getCaseConfig: "getCaseConfig",
      getCurrentRecord: "getCurrentRecord",
      getFeedbacks: "getFeedbacks",
      getUsers: "getUsers",
      getCurrentFeedback: "getCurrentFeedback",
      getSubstantives: "getSubstantives",
      getCurrentInstance: "getCurrentInstance",
    }),
    /**
     * Checks if a case is selected.
     *
     * @return {boolean} Indicates if a case is selected
     */
    caseSelected() {
      return this.getCaseConfig.case_selected !== "";
    },

    /**
     * Returns an array containing the names and roles of the two speakers in the current record.
     *
     * @return {Array} An array containing the names and roles of the two speakers in the current record.
     */
    speakerSelected() {
      return [
        this.getCurrentRecord.speaker1.name,
        this.getCurrentRecord.speaker2.name,
        this.getCurrentRecord.speaker1.role,
        this.getCurrentRecord.speaker2.role,
      ];
    },
    /**
     * Checks if both microphone names are present in the audio configuration.
     *
     * @return {boolean} True if both microphone names are set, false otherwise.
     */
    microphoneSelected() {
      return this.getAudioConfig.micro1_name && this.getAudioConfig.micro2_name;
    },
  },
};
</script>
