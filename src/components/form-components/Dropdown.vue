<!--Form Component: Dropdown.vue is a selectable dropdown list that is toggled via click.-->
<template>
  <div
    class="w-full"
    :class="{
      'flex items-center mx-2 justify-between text-slate-600 ':
        labelPlace == 'left',
    }"
  >
    <!--Label-->
    <span class="flex justify-start font-bold text-base w-full"> <slot /></span>
    <div class="flex items-center w-auto">
      <div class="relative w-full">
        <!--Dropdown element-->
        <button
          class="px-6 ml-1 border-slate-400 self-center w-auto whitespace-nowrap"
          :class="{
            'bg-pink-800 text-white': this.selectedColor == 'red',
            'bg-lime-500 text-white': this.selectedColor == 'green',
            'bg-indigo-600 text-white': this.selectedColor == 'blue',
            'bg-ocean-dark text-white': this.active,
            'hover:cursor-default': disabled,
          }"
          @click.prevent="toggleDropdown"
        >
          <div class="flex items-center justify-between pointer-events-none">
            <span> {{ selected }} </span>
            <Icon
              v-if="active && !this.disabled"
              class="ml-3"
              iconName="chevronLeft"
              size="20"
              color="darkgray"
              style="margin-right: -12px"
            ></Icon>
            <Icon
              v-else-if="!this.disabled"
              class="ml-3"
              iconName="chevronDown"
              size="20"
              color="darkgray"
              style="margin-right: -12px"
            ></Icon>
          </div>
        </button>
        <!--Dropdown list-->
        <ul
          class="z-20 absolute inset-x-0 top-11 left-1 drop-shadow-md w-min pr-2"
          v-show="this.active"
        >
          <li>
            <span v-for="(val, index) in list" :key="index" class="w-full flex">
              <svg
                v-if="val.color"
                class="relative z-2 pointer-events-none"
                width="40px"
                height="40px"
                viewbox="0 0 20 0"
                style="margin-right: -32px"
              >
                <circle cx="15" cy="20" r="4" :fill="val.color" />
              </svg>
              <input
                :id="'opti' + index"
                :name="val.name"
                type="button"
                class="w-full py-2 px-7 border bg-white hover:border-blue-400 text-base hover:font-bold"
                :class="{
                  'rounded-none rounded-t-md border-t-slate-600 border-l-slate-600 border-r-slate-600':
                    index == 0, //first list item
                  'rounded-none border-l-slate-600 border-r-slate-600':
                    index > 0 && index < list.length - 1, // middle list items
                  'rounded-none rounded-b-xl border-b-slate-600 border-l-slate-600 border-r-slate-600':
                    index == list.length - 1, // last list item
                  'hover:cursor-pointer': !disabled,
                }"
                :value="val.name"
                @click="update($event.target)"
              />
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Icon from "../../components/interface-components/Icon.vue";
export default {
  components: {
    Icon,
  },
  data() {
    return {
      hover: false,
      active: false,
    };
  },
  props: {
    disabled: { type: Boolean, default: false },
    labelPlace: { type: String, default: "top" },
    iconName: String,
    list: Array,
    selected: String,
    selectedColor: String,
  },
  methods: {
    /**
     * Toggles the dropdown menu if the component is not disabled.
     *
     */
    toggleDropdown() {
      if (!this.disabled) this.active = !this.active;
    },
    /**
     * Closes the dropdown if the event target is not inside the dropdown component.
     *
     * @param {Event} e - The event object.
     * @return {void} This function does not return anything.
     */
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.active = false;
      }
    },
    /**
     * Updates the target and emits an update event.
     *
     * @param {any} target - The target to be updated.
     * @return {void} This function does not return anything.
     */
    update(target) {
      this.toggleDropdown();
      this.$emit("update", target);
    },
    /**
     * Finds an item in the list based on the provided name.
     *
     * @param {string} name - The name of the item to search for.
     * @return {Object|undefined} The found item or undefined if not found.
     */
    findItem(name) {
      return this.list.find((item) => {
        return item.name == name;
      });
    },
  },
  mounted() {
    document.addEventListener("click", this.close);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.close);
  },
  computed: {
    ...mapState(["currentSession"]),
    ...mapGetters({
      getSpeakers: "getSpeakers",
      getBaseConfig: "getBaseConfig",
      getCurrentSession: "getCurrentSession",
    }),
  },
};
</script>
