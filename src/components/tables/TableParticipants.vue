<!--(UNUSED) Table Component: Lists all available participants-->
<template>
  <div class="relative overflow-x-auto">
    <table class="table-auto w-full">
      <thead class="w-full">
        <tr class="text-left border-b-2 border-slate-600">
          <th class="p-4 w-auto" @click="sortActorsByName">
            Name
            <span v-if="sortDirection === 1" class="ml-1 text-lg text-gray-500"
              >↑</span
            >
            <span v-else class="ml-1 text-lg text-gray-500">↓</span>
          </th>

          <th class="p-4 w-auto">Geschlecht</th>
          <!-- <th class="p-4">Alter</th> -->
          <th class="p-4 w-auto" @click="sortActorsByAge">
            Alter
            <span
              v-if="sortDirectionByAge === 1"
              class="ml-1 text-lg text-gray-500"
              >↑</span
            >
            <span v-else class="ml-1 text-lg text-gray-500">↓</span>
          </th>
          <th class="p-4 w-auto">Ort</th>
        </tr>
      </thead>

      <tbody class="w-full">
        <!-- index % 2: 0 = gerade, 1 = ungerade -->
        <tr
          class="w-full"
          v-for="(person, index) in persons"
          :key="persons.id"
          :class="{
            'bg-white': index % 2 === 0,
            'bg-gray-200': index % 2 === 1,
          }"
        >
          <router-link :to="`/${person.name.toLowerCase().replace(' ', '')}`">
            <td class="p-4 items-center">
              <!-- <img
                :src="person.imageUrl"
                alt="Profilbild"
                class="h-9 w-9 rounded-full overflow-hidden"
              /> -->
            </td>
            <td class="p-4">{{ person.name }}</td>
          </router-link>
          <td class="p-4">{{ person.gender }}</td>

          <td class="p-4">{{ person.age }}</td>
          <td class="p-4">{{ person.location }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import TableCourses from "../tables/TableCourses.vue";
import { mapGetters } from "vuex";
export default {
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
     * Toggles the dropdown open/close state.
     *
     * @return {void}
     */
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    /**
     * Sorts the list of actors by name.
     *
     * @return {void} This function does not return a value.
     */
    sortActorsByName() {
      this.sortDirectionByName *= -1;
      this.sortDirectionByAge = 1; // Zurücksetzen der Sortierrichtung für Alter
      this.persons.sort(
        (a, b) => a.name.localeCompare(b.name) * this.sortDirectionByName
      );
    },
    /**
     * Sorts the list of actors by age.
     *
     *
     * @return {void} This function does not return a value.
     */
    sortActorsByAge() {
      this.sortDirectionByAge *= -1;
      this.sortDirectionByName = 1; // Zurücksetzen der Sortierrichtung für Namen
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
