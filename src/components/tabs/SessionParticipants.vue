<!--(UNUSED) Tab Content Component: Session Participants contains the table of the participants of the session-->
<template>
  <!-- <SectionTitle size="">Teilnehmer*innen</SectionTitle> -->
  <TheComponentHeader class="ml-auto">Teilnehmer*innen</TheComponentHeader>

  <!-- <TableParticipants></TableParticipants> -->
</template>
<script>
import SectionTitle from "../interface-components/SectionTitle.vue";
import TheComponentHeader from "../interface-components/TheComponentHeader.vue";
import TableCourses from "../tables/TableCourses.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    TableCourses,
    SectionTitle,
    TheComponentHeader,
  },
  data() {
    return {
      isDropdownOpen: false,
      sortDirectionByName: 1, // 1 für aufsteigend, -1 für absteigend
      sortDirectionByAge: 1, // 1 für aufsteigend, -1 für absteigend

      filters: {
        name: "",
        age: "",
        gender: [],
        location: "",
      },
    };
  },

  methods: {
    /**
     * Toggles the dropdown visibility.
     *
     * @return {void} This function does not return anything.
     */
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    /**
     * Sorts the persons array by name in either ascending or descending order.
     *
     * @return {void} This function does not return anything.
     */
    sortActorsByName() {
      this.sortDirectionByName *= -1;
      this.sortDirectionByAge = 1;
      this.persons.sort(
        (a, b) => a.name.localeCompare(b.name) * this.sortDirectionByName
      );
    },
    /**
     * Sorts the persons array by age in either ascending or descending order.
     *
     * @return {void} This function does not return anything.
     */
    sortActorsByAge() {
      this.sortDirectionByAge *= -1;
      this.sortDirectionByName = 1;
      this.persons.sort((a, b) => (a.age - b.age) * this.sortDirectionByAge);
    },
  },
  computed: {
    ...mapGetters(["getParticipants"]),
    persons() {
      return this.getParticipants;
    },
  },
};
</script>
