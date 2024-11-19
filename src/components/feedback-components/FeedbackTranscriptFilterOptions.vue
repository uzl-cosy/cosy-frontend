<!--Feedback Component: FeedbackTranscriptFilterOptions.vue contains -->
<template>
  <div>
    <RadioGroup v-model="pause" class="flex ml-2 mt-0">
      <RadioGroupLabel class="sr-only">Label</RadioGroupLabel>
      <div class="flex gap-1">
        <RadioGroupOption
          as="template"
          v-for="option in options"
          :key="option.label"
          :value="option"
          v-slot="{ active, checked }"
        >
          <div
            class="px-2 py-1 m-1 cursor-pointer"
            :class="[
              active ? 'ring-2 ring-blue-600 ring-offset-2' : '',
              checked
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50',
              'flex items-center justify-center rounded-md p-1 m-1 text-sm font-medium sm:flex-1',
            ]"
          >
            <RadioGroupLabel as="span" class="text-nowrap">
              {{ option.label }}</RadioGroupLabel
            >
          </div>
        </RadioGroupOption>
      </div>
    </RadioGroup>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";

const props = defineProps({
  options: Array,
  preselected: Number,
  label: String,
});

const pauseOptions = [
  { name: "Alle", value: 0 },
  { name: ">1Sek.", value: 1 },
  { name: ">2Sek.", value: 2 },
  { name: ">3Sek.", value: 3 },
];

const emit = defineEmits(["filterOption"]);

const pause = ref(props.options[props.preselected]);

watch(pause, (newValue) => {
  newValue = { newValue, label: props.label };
  emit("filterOption", newValue);
});
</script>
