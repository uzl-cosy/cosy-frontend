<!--Configuration Component: MultiStepsArrow.vue shows an unselected arrow-->
<template>
  <span class="arrow-link flex">
    <div
      class="hover:cursor-pointer flex items-center text-gray-600 text-bold text-lg min-w-max"
    >
      <Icon
        class="md:w-5 xl:w-7 2xl:w-12 mr-2 2xl:px-2"
        :iconName="icon"
        :size="size"
        :viewbox="viewbox"
        color="gray"
      /><slot />
    </div>
  </span>
</template>
<script>
import Icon from "../../components/interface-components/Icon.vue";

export default {
  name: "MultiStepsArrow",
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
    viewbox: {
      type: String,
      default: "0 0 24 24",
    },
  },
};
</script>

<style>
@media screen and (min-width: 1300px) {
  .arrow-link {
    position: relative;
    background-color: rgba(0, 69, 114, 0.31);
    margin: 0 32px;
    height: 54px;
    text-align: center;
  }
}
@media screen and (min-width: 1000px) {
  .arrow-link {
    position: relative;
    background-color: rgba(0, 69, 114, 0.31);
    margin: 0 32px;
    height: 40px;
    text-align: center;
  }
}

.arrow-link::before {
  content: "";
  width: 28px;
  height: 100%;
  position: absolute;
  left: -28px;
  top: 0;
  background-image: url("../../assets/Arrow.svg");
  background-size: auto 100%;
}

.arrow-link::after {
  content: "";
  width: 32px;
  height: 100%;
  position: absolute;
  right: -32px;
  top: 0;
  background-image: url("../../assets/Arrow.svg");
  background-size: auto 100%;
  background-position: 100% 0;
}
</style>
