<!--Configuration component: Case configuration-->
<template>
  <div class="flex flex-col items-center" v-if="this.renderComponent">
    <Teleport to="body" v-if="newCase">
      <!-- Overlay: new case or edit case -->

      <div
        class="bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center absolute inset-0 z-20"
        id="overlay"
        @click.self="
          newCase = false;
          this.existent = false;
        "
      >
        <div
          @click.self="close"
          class="flex flex-col justify-start absolute w-fit rounded-xl py-3 px-3 bg-ocean-dark/50 shadow-lg inset-1/2-screen"
        >
          <div class="flex flex-col mx-auto justify-center pb-3">
            <div class="flex">
              <span class="font-bold text-xl ml-auto my-2 text-white center">{{
                !this.getNewCase.case_name
                  ? "Neuer Fall"
                  : "Fall " + this.getNewCase.case_name
              }}</span>
              <div
                class="flex ml-auto h-fit justify-end right hover:bg-blue-200 rounded-lg"
                @click="
                  newCase = false;
                  this.$store.commit('setCaseConfig', '');

                  this.existent = false;
                "
              >
                <Icon iconName="close" color="white" size="32"></Icon>
              </div>
            </div>

            <!-- Input Form -->
            <div
              class="w-full h-full flex flex-col items-start my-auto mx-auto justify-start px-3 pt-6 pb-3 rounded-xl"
              :class="{
                'bg-sky-100': !highlightForm,
                'bg-blue-200': highlightForm,
              }"
            >
              <div class="flex self-end -my-5">
                <div
                  @click="this.deleteRequest = true"
                  class="mx-3 border-4 p-1 border-transparent rounded-lg hover:border-red-500 w-fit hver-bg-sky-100"
                  :class="{
                    'border-red-500': this.deleteRequest,
                  }"
                >
                  <Icon
                    iconName="delete"
                    size="24"
                    color="gray"
                    v-if="!this.deleteRequest"
                  ></Icon>
                </div>

                <div class="flex items-center w-fit" v-if="this.deleteRequest">
                  <div class="flex justify-start w-min mx-2">
                    <div
                      class="items-center flex w-fit cursor-pointer font-bold border-slate-300 hover:border-white border-4 border-transparent rounded-lg px-2 mx-1 py-1"
                      @click="this.deleteCase(this.getNewCase.case_id)"
                    >
                      <Icon iconName="delete" size="24" color="red"></Icon>
                      <span class="mx-1">Löschen</span>
                    </div>
                    <div
                      class="cursor-pointer self-center font-bold border-slate-300 hover:border-white border-4 border-transparent rounded-lg px-2 mx-1 py-1"
                      @click="reset()"
                    >
                      Abbrechen
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-start justify-between my-2 mx-8">
                <InputField
                  id="0"
                  @input="
                    updateForm($event.target);
                    this.$emit('data-changed');
                  "
                  :model="this.getNewCase.case_name"
                  >Fallname
                </InputField>
                <div class="flex w-full justify-start py-1">
                  <div
                    class="font-bold 2xl:text-base md:text-sm w-full text-slate-500 -ml-4"
                  >
                    <span class="pl-6">Rolle 1</span>
                    <Combobox
                      :data="this.getRoles"
                      :selectedValue="this.getNewCase.case_role1"
                      @update-data="
                        (data) => {
                          this.$store.commit('setCaseConfig', ['4', data.name]);
                        }
                      "
                    ></Combobox>
                  </div>
                  <div
                    class="font-bold 2xl:text-base md:text-sm w-full text-slate-500"
                  >
                    <span class="pl-6">Rolle 2</span>
                    <Combobox
                      :data="this.getRoles"
                      :selectedValue="this.getNewCase.case_role2"
                      @update-data="
                        (data) =>
                          this.$store.commit('setCaseConfig', ['5', data.name])
                      "
                    ></Combobox>
                  </div>
                </div>

                <div
                  v-if="showWords"
                  class="flex justify-center items-center rounded-lg -my-2"
                >
                  <TextFieldWords
                    class="-mx-2"
                    :caseWords="this.getNewCase.case_wordsToSay"
                    :caseNotWords="this.getNewCase.case_wordsNotToSay"
                  ></TextFieldWords>
                  <div
                    class="self-start mt-14 p-1 hover:bg-blue-200 rounded-lg -ml-3"
                    @click="this.showWords = false"
                  >
                    <Icon iconName="close" size="24"></Icon>
                  </div>
                </div>

                <div v-if="showDescription" class="flex flex-col">
                  <span class="text-slate-500 font-bold"
                    >Fallbeschreibung:</span
                  >
                  <div class="flex">
                    <textarea
                      id="1"
                      class="w-auto rounded-lg"
                      @input="
                        updateForm($event.target);
                        this.$emit('data-changed');
                      "
                      v-model="this.getNewCase.case_description"
                    ></textarea>
                    <div
                      class="self-start p-1 hover:bg-blue-200 rounded-lg z-20 mx-1 my-3"
                      @click="this.showDescription = false"
                    >
                      <Icon iconName="close" size="24"></Icon>
                    </div>
                  </div>
                </div>

                <div v-if="showRequisites" class="flex">
                  <InputField
                    class="w-full"
                    id="2"
                    @input="
                      updateForm($event.target);
                      this.$emit('data-changed');
                    "
                    :model="this.getNewCase.case_requisites"
                    >Requisiten
                  </InputField>
                  <div
                    class="self-start mt-7 p-1 hover:bg-blue-200 rounded-lg mx-1"
                    @click="this.showRequisites = false"
                  >
                    <Icon iconName="close" size="24"></Icon>
                  </div>
                </div>

                <div v-if="showNotes" class="flex flex-col justify-between">
                  <span class="text-slate-500 font-bold">Anmerkungen:</span>
                  <div class="flex">
                    <textarea
                      class="w-auto rounded-lg"
                      id="3"
                      @input="
                        updateForm($event.target);
                        this.$emit('data-changed');
                      "
                      v-model="this.getNewCase.case_notes"
                    ></textarea>
                    <div
                      class="self-start mt-4 p-1 hover:bg-blue-200 rounded-lg my-4 mx-1"
                      @click="this.showNotes = false"
                    >
                      <Icon iconName="close" size="24"></Icon>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex py-1 justify-center self-center">
                <span
                  class="self-start -ml-2 mr-2 py-1.5 text-slate-500 font-bold"
                  v-if="
                    !this.showDescription ||
                    !this.showNotes ||
                    !this.showRequisites ||
                    !this.showWords
                  "
                  >Weiteres:</span
                >
                <div class="flex flex-col">
                  <SmallButton
                    v-if="!showWords"
                    size=""
                    class="py-1 m-0.5"
                    preset="outlined"
                    @click="this.showWords = true"
                    ><Icon class="mr-2" size="12" iconName="plus"></Icon
                    >Schlüsselwörter</SmallButton
                  >
                  <SmallButton
                    v-if="!showDescription"
                    size=""
                    class="py-1 m-0.5"
                    preset="outlined"
                    @click="this.showDescription = true"
                    ><Icon class="mr-2" size="12" iconName="plus"></Icon
                    >Beschreibung</SmallButton
                  >
                </div>
                <div class="flex flex-col">
                  <SmallButton
                    v-if="!showRequisites"
                    size=""
                    class="py-1 m-0.5"
                    preset="outlined"
                    @click="this.showRequisites = true"
                    ><Icon class="mr-2" size="12" iconName="plus"></Icon
                    >Requisiten</SmallButton
                  >
                  <SmallButton
                    v-if="!showNotes"
                    size=""
                    class="py-1 m-0.5"
                    preset="outlined"
                    @click="this.showNotes = true"
                    ><Icon class="mr-2" size="12" iconName="plus"></Icon
                    >Anmerkungen</SmallButton
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="flex justify-center mt-1 mx-auto">
              <SmallButton
                v-if="newCase"
                class="mx-2"
                @click="
                  existent ? updateCase() : addCase();
                  newCase = false;
                "
                size=""
                ><span v-if="this.existent">Speichern</span
                ><span v-else>Hinzufügen</span></SmallButton
              >
              <SmallButton
                v-else
                class="mx-2"
                @click="
                  addCase();
                  newCase = false;
                  this.existent = false;
                "
                size=""
                >Speichern</SmallButton
              >
              <SmallButton
                class="mx-2"
                @click="
                  this.newCase = false;
                  this.existent = false;
                  this.$store.commit('setCaseConfig', '');
                "
                preset="outline"
                size=""
                >Abbrechen</SmallButton
              >
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!--All existent cases belonging to the session-->
    <div class="flex flex-col">
      <TableCases
        v-if="renderComponent && this.getCaseConfig"
        :size="this.size"
        ref="cases"
        class="w-full mx-2"
        icon="clockRewind"
        limit="20"
        :button="true"
        :data="this.getCaseConfig.cases"
        :labels="caseLabels"
        @delete="deleteCase"
        @open="openCase"
        @go-to-record="(e) => this.$emit('go-to-record', e)"
        @new-case="this.newCase = true"
        :delete="true"
        :showRecord="showRecord"
        >Fallbeispiele
      </TableCases>
    </div>
  </div>
