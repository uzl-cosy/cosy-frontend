<!--Configuration Component: MultiStepsArrow.vue shows a  selected arrow-->

<template>
  <span class="arrow-selected flex">
    <div class="flex items-center text-gray-600 text-bold text-2xl py-2">
      <Icon
        class="w-7 mr-2"
        :iconName="icon"
        :size="size"
        color="white"
      /><slot />
    </div>
  </span>
</template>
<script>
import Icon from "../../components/interface-components/Icon.vue";

export default {
  components: {
    Icon,
  },
  props: {
    color: String,
    icon: String,
    size: {
      type: String,
      default: "32",
    },
  },
};
</script>

<style>
@media screen and (min-width: 1000px) {
  .arrow-selected {
    position: relative;
    background-color: rgba(0, 68, 114, 0.8);
    margin: 0 44px;
    height: 50px;
    padding: 0 8px;
  }
}

@media screen and (min-width: 1300px) {
  .arrow-selected {
    position: relative;
    background-color: rgba(0, 68, 114, 0.8);
    margin: 0 44px;
    height: 55px;
    padding: 0 8px;
  }
}

/* @media screen and (min-width: 1200px) and (max-width: 1600px) {
  .arrow-selected {
    position: relative;
    background-color: rgba(0, 68, 114, 0.8);
    margin: 0 44px;
    height: 70px;
    padding: 0 8px;
  }
} */

.arrow-selected::before {
  content: "";
  width: 32px;
  height: 100%;
  position: absolute;
  left: -32px;
  top: 0;
  background-image: url("../../assets/arrow_blue.svg");
  background-size: auto 100%;
}

.arrow-selected::after {
  content: "";
  width: 44px;
  height: 100%;
  position: absolute;
  right: -44px;
  top: 0;
  background-image: url("../../assets/arrow_blue.svg");
  background-size: auto 100%;
  background-position: 100% 0;
}
</style>
