<!--Form Component: Stepper.vue is a panel of steps that is displayed vertically-->
<template>
  <nav aria-label="Progress" class="w-full m-auto">
    <ol role="list" class="overflow-hidden pt-1 w-full pl-3">
      <li
        class="w-full relative"
        v-for="(step, stepIdx) in steps"
        :key="step.name"
        :class="[stepIdx !== steps.length - 1 ? 'mb-4' : '']"
      >
        <!--View button to toggle visibility of steps (if all steps are completed) -->
        <div
          class="group flex 2xl:mb-7 xl:mb-5 md:mb-3 items-center mt-3"
          v-if="stepIdx == 0 && step.status == 'complete' && this.showHidden"
          @click="toggleHidden"
          @mouseover="showEyeToolip = true"
          @mouseleave="showEyeToolip = false"
        >
          <Icon
            iconName="closedEye"
            :size="this.windowWidth > 1200 ? '32' : '24'"
            class="ml-4"
          ></Icon>

          <span v-if="showEyeToolip" class="text-secondary flex">
            <span class="ml-2">Erledigte Schritte ausblenden</span></span
          >
        </div>

        <!--Last hidden step-->
        <template
          v-if="
            step.status === 'hidden' && steps[stepIdx + 1].status !== 'hidden'
          "
        >
          <div
            class="group pt-3 cursor-pointer"
            @click="toggleHidden"
            @mouseover="this.showReveal = true"
            @mouseleave="this.showReveal = false"
          >
            <span class="flex flex-row h-fit items-center goup">
              <span
                class="group-hover:opacity-0 opacity-1 relative z-10 left-5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 group-hover:bg-sky-600"
              ></span>

              <div
                v-if="stepIdx !== steps.length - 1"
                class="absolute left-7 top-8 -ml-2px mt-0.5 h-11 w-0 outline-dashed outline-1 outline-white group-hover:bg-sky-600"
                aria-hidden="true"
              />
              <span
                v-if="showReveal"
                class="left-4 flex flex-row min-w-0 absolute text-secondary"
              >
                <Icon
                  iconName="eye"
                  size="24"
                  class="mr-2"
                  color="darkblue"
                ></Icon>

                <span>Erledigte Schritte einblenden</span>
              </span>
            </span>
          </div>
        </template>

        <!--Completed step-->
        <template v-else-if="step.status === 'complete'">
          <div
            v-if="stepIdx !== steps.length - 1"
            class="absolute left-7 top-4 -ml-2px mt-0.5 h-full w-0.5 bg-sky-600"
            :class="{ 'mt-12': stepIdx == 0 && showHidden }"
            aria-hidden="true"
          />
          <a
            :href="step.href"
            class="group relative flex items-center"
            @click="this.$emit('setCurrentStep', stepIdx)"
          >
            <Icon
              class="absolute z-20 self-start"
              color="blue"
              :size="this.windowWidth > 1200 ? '20' : '16'"
              style="margin-left: -10px"
              v-if="step.completed"
              iconName="check"
            ></Icon>

            <span class="flex xl:h-12 items-center">
              <span
                class="relative z-10 left-1.5 flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 group-hover:bg-sky-800"
              >
                <Icon
                  :iconName="step.icon"
                  color="darkblue"
                  :size="this.windowWidth > 1200 ? '28' : '20'"
                ></Icon>
              </span>
            </span>
            <span class="ml-4 flex min-w-0 flex-col justify-center">
              <span class="text-base font-bold text-sky-600">{{
                step.name
              }}</span>
            </span>
          </a>
        </template>

        <!--Current step-->
        <template
          v-else-if="step.status === 'current'"
          condition="step.status === 'current'"
          class="w-full"
        >
          <div
            v-if="stepIdx !== steps.length - 1"
            class="absolute left-7 top-7 -ml-px mt-1 h-full w-0.5 bg-gray-300"
            aria-hidden="true"
          />
          <Icon v-if="step.completed" iconName="check" class="-ml-3"></Icon>

          <a
            class="group relative flex items-start w-1/2 -mt-4"
            aria-current="step"
          >
            <span
              class="flex md:h-8 xl:h-12 items-center xl:-ml-2 md:-ml-1"
              aria-hidden="true"
            >
              <span
                class="relative z-10 flex md:h-12 md:w-12 xl:h-14 xl:w-14 md:ml-2 items-center justify-center rounded-full border-2 border-sky-600 bg-sky-100"
                :class="{ 'xl:mt-8 md:mt-3': stepIdx > 2 }"
              >
                <!-- <span class="h-2.5 w-2.5 rounded-full bg-sky-600" /> -->
                <Icon
                  :iconName="step.icon"
                  :size="this.windowWidth > 1200 ? '36' : '24'"
                  color="darkblue"
                ></Icon>
              </span>
            </span>
            <div
              class="border-2 border-blue-100 ml-6 p-4 rounded-lg w-auto h-full bg-white"
            >
              <span class="ml-4 flex flex-col">
                <span
                  class="2xl:text-xl xl:text-base font-medium text-sky-600 mb-4 2xl:mt-2"
                  >{{ step.name }}</span
                >
                <span class="text-base text-gray-500">{{
                  step.description
                }}</span>
                <div class="h-full 2xl:w-auto md:w-fit"><slot /></div>
              </span>
            </div>
          </a>
        </template>

        <!--Upcoming step-->
        <template v-else-if="step.status === 'upcoming'">
          <div
            v-if="stepIdx !== steps.length - 1"
            class="absolute left-7 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
            aria-hidden="true"
          />
          <a
            :href="step.href"
            class="group relative flex items-start"
            @click="
              this.$emit('setCurrentStep', stepIdx);
              this.resetStates();
            "
          >
            <span class="flex h-9 items-center" aria-hidden="true">
              <span
                class="left-3 relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-sky-100 group-hover:border-gray-400 group-hover:bg-sky-300"
              >
                <Icon :iconName="step.icon" size="20" color="darkblue"></Icon>
              </span>
            </span>
            <span class="ml-6 flex min-w-0 flex-col">
              <span class="2xl:text-base xl:text-xs font-bold text-slate-600">{{
                step.name
              }}</span>
              <span class="text-base text-gray-500">{{
                step.description
              }}</span>
            </span>
          </a>
        </template>

        <!--Disabled step-->
        <template v-else-if="step.status === 'disabled'">
          <div
            v-if="stepIdx !== steps.length - 1"
            class="absolute left-7 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300 opacity-45"
            aria-hidden="true"
          />
          <a :href="step.href" class="group relative flex items-start">
            <span class="flex h-9 items-center" aria-hidden="true">
              <span
                class="left-3 relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-sky-100 opacity-45"
              >
                <Icon :iconName="step.icon" size="20" color="darkblue"></Icon>
              </span>
            </span>
            <span class="ml-6 flex min-w-0 flex-col">
              <span
                class="2xl:text-base xl:text-xs font-bold text-slate-600 opacity-45"
                >{{ step.name }}</span
              >
              <span class="text-base text-gray-500">{{
                step.description
              }}</span>
            </span>
          </a></template
        >

        <!--Hidden step-->
        <template v-else-if="step.status === 'hidden'"></template>
      </li>
    </ol>
  </nav>
</template>

<script>
import SmallButton from "../interface-components/SmallButton.vue";
import Icon from "../interface-components/Icon.vue";
export default {
  components: { Icon, SmallButton },
  props: {
    steps: Array,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      showEyeToolip: false,
      showReveal: false,
      showHidden: false,
    };
  },
  methods: {
/**
 * Toggles the visibility of hidden steps and resets the states.
 *
 * @return {void}
 */
    toggleHidden() {
      this.showHidden = !this.showHidden;
      this.resetStates();
    },
/**
 * Resets the states of the steps based on the current state.
 *
 * @return {void}
 */
    resetStates() {
      for (let i = 0; i < this.steps.length; i++) {
        if (this.showHidden) {
          if (this.steps[i].status == "hidden")
            this.steps[i].status = "complete";
        } else if (this.steps[i].status == "complete") {
          if (this.steps[i].status == "current") {
            this.steps[i - 1].status = "complete";
            return;
          } else this.steps[i].status = "hidden";
        }
      }
    },
  },
  computed: {
/**
 * Checks if the current device is a mobile device.
 *
 * @return {boolean} Returns true if the device is a mobile device, false otherwise.
 */
    mobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  },
};
</script>