</template>
<script>
import InputField from "../form-components/InputField.vue";
import TableCases from "../tables/TableCases.vue";
import { mapState, mapGetters } from "vuex";
import SmallButton from "../interface-components/SmallButton.vue";
import Icon from "../interface-components/Icon.vue";
import axios from "axios";
import { API_URL } from "../../config";
import Combobox from "../form-components/Combobox.vue";
import TextFieldWords from "../form-components/TextFieldWords.vue";

export default {
  name: "CaseConfig",
  components: {
    InputField,
    TextFieldWords,
    TableCases,
    SmallButton,
    Icon,
    Combobox,
  },
  props: {
    size: { type: String, default: "medium" },
    showRecord: { type: Boolean, default: false },
  },
  data() {
    return {
      showDescription: false,
      showNotes: false,
      showWords: false,
      showRequisites: false,
      renderTable: true,
      windowHeight: window.innerHeight,
      deleteRequest: false,
      addCaseText: "Fall hinzufügen",
      newCase: false,
      content: "",
      anmerkungen: "Anmerkungen hinzufügen",
      cases: [],
      caseLabels: ["Fallname", "Fallbeschreibung", "Anmerkungen"],
      highlightForm: false,
      OverlayText: "Hinzufügen",
      existent: false,
      renderComponent: true,
    };
  },
  methods: {
    /**
     * Deletes a case from the store and updates the view after a delay.
     *
     * @param {string} id - The ID of the case to be deleted.
     * @return {void} This function does not return anything.
     */
    deleteCase(id) {
      this.$store.commit("deleteCase", id);
      const session = this.getCurrentSession;
      this.postUpdate(session);
      this.deleteRequest = false;
      this.newCase = false;
      setTimeout(() => {
        this.cases = this.getCaseConfig.cases;
        this.$forceUpdate();
      }, 500);
    },
    /**
     * Resets the deleteRequest flag to false.
     *
     * @return {void} This function does not return anything.
     */
    reset() {
      this.deleteRequest = false;
    },
    /**
     * Sets the case in the store and updates the component state.
     *
     * @param {string} id - The ID of the case to be opened.
     * @return {void} This function does not return anything.
     */
    openCase(id) {
      this.$store.commit("setCase", id);
      this.newCase = this.newCase ? true : true;
      this.existent = true;
    },
    /**
     * A function that forces a re-render of the component by toggling the renderComponent property.
     *
     * @return {void} This function does not return anything.
     */
    forceRender() {
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },
    /**
     * A function that updates the case in the store and triggers a re-render.
     *
     * @return {void} This function does not return anything.
     */
    updateCase() {
      this.$store.commit("saveCase", this.getNewCase.case_id);

      this.forceRender();
      this.existent = false;
    },
    /**
     * Updates the role in the case configuration.
     *
     * @param {string} id - The ID of the role.
     * @param {Event} e - The event object.
     * @return {void}
     */
    updateRole(id, e) {
      var payload = [id, e.value];
      this.$store.commit("setCaseConfig", payload);
    },

    /**
     * Adds a new case to the store and triggers a re-render after a delay.
     *
     * @return {void} This function does not return anything.
     */
    addCase() {
      this.$store.commit("addCase");
      const session = this.getCurrentSession;
      this.postUpdate(session);
      setTimeout(() => {
        this.cases = this.getCaseConfig.cases;
        this.$forceUpdate();
      }, 500);
    },
    /**
     * Updates the session with the provided data if the current session exists.
     *
     * @param {Object} session - The session data to update.
     * @return {void} This function does not return anything.
     */
    postUpdate(session) {
      console.log(session);
      if (!this.currentSession) {
        return;
      }
      let token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      if (session)
        axios
          .put(API_URL + "/sessions/" + session.id, session, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      this.$forceUpdate;
    },
    /**
     * Updates the case configuration in the store with the given target.
     *
     * @param {Object} target - The target object containing the id and value to update.
     * @return {void}
     */
    updateForm(target) {
      var payload = [target.id, target.value];
      this.$store.commit("setCaseConfig", payload);
    },
    /**
     * Initializes the cases by fetching them from the case configuration.
     *
     * @return {Promise<void>} - A promise that resolves once the cases are fetched and assigned.
     */
    async init() {
      this.cases = await this.getCaseConfig.cases;
    },
  },
  mounted() {
    this.content = this.getNewCase.case_notes;
    setTimeout(() => this.init(), 150);
  },
  watch: {
    /**
     * Updates the visibility of the case description, requisites, words, and notes based on the values of the corresponding properties in the `getNewCase` object.
     *
     * @param {boolean} val - The value indicating whether the case is new.
     * @return {void}
     */
    newCase(val) {
      if (!val) {
        return;
      }
      if (this.getNewCase.case_description) {
        this.showDescription = true;
      }
      if (this.getNewCase.case_requisites) {
        this.showRequisites = true;
      }
      if (
        this.getNewCase.case_wordsToSay ||
        this.getNewCase.case_wordsNotToSay
      ) {
        this.showWords = true;
      }
      if (this.getNewCase.case_notes) {
        this.showNotes = true;
      }
    },
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getNewCase: "getNewCase",
      getCurrentSession: "getCurrentSession",
      getCaseConfig: "getCaseConfig",
      getSpeakerConfig: "getSpeakerConfig",
      getRoles: "getRoles",
    }),
  },
};
</script>
