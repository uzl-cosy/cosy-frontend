<!--(UNUSED) Configuration Component: MicroStatus.vue shows the Microphone status-->
<template>
  <div class="w-full flex py-2">
    <label
      for="number"
      class="rounded-xl self-center items-center tl-xl px-3 py-2 w-1/3 text-white text-center"
      :class="{
        'bg-pink-700': color == 'red',
        'bg-lime-500': color == 'green',
        'bg-indigo-500': color == 'blue',
        'bg-slate-400': color == 'gray',
      }"
      >{{ name }}</label
    >

    <svg
      width="50"
      height="43"
      viewBox="0 0 40 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="0" y1="20" x2="30" y2="20" stroke="#444444" />
      <circle cx="30" cy="20" r="6" fill="#444444" />
      <circle cx="30" cy="20" r="4" fill="red" />
    </svg>
    <label
      for="status"
      class="w-full rounded-xl text-gray px-2 flex justify-center items-center flex-nowrap"
      >Status:
      <div class="ml-1">
        <b class="mx-2 inline-flex leading-normal"> Kein Signal</b>
      </div></label
    >
  </div>
</template>
<script>
export default {
  props: {
    color: { type: String, default: "gray" },
    name: { type: String, default: "kein Name" },
    status: { type: String, default: "keine Daten" },
  },
};
</script>
