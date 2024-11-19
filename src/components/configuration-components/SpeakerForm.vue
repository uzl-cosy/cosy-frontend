<!--Configuration Component: SpeakerForm.vue contains a form for a speaker code and a role selection-->
<template>
  <!-- <div class="flex items-center self-start ml-12">
      <span class="text-slate-600">Zugeordnetes Mikrofon:</span>
      <smallLabel class="z-10 my-6 mx- self-start" :color="mikroColor">
        Nr. {{ mikroNumber }}
      </smallLabel>
    </div> -->
  <div
    class="text-slate-700 flex items-center rounded-xl w-full bg-sky-100 pt-2 pb-2 my-2 2xl:mx-2 xl:mx-1 px-3"
  >
    <div class="flex flex-col items-start justify-center 2xl:px-1">
      <div
        class="px-1 left flex items-center font-bold 2xl:text-lg md:text-base w-fit"
      >
        <div class="flex flex-col items-start">
          <div
            class="absolute text-sm font-normal w-full z-20 -mt-20 -ml-32 top-8 flex flex-col items-center"
            v-if="this.showSpeakerCodeInfo"
          >
            <ul
              class="bg-white pt-1 pb-2 px-3 rounded-lg shadow-md border-2 border-slate-200 z-20 leading-5"
            >
              <li>
                • erste zwei Buchstaben des
                <strong>Studienfachs</strong> (z. B. No, Al, Me, Er, Ph, He, Pf,
                Ps)
              </li>
              <li>
                • Erster und vorletzter Buchstabe des
                <strong>eigenen Vornamens</strong> (z.B. Se)
              </li>
              <li>
                • <strong>Geburtsmonat der Mutter</strong> (z. B. "03", "11")
              </li>
              <li>
                • erster und letzter Buchstabe <strong>Geburtsort</strong> (z.B.
                "Hm")
              </li>

              <p class="mt-1 text-xs">Beispiel: NoFa08Hm</p>
            </ul>
            <svg height="44" width="32">
              <polygon
                points="0 0 32,0 16,22"
                style="fill: rgb(255, 255, 255)"
                filter="drop-shadow(2px 0px 1px rgb(0 0 0 / 0.3))"
              ></polygon>
            </svg>
          </div>
          <!--Speaker code selection-->
          <div class="flex flex-col">
            <div class="relative m-2">
              <p class="text-gray-400 font-medium text-sm px-1">
                Sprechercode*
              </p>
              <div class="flex items-center">
                <input
                  placeholder="Code"
                  :type="!this.showPassword ? 'password' : 'text'"
                  class="w-48 rounded-xl text-base border border-6 border-slate-400 hover:border-blue-400 block px-3 xl:py-2 md:py-1 bg-white placeholder-gray-400 focus:placeholder-gray-300 focus:bg-white focus:border-gray-600 focus:outline-none"
                  @input="updateSpeaker($event.target)"
                  :value="speakerName"
                  @focus="this.showSpeakerCodeInfo = true"
                  @blur="this.showSpeakerCodeInfo = false"
                />
                <Icon
                  v-if="!this.showPassword"
                  iconName="eye"
                  class="-ml-8 bg-white px-1 hover:px-0.5"
                  @click="this.showPassword = true"
                ></Icon>
                <Icon
                  v-else
                  iconName="closedEye"
                  class="-ml-8 bg-white px-1 hover:px-0.5"
                  @click="this.showPassword = false"
                ></Icon>
              </div>
            </div>

            <!--Role selection-->
            <Dropdown
              class="ml-3 w-full"
              labelPlace="top"
              label="Rolle"
              :list="this.getRoles"
              @update="updateRole"
              :selected="this.selectedRole"
              ><p class="text-sm text-gray-400 font-medium">Rolle</p>
            </Dropdown>
          </div>
          <!--Student selection-->

          <CheckboxOption
            @new-input="(e) => this.updateStudent(e)"
            class="ml-1 w-fit whitespace-nowrap mt-2"
            :value="student"
            :modelValue="student"
            label="Studierende Person"
          ></CheckboxOption>
        </div>
        <span class="self-start ml-5"> <slot /> </span>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "../../components/interface-components/Icon.vue";
