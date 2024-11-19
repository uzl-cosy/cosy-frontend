<!--VIEW COMPONENT: SETTINGS (disabled)-->
<template>
  <div class="h-full overflow-y-auto">
    <div class="h-fit">
      <ThePageTitle>Einstellungen</ThePageTitle>
      <SectionTitle>Feedbackeinstellungen</SectionTitle>
      <div class="w-1/2">
        <ul class="flex flex-col mx-10 my-3">
          <li>
            <div class="px-3 py-2 flex items-center justify-between">
              <div>Filterung der Feedbackcards zulassen</div>
              <div><ToggleButton v-model="toggleValue"></ToggleButton></div>
            </div>
          </li>

          <li>
            <div class="px-3 py-2 flex items-center justify-between">
              <div>Feedback initial verstecken</div>
              <div><ToggleButton v-model="toggleValue"></ToggleButton></div>
            </div>
          </li>
        </ul>
      </div>

      <div class="w-full h-4 bg-red-700"></div>

      <Combobox :data="people"></Combobox>

      <SectionTitle>Mikrofoneinstellungen</SectionTitle>
      <ToggleButton v-model="toggleValue"></ToggleButton>
      <SectionTitle>Parameter</SectionTitle>
      <div>
        <SectionTitle>Icons</SectionTitle>
        <div class="grid grid-cols-8 space-y-3 justify-start items-start">
          <span
            v-for="(icon, key) in this.icons"
            :key="key"
            class="flex flex-col mx-2 justify-center items-center"
            >{{ key }}
            <Icon :iconName="key"></Icon>
          </span>
          <Icon :testIcons="true" @iconNames="(e) => (this.icons = e)"></Icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThePageTitle from "../components/interface-components/ThePageTitle.vue";
import SectionTitle from "../components/interface-components/SectionTitle.vue";
import Checkbox from "../components/form-components/TableCheckboxes.vue";
import Combobox from "../components/form-components/Combobox.vue";
import ToggleButton from "../components/form-components/ToggleButton.vue";
import Icon from "../components/interface-components/Icon.vue";

export default {
  components: {
    ThePageTitle,
    SectionTitle,
    Checkbox,
    Combobox,
    ToggleButton,
    Icon,
  },
  data() {
    return {
      icons: [],
      id: "String",
      title: "String",
      description: "String",
      checked1: "true",
      checked2: "false",

      toggleValue: "false",
    };
  },
  methods: {
    showWord(e) {
      console.log(e);
      let word = this.people.find((elem) => {
        this.people.name == e;
      });
      if (word) {
        this.currentWord = word;
      }
    },
  },
};
</script>
