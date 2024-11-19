<!--Form Component: Combobox.vue is an input field that also allows a dropdown list to be shown via click.-->
<template>
  <!-- Input Field -->
  <div class="flex items-center w-fit" ref="combobox">
    <span class="mr-3 flex justify-start font-bold text-base w-min">
      <slot
    /></span>
    <div class="relative w-full">
      <div class="flex items-center">
        <input
          class="px-6 ml-1 border-slate-200 self-center w-52 rounded-xl text-lg"
          type="text"
          :model="this.query"
          :value="
            this.selectedValue
              ? this.selectedValue
              : this.selected
              ? this.selected.name
              : this.query
          "
          :placeholder="placeholder"
          @input="updateList"
        />
        <div
          class="p-3 cursor-pointer"
          style="margin-left: -44px"
          @click="toggleDropdown"
        >
          <span v-if="showAll"><Icon iconName="chevronLeft"></Icon></span>
          <span v-else><Icon iconName="chevronDown"></Icon></span>
        </div>
        <ul
          class="z-20 absolute inset-x-0 top-11 drop-shadow-md w-min"
          v-if="showAll"
        >
          <li>
            <span v-for="(val, index) in filteredItems">
              <input
                :id="'opti' + index"
                :name="val.name"
                type="button"
                class="w-full rounded-sm mx-1 py-1 px-14 border bg-white hover:border-blue-400 hover:cursor-pointer text-base hover:font-bold"
                :value="val.name"
                @click="select"
            /></span>
          </li>
        </ul>
        <ul
          class="z-20 absolute inset-x-0 top-11 drop-shadow-md w-min"
          v-if="showAll"
        >
          <li>
            <span v-for="(val, index) in data">
              <input
                :id="'opti' + index"
                :name="val.name"
                type="button"
                class="w-full rounded-sm mx-1 py-1 px-14 border bg-white hover:border-blue-400 hover:cursor-pointer text-base hover:font-bold"
                :value="val.name"
                @click="select"
            /></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Icon from "../interface-components/Icon.vue";

export default {
  components: { Icon },
  props: {
    data: {
      type: Array,
      default: [],
    },
    placeholder: { type: String, default: "Hier eingeben" },
    selectedValue: { type: String, default: "" },
  },
  data() {
    return {
      selected: null,
      query: "",
      showAll: false,
    };
  },
  computed: {
    /**
     * A function that filters items based on the query.
     *
     * @return {Array} The filtered list of items.
     */
    filteredItems() {
      return this.query === ""
        ? this.data
        : this.data.filter((item) => {
            return item.name
              .toString()
              .toLowerCase()
              .includes(this.query.toLowerCase());
          });
    },
  },
  methods: {
    /**
     * Toggles the dropdown visibility.
     *
     * @return {void}
     */
    toggleDropdown() {
      if (!this.showAll) {
        this.openDropdown();
      } else {
        this.closeDropdown();
      }
    },

    /**
     * Opens the dropdown by setting the `showAll` property to true,
     * and adds a mousedown event listener to the document to handle clicks outside the dropdown.
     *
     * @return {void} This function does not return a value.
     */
    openDropdown() {
      this.showAll = true;
      setTimeout(() => {
        document.addEventListener("mousedown", this.handleClickOutside);
      }, 0);
    },
    /**
     * Closes the component if the click event is outside of the component.
     *
     * @param {Event} e - The click event.
     * @return {void}
     */
    closeDropdown(e) {
      this.showAll = false;
      document.removeEventListener("mousedown", this.handleClickOutside);
    },
    /**
     * Handles the click event outside of the component.
     *
     * @param {Event} event - The click event.
     * @return {void}
     */
    handleClickOutside(event) {
      if (this.showAll && !this.$refs.combobox.contains(event.target)) {
        document.removeEventListener("mousedown", this.handleClickOutside);
        this.closeDropdown();
      }
    },
    /**
     * A description of the entire function.
     *
     * @param {Event} e - The event triggering the update.
     * @return {void} No return value.
     */
    updateList(e) {
      this.selected = "";
      this.query = e.target.value;
      this.showAll = true;
    },
    /**
     * Updates the selected value based on the selected option from the dropdown.
     * Emits an "update-data" event with the selected value.
     * Resets the query and toggles the showAll flag.
     *
     * @param {Event} e - The event object from the select event.
     * @return {void} This function does not return a value.
     */
    select(e) {
      this.selected = this.choose(e.target.value);
      this.$emit("update-data", this.selected);
      this.query = e.target.value;
      this.showAll = false;
    },
    /**
     * Returns a subset of the data array based on the given query.
     *
     * @param {string} q - The query string to match against the data array.
     * @return {Array} The subset of the data array that matches the query, or the entire data array if the query is empty.
     */
    choose(q) {
      return q === ""
        ? this.data
        : this.data.find((data) => data.name.toLowerCase() === q.toLowerCase());
    },
  },
};
</script>
