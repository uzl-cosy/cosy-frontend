<!-- (UNUSED) Configuration Component: RecordModal.vue shows a modal of the configuration for recording -->
<template>
  <span class="text-2xl px-4 py-2 flow-root w-full items-center mb-3"
    >Geben Sie die <span class="font-bold">Grunddaten</span> ein.</span
  >
  <div class="w-full items-center my-5 p-14">
    <InputField> Modulname</InputField>
    <InputField> Kursname</InputField>
    <InputField> Seminarthema</InputField>
    <InputField> Seminarturnus</InputField>
  </div>
</template>
<script>
import InputField from "../form-components/InputField.vue";

export default {
  name: "RecordModal",
  components: {
    InputField,
  },
  data() {
    return { room: "" };
  },
  methods: {
    // addRoom(newRoom) {
    //   this.$store.commit("setCurrentRoom", [
    //     { id: "3", name: "yipiee", data: "hi" },
    //   ]);
    // },
  },
  computed: {
    rooms() {
      return this.$store.getters.getAllRooms;
    },
    room() {
      return this.$store.getters.getCurrentRoom;
    },
  },
  mounted() {
    this.room = this.$store.getters.getCurrentRoom;
  },
};
</script>
