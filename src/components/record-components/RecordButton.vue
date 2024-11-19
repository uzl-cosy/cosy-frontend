<!--Configuration Component: RecordButton.vue lets the user start/stop recording-->
<template>
  <button
    class="ml-4 m-4 px-4 mx-4 py-5 rounded-2xl text-xl font-bold flex justify-evenly items-center xl:text-lg md:text-sm"
    :class="{
      'bg-ocean-dark text-white px-4 xl:py-5 md:py-2': preset == 'filled',
      'text-ocean-dark border-2 border-gray-100': preset == 'outlined',
      'turning-border':
        recordButtonState == 'recording' || recordButtonState == 'requestStop',
    }"
  >
    <slot />
  </button>
</template>
<script>
import Icon from "../interface-components/Icon.vue";

export default {
  components: {
    Icon,
  },
  props: {
    color: String,
    icon: String,
    preset: { type: String, default: "filled" },
    recordButtonState: { type: String },
  },
};
</script>

<style>
@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}

.turning-border {
  position: relative;
  z-index: 0;
  overflow: hidden;
}

.turning-border::before {
  content: "";
  position: absolute;
  z-index: -2;
  width: 200%;
  height: 370%;
  background-color: rgb(40, 96, 120);
  background-repeat: no-repeat;
  background-size: 50% 50%, 50% 50%;
  background-image: linear-gradient(
    rgb(255, 255, 255) 50%,
    rgb(255, 255, 255) 50%
  );
  animation: rotate 4s linear infinite;
}

.turning-border::after {
  content: "";
  position: absolute;
  z-index: -1;
  width: calc(100% - 7px);
  height: calc(100% - 7px);
  background: rgb(40, 96, 120);
  border-radius: 18px;
}
</style>
