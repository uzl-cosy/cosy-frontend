<template>
  <div class="text-right">
    <!-- <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton
          ><v-icon class="h-5 w-5" name="bi-sliders" />
          Filter
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 "
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 "
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute top-0 right-0 mr-7 w-96 z-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="px-4 py-4 space-y-4">
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-primary text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-md',
                ]"
              >
                <div class="mb-2 space-y-4">
                  <h2>Geschlecht</h2>
                  <div class="flex space-x-4">
                    <div
                      :class="[
                        'bg-gray-200',
                        { 'bg-primary text-white': selectedGender === 'w' },
                      ]"
                      @click="toggleGender = 'w'"
                      class="px-4 py-2 rounded-md cursor-pointer"
                    >
                      Weiblich
                    </div>
                    <div
                      :class="[
                        'bg-gray-200',
                        { 'bg-primary text-white': selectedGender === 'm' },
                      ]"
                      @click="toggleGender = 'm'"
                      class="px-4 py-2 rounded-md cursor-pointer"
                    >
                      Männlich
                    </div>
                  </div>
                </div>
              </button>
            </MenuItem>

            

            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-primary text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-md',
                ]"
              >
                <div class="mb-2 space-y-4">
                  <h2>Alter</h2>
                  <div class="flex flex-wrap">
                    <div
                      v-for="(ageRange, index) in ageRanges"
                      :key="index"
                      :class="[
                        'bg-gray-200 mb-2 mr-2',
                        { 'bg-primary text-white': selectedAge === ageRange },
                      ]"
                      @click="selectedAge = ageRange"
                      class="px-4 py-2 rounded-md cursor-pointer"
                    >
                      {{ ageRange }}
                    </div>
                  </div>
                </div>
              </button>
            </MenuItem>

            

            <div class="flex justify-between space-x-4">
              <button
                @click="resetFilters"
                class="bg-gray-200 px-4 py-2 rounded-md"
              >
                Filter löschen
              </button>
              <button
                @click="applyFilters"
                class="bg-primary text-white px-4 py-2 rounded-md"
              >
                Filter anwenden
              </button>
            </div>
          </div>
        </MenuItems>
      </transition>
    </Menu> -->
  </div>
</template>

<script setup>
//import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ref } from "vue";

const selectedGender = ref("");
const selectedAge = ref([]);
const ageRanges = ref(["18-30", "31-45", "46-60", "61+"]);
const experiences = ref([
  "Demenz",
  "Angehörige",
  "Interprofessionell",
  "Tod & Sterben",
  "Schwangerschaft",
  "Jugend",
]);
const isFilterOpen = ref(false);

const getSelectedFilters = () => {
  return {
    gender: selectedGender.value,
    age: selectedAge.value,
  };
};

const resetFilters = () => {
  selectedGender.value = "";
  selectedAge.value = [];
};

const applyFilters = () => {
  // console.log(getSelectedFilters());
  isFilterOpen.value = false;
};

function togglegender(gender) {
  if (selectedGender.value.includes(gender)) {
    selectedGender.value = selectedGender.value.filter(
      (item) => item !== gender
    );
  }
}
</script>

//
<!-- <template>
  
  // <button
  //       type="button"
  //       @click="togglePopup"
  //       class="flex justify-end items-center"
  //     >
  //       <v-icon name="bi-sliders" class="h-7 w-7 ml-2 text-primary" />
  //     </button>
  //     <div>
  //         <div v-if="showPopup" class="mt-4"></div>
  //        Geschlecht -->
//
<!-- <div>
  //         <h2>Geschlecht</h2>
  //         <input type="radio" v-model="selectedGender" value="m"> Männlich
  //         <input type="radio" v-model="selectedGender" value="f"> Weiblich
  //       </div>
  //        -->
//
<!-- Alter -->
//
<!-- <div>
  //         <h2>Alter</h2>
  //         <input type="checkbox" v-for="ageRange in ageRanges" :key="ageRange" v-model="selectedAges" :value="ageRange">{{ ageRange }}
  //       </div> -->

//
<!-- Erfahrungsbereiche -->
//
<!-- <div>
  //         <h2>Erfahrungsbereiche</h2>
  //         <input type="checkbox" v-for="experience in experiences" :key="experience" v-model="selectedExperiences" :value="experience">{{ experience }}
  //       </div> -->

//
<!-- Buttons -->
//
<!-- <div>
  //         <button @click="resetFilters">Auswahl löschen</button>
  //         <button @click="applyFilters">Bestätigen</button>
  //       </div>
  //     </div>
  //   </template>
    
  //   <script>
  //   export default {
  //     data() {
  //       return {
  //         showPopup: false,
  //         selectedGender: '',
  //         selectedAges: [],
  //         ageRanges: ['18-30', '31-45', '46-60', '61+'],
  //         experiences: ['Demenz', 'Angehörige', 'Interprofessionell'] 
  //       };
  //     },
  //     methods: {
  //         togglePopup() {
  //             this.showPopup = !this.showPopup;
  //         },
  
  //       resetFilters() {
  //         this.selectedGender = '';
  //         this.selectedAges = [];
  //         this.selectedExperiences = [];
  //       },
  //       applyFilters() {
  //         // Call an API or update your actor list based on the selected filters
  //         // This is where you would update the actor list with the filtered results
  //       }
        
  //     }
      
  //   };
  //   </script> -->
