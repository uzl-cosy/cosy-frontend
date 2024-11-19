<template>
  <!-- Suche -->
  <div class="flex gap-5 h-auto items-center">
    <div class="flex">
      <input
        type="text"
        disabled
        placeholder="Bald verfügbar"
        class="w-full outline-none bg-white/40 text-black mx-2 rounded-lg xl:py-1 xl:h-9"
        v-model="searchQuery"
        @focus="clearPlaceholder"
      />
      <div class="flex justify-end items-center text-blue-60 opacity-70">
        <Icon iconName="search" color="#666666" size="24"></Icon>
      </div>
    </div>

    <!-- Profilicon -->
    <router-link
      to="/teacher-profile"
      class="flex justify-center items-center opacity-30"
    >
      <div>
        <img
          src="..\assets\User2.svg"
          alt="Profilbild"
          class="2xl:h-14 2xl:w-14 xl:h-10 xl:w-10 md:h-9 md:w-9 rounded-full overflow-hidden bg-blue-900"
        />
      </div>
    </router-link>
  </div>
</template>
<script>
import Icon from "./interface-components/Icon.vue";
export default {
  name: "NavTeacher",
  components: { Icon },

  data() {
    return {
      searchQuery: "",
      placeholderText: "Suche",
    };
  },
  methods: {
    clearPlaceholder() {
      this.placeholderText = "";
    },
  },
};
</script>