// import Combobox from "../form-components/Combobox.vue";
import Dropdown from "../form-components/Dropdown.vue";
import { mapState, mapGetters } from "vuex";
// import InputField from "../form-components/InputField.vue";
import CheckboxOption from "../form-components/CheckboxOption.vue";

export default {
  components: {
    Icon,
    Dropdown,
    // Combobox,
    // InputField,
    CheckboxOption,
  },
  props: {
    speakerID: String,
    mikroNumber: String,
    mikroColor: String,
    selectedRole: String,
    speakerName: String,
    student: Boolean,
  },
  data() {
    return {
      showSpeakerCodeInfo: false,
      speaker: "",
      selected: "",
      roles: "",
      showPassword: false,
    };
  },
  methods: {
    /**
     * Updates the role of the speaker in the store.
     *
     * @param {type} target - The target object containing the new role value
     * @return {type} description of return value
     */
    updateRole(target) {
      this.selected = target.value;
      // console.log(this.speakerID);
      this.$store.commit("setSpeakerRole", {
        id: this.speakerID,
        value: target.value,
      });
    },
    /**
     * Updates the speaker information based on the target value.
     *
     * @param {type} target - The target value to update the speaker information.
     */
    updateSpeaker(target) {
      this.speaker = target.value;
      this.$store.commit("setSpeakerName", {
        id: this.speakerID,
        value: target.value,
      });
      if (this.speakerID == this.getCurrentRecord.speaker1.id)
        this.$store.commit("setCurrentRecord", {
          speaker1: { name: target.value },
        });
      if (this.speakerID == this.getCurrentRecord.speaker2.id)
        this.$store.commit("setCurrentRecord", {
          speaker2: { name: target.value },
        });
    },
    /**
     * Updates the student information in the store based on the target value.
     *
     * @param {Object} target - The target object containing the new student value.
     */
    updateStudent(target) {
      this.$store.commit("setStudent", {
        id: this.speakerID,
        value: target,
      });
      if (this.speakerID == this.getCurrentRecord.speaker1.id)
        this.$store.commit("setCurrentRecord", {
          speaker1: { student: target.value },
        });
      if (this.speakerID == this.getCurrentRecord.speaker2.id)
        this.$store.commit("setCurrentRecord", {
          speaker2: { student: target.value },
        });
    },
    /**
     * (Unused) Updates the data usage information in the store based on the target value.
     *
     * @param {type} target - The target object containing the new data usage value.
     * @return {type} description of return value
     */
    updateDataUsage(target) {
      this.speaker = target.value;
      this.$store.commit("setDataUsage", {
        id: this.speakerID,
        value: target.value,
      });
    },
    /**
     * (Unused) A description of the entire function.
     *
     * @param {type} target - description of parameter
     * @return {type} description of return value
     */
    updateParameters(target) {
      this.speaker = target.value;
      this.$store.commit("setFeedbackConfig", {
        id: this.speakerID,
        value: target.value,
      });
    },
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getSpeakerRoles: "getSpeakerRoles",
      getSpeakers: "getSpeakers",
      getRoles: "getRoles",
      getCurrentRecord: "getCurrentRecord",
    }),
  },
  mounted() {
    this.roles = this.getRoles;
    if (this.speakerID[2] == "1") {
      this.selected = this.getCurrentRecord.speaker1.role
        ? this.getCurrentRecord.speaker1.role
        : "";

      if (this.selected == "") this.selected = "Rolle wählen";
    } else if (this.speakerID[2] == "2") {
      this.selected = this.getCurrentRecord.speaker1.role
        ? this.getCurrentRecord.speaker2.role
        : "";
      if (this.selected == "") this.selected = "Rolle wählen";
    }
  },
};
</script>
