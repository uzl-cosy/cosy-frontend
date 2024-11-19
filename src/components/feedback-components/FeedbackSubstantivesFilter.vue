<template>
  <div>
    <div class="flex ml-2 mt-0 gap-1">
      <div
        v-for="option in options"
        :key="option.label"
        @click="toggleOption(option)"
        class="cursor-pointer px-2 py-1 m-1 flex items-center justify-center rounded-md text-sm font-medium sm:flex-1"
        :class="{
          'bg-green-700/50 border-2 border-green-700 text-white hover:bg-green-700/80':
            isSelected(option.value) && option.value === 1, // Grün für gewünscht
          'bg-orange/50 border-2 border-orange text-white hover:bg-orange/80':
            isSelected(option.value) && option.value === 2, // Orange für unerwünscht
          'bg-blue-600 text-white hover:bg-blue-500':
            isSelected(option.value) && option.value === 0, // Standardfarbe für alle
          'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50':
            !isSelected(option.value), // Standardfarbe, wenn nicht ausgewählt
        }"
      >
        <span>{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  options: Array,
  preselected: Array,
  label: String,
});

const emit = defineEmits(["filterOption"]);
const selectedOptions = ref(props.preselected || []);

const toggleOption = (option) => {
  if (option.value === 0) {
    // Wenn "Alle" ausgewählt ist, alle anderen Optionen deaktivieren
    selectedOptions.value = selectedOptions.value.includes(0) ? [] : [0];
  } else {
    // Wenn eine andere Option gewählt ist, "Alle" deaktivieren
    selectedOptions.value = selectedOptions.value.filter(
      (value) => value !== 0
    );

    if (selectedOptions.value.includes(option.value)) {
      // Entferne Option, wenn sie bereits aktiv ist
      selectedOptions.value = selectedOptions.value.filter(
        (value) => value !== option.value
      );
    } else {
      // Füge Option hinzu
      selectedOptions.value.push(option.value);
    }
  }

  if (selectedOptions.value.length === 0) {
    // Wenn nichts ausgewählt ist, wähle "Alle"
    selectedOptions.value = [0];
  }

  emit("filterOption", { selected: selectedOptions.value, label: props.label });
};

const isSelected = (value) => selectedOptions.value.includes(value);
</script>
