<!--Form Component: TextFieldWords.vue is a textfield that is filled with chips representing keywords-->
<template>
  <div
    class="flex flex-row justify-between w-max xl:px-4 xl:py-5 items-center my-2"
  >
    <div class="flex flex-col w-60 pr-3">
      <div class="text-slate-500 font-bold whitespace-nowrap mb-0.5 h-8">
        Soll genannt werden
      </div>
      <div
        v-if="!isFocused1"
        @click="forceFocusTextarea1"
        class="flex border-2 rounded-md w-60 h-52 border-gray-300 overflow-auto bg-white"
      >
        <div v-if="this.wordsToSay.length > 0">
          <div
            v-for="(word, index) in wordsToSay"
            :key="index"
            class="word-item bg-blue-500/20 text-blue-500 m-2 p-1 rounded-md font-bold"
          >
            {{ word }}
          </div>
        </div>
      </div>

      <textarea
        v-else
        ref="textarea1"
        v-model="inputText1"
        @focus="isFocused1 = true"
        @blur="handleBlur1()"
        class="w-60 h-52 border-2 border-blue-500 outline-none resize-none rounded-md text-blue-500 bg-white"
      >
      </textarea>
      <div v-if="isFocused1" class="self-end">
        <Icon
          class="ml-2 w-8 h-8 -mt-9 hover:bg-blue-400/20 rounded-full p-0.5"
          color="rgb(96 165 250)"
          iconName="check"
        ></Icon>
      </div>
    </div>

    <!-- safe words not to say -->

    <div class="flex flex-col w-60 pl-3 mr-7">
      <div class="text-slate-500 font-bold whitespace-nowrap mb-0.5 h-8">
        Sollte nicht genannt werden
      </div>

      <div
        v-if="!isFocused2"
        @click="forceFocusTextarea2"
        @blur="handleBlur2"
        class="border-2 rounded-md w-60 h-52 border-gray-300 overflow-auto outline-none bg-white"
      >
        <div v-if="wordsNotToSay.length > 0">
          <div
            v-for="(word, index) in wordsNotToSay"
            :key="index"
            class="word-item bg-pink-600/20 text-pink-600 m-2 p-1 rounded-md font-bold"
          >
            {{ word }}
          </div>
        </div>
      </div>
      <textarea
        v-else
        ref="textarea2"
        v-model="inputText2"
        @focus="isFocused2 = true"
        @blur="handleBlur2"
        class="w-60 h-52 resize-none rounded-md border-pink-600 outline-none focus:outline-none text-pink-600 bg-white"
      >
      </textarea>
      <div v-if="isFocused2" class="self-end">
        <Icon
          class="ml-2 w-8 h-8 -mt-9 hover:bg-pink-400/20 rounded-full p-0.5"
          color="rgb(219 39 119)"
          iconName="check"
        ></Icon>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Icon from "../../components/interface-components/Icon.vue";
export default {
  components: {
    Icon,
  },
  data() {
    return {
      inputText1: "",
      inputText2: "",
      wordsToSay: [],
      wordsNotToSay: [],
      isFocused1: false,
      isFocused2: false,
    };
  },
  props: {
    caseWords: { type: Array, default: null },
    caseNotWords: { type: Array, default: null },
    changeWordsToSay: Function,
    changeWordsNotToSay: Function,
  },
  methods: {
    /**
     * A function that handles the blur event for inputText1.
     *
     * @return {void} No return value
     */
    handleBlur1() {
      this.wordsToSay = this.inputText1
        .trim()
        .toLowerCase()
        .replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()\d]/g, "")
        .split(/\s+/);
      this.wordsToSay = this.wordsToSay.filter((item) => item.value !== "");
      this.isFocused1 = false;
      // safe words in store
      this.$store.commit("setCaseWords", {
        wordsToSay: this.wordsToSay,
      });
      // this.changeWordsToSay();

      this.$store.commit("setSubstantives", { wordsToSay: this.wordsToSay });
    },
    /**
     * Handles the blur event for inputText2.
     *
     * @return {void}
     */
    handleBlur2() {
      this.wordsNotToSay = this.inputText2
        .trim()
        .toLowerCase()
        .replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()\d]/g, "")
        .split(/\s+/);
      this.wordsNotToSay = this.wordsNotToSay.filter(
        (item) => item.value !== ""
      );
      this.isFocused2 = false;

      this.$store.commit("setCaseWords", {
        wordsNotToSay: this.wordsNotToSay,
      });

      this.$store.commit("setSubstantives", {
        wordsNotToSay: this.wordsNotToSay,
      });
    },

    /**
     * Sets the focus on textarea2 immediately and ensures that it is focused after the next DOM update.
     *
     * @return {void}
     */
    forceFocusTextarea2() {
      this.isFocused2 = true;
      this.$nextTick(() => {
        this.$refs.textarea2.focus();
      });
    },
    /**
     * Sets the focus on textarea1 immediately and ensures that it is focused after the next DOM update.
     *
     * @return {void}
     */
    forceFocusTextarea1() {
      this.isFocused1 = true;
      this.$nextTick(() => {
        this.$refs.textarea1.focus();
      });
    },
  },
  mounted() {
    if (this.isFocused2) {
      this.$refs.textarea2.focus();
    }

    if (this.caseWords || this.caseNotWords) {
      this.wordsNotToSay = this.caseNotWords;

      this.wordsToSay = this.caseWords;
    } else {
      this.wordsToSay = this.getSubstantives.wordsToSay;
      this.wordsNotToSay = this.getSubstantives.wordsNotToSay;
    }

    this.inputText1 = this.wordsToSay.join(" ");
    this.inputText2 = this.wordsNotToSay.join(" ");
  },

  computed: {
    ...mapGetters({
      setSubstantives: "setSubstantives",
      getSubstantives: "getSubstantives",
      getWords: "getWords",
      getTranscript: "getTranscript",
    }),
  },
};
</script>

<style>
textarea:focus:not(:focus-visible) {
  outline: none;
}

.word-item {
  margin: 5px;
  padding: 5px;
  display: inline-block;
}
</style>
