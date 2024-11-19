<!--Form Component: InputField.vue is a text input field with a label.-->
<template>
  <div class="flex w-auto flex-col justify-center items-start my-2">
    <label
      class="font-bold 2xl:text-base md:text-sm mr-3 w-full mx-1 text-slate-500"
      for="name"
      :class="{ 'text-slate-200': disabled }"
      ><slot
    /></label>

    <input
      type="text"
      :disabled="disabled"
      autofocus="required"
      :name="name"
      :id="id"
      :placeholder="placeholder"
      :value="model"
      class="w-full 2xl:text-xl md:text-sm 2xl:p-2 md:p-1 rounded-lg my-1 focus:border-primary border-1 border-slate-300"
      :class="{ 'bg-slate-50 border-slate-100 ': disabled, empty: isEmpty }"
    />
  </div>
</template>

<script>
export default {
  name: "Form",
  props: {
    model: String,
    type: String,
    name: String,
    number: String,
    label: String,
    id: String,
    placeholder: String,
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isEmpty() {
      return this.required && this.model.length === 0;
    },
  },
};
</script>
<style>
.field {
  border-color: black;
}

.empty {
  border: solid 3px lightsalmon;
}
</style>
