<!--(UNUSED) CodeGenerator.vue is a component used to generate and show a QR code -->
<template>
  <div class="flex flex-col items-center my-3 p-1 mx-4 border-2 rounded-lg">
    <div class="pb-2 flex flex-col items-center px-5">
      <span class="text-sm text-slate-600 font-semibold p-2">{{ label }}</span>
      <qrcode-vue :value="value" :level="level" :render-as="renderAs" />
    </div>
    <div
      class="text-sky-500 px-4 py-2 mt-2 whitespace-nowrap rounded-b-lg bg-sky-200/10"
    >
      Code:
      <span class="font-extrabold md:text-xl tracking-wider">{{ code }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from "vue";
import QrcodeVue, { Level, RenderAs } from "qrcode.vue";

export default {
  components: {
    QrcodeVue,
  },
  props: {
    // codeValue: String,
    code: String,
    label: String,
  },
  data() {
    return {
      value: ref(this.code),
      level: ref<Level>("M"),
      renderAs: ref<RenderAs>("svg"),
    };
  },
};
</script>
