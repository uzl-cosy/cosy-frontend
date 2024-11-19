<!--Table Component: Lists all available cases belonging to a specifig session-->
<template>
  <div class="px-4 w-fit">
    <div
      class="flex item relative overflow-x-auto p-1 mt-4"
      style="align-items: center"
    >
      <Icon class="mr-2" :iconName="icon" color="#213547" />
      <h4 class="font-light 2xl:text-2xl md:text-xl text-blue-dark">
        <slot />
      </h4>
    </div>
    <div class="item table my-0">
      <table
        class="w-auto text-base text-left text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-base text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400 w-full pr-10"
        >
          <tr class="flex">
            <th class="w-1/12"></th>
            <th class="px-6 py-3 w-3/12">Fallname</th>
            <th class="px-6 py-3 w-3/12" v-if="!onlyNames">Fallbeschreibung</th>

            <th class="px-6 py-3 w-2/12" v-if="!onlyNames">Requisiten</th>
            <th class="px-6 py-3 w-2/12" v-if="!onlyNames">Notizen</th>
            <th class="w-1/12"></th>
            <!-- <th scope="col" class="px-6 py-3">Kursname</th>
            <th scope="col" class="px-6 py-3">Fallname</th>
            <th scope="col" class="px-6 py-3">Datum</th> -->
            <!-- <th scope="col" class="px-6 py-3">Häufigkeit</th> -->
          </tr>
        </thead>
        <tbody v-if="!this.data || this.data.length == 0" class="w-full">
          <tr class="bg-blue-100 w-full px-20 py-1">
            <td class="w-auto px-12 col-3 py-8" colspan="3">
              Es gibt noch keine Einträge
            </td>
          </tr>
          <tr
            v-if="true"
            class="flex justify-center"
            :class="{
              'z-0 -mt-20': this.windowHeight < 900 && this.data.length >= 8,
            }"
          >
            <SmallButton
              v-if="button"
              :class="{
                'mt-5': this.windowHeight < 900 && this.data.length < 8,
              }"
              class="flex mx-2 2xl:py-3 2xl:my-4 md:py-2 z-20 md:rounded-full md:bg-white/50"
              size=""
              preset="outlined"
              @click="this.$emit('new-case')"
              ><Icon
                iconName="plus"
                color="rgba(0, 68, 114, 0.8)"
                :size="this.windowHeight > 900 ? '28' : '22'"
              ></Icon
              ><span class="mx-2 md:text-sm"> Neuer Fall</span></SmallButton
            >
          </tr>
          <tr class="rounded-b-lg py-2" v-if="!button">
            <td><div v-if="this.data.length < 8" class="py-3"></div></td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr
            class="even:bg-blue-100 odd:bg-blue-200 cursor-pointer border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-sky-700 hover:text-white w-auto truncate flex"
            v-for="(item, index) in data"
            :key="item.case_id"
          >
            <!--            Col1 -->
            <td class="w-1/12 px-6 flex items-center" v-if="showRecord">
              <SmallButton
                class="py-1 2xl:px-3 md:px-2"
                size=""
                @click="this.$emit('go-to-record', index)"
              >
                <Icon iconName="microphone" color="white" size="32"></Icon>
              </SmallButton>
              <span
                v-if="tooltip == 'r' + index"
                class="text-base flex absolute ml-5 -mt-6 p-2 rounded-lg truncate"
              >
                <svg viewBox="0 0 7 10">
                  <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                </svg>
                <span
                  class="mx-2 p-2 ml-7 rounded-lg bg-white/80 text-slate-600"
                >
                  Neue Aufnahme mit diesem Fall
                </span>
              </span>
            </td>
            <!--            Col2 -->
            <td
              v-if="index <= limit"
              scope="col"
              class="px-6 py-4 font-medium w-3/12"
              @click="open(item.case_id)"
            >
              <div class="">
                {{ item.case_name }}
                <!-- <span class="text-xs text-slate-400">ID: {{ item.id }}</span> -->
              </div>
            </td>
            <!--            Col3 -->
            <td
              v-if="!onlyNames"
              class="px-6 py-4 w-3/12 max-w-4/12 break-all"
              @click="
                open(item.case_id);
                this.edit = true;
              "
            >
              <div class="max-w-96 truncate break-all">
                {{ item.case_description }}
              </div>
            </td>
            <!--            Col4 -->
            <td
              v-if="!onlyNames"
              class="px-6 py-4 w-2/12 break-all truncate"
              @click="
                open(item.case_id);
                this.edit = true;
              "
            >
              <div class="max-w-28 truncate break-all">
                {{ item.case_requisites }}
              </div>
            </td>
            <!--            Col5 -->
            <td
              v-if="!onlyNames"
              class="px-6 py-4 w-2/12 max-w-2/12 break-all truncate"
              @click="
                open(item.case_id);
                this.edit = true;
              "
            >
              <div class="max-w-28 truncate break-all">
                {{ item.case_notes }}
              </div>
            </td>
            <!--            Col6 -->
            <td
              @mouseover="this.tooltip = 'd' + index"
              @mouseleave="this.tooltip = ''"
              class="w-min md:pr-5"
              :class="{ '2xl:pr-10': !this.deleteRequest }"
              v-if="this.delete"
            >
              <div
                @click="
                  this.deleteRequest = true;
                  this.selected = index;
                "
                v-if="this.selected !== index"
                class="2xl:mx-3 border-4 p-1 border-transparent rounded-lg 2xl:m-2 hover:border-red-500 w-fit"
                :class="{
                  'border-red-500':
                    this.deleteRequest && this.selected == index,
                }"
              >
                <Icon iconName="delete" size="24" color="gray"></Icon>
                <span
                  v-if="tooltip == 'd' + index"
                  class="text-base flex absolute ml-5 -mt-6 p-2 rounded-lg truncate"
                >
                  <svg viewBox="0 0 7 10">
                    <line x1="0" y1="5" x2="16" y2="5" stroke="gray"></line>
                  </svg>
                  <span class="mx-2 p-2 rounded-lg bg-white/80 text-slate-600">
                    Löschen
                  </span>
                </span>
              </div>
              <!--Delete Confirmation-->
              <div
                class="flex items-center w-fit"
                v-if="this.deleteRequest && index == this.selected"
              >
                <div class="flex 2xl:flex-col justify-start w-min mx-2">
                  <div
                    class="items-center my-2 flex w-fit cursor-pointer font-bold border-slate-300 hover:ml-0 hover:border-white border-2 hover:border-4 hover:font-extrabold rounded-lg px-2 mx-1 py-1"
                    @click="
                      this.$emit('delete', item.case_id);
                      this.deleteRequest = false;
                      this.forceUpdate();
                    "
                  >
                    <Icon iconName="delete" size="24" color="red"></Icon>
                    <span class="mx-1">Löschen</span>
                  </div>
                  <div
                    class="self-center font-bold border-slate-300 hover:mr-0 hover:border-white border-2 hover:border-4 hover:font-extrabold rounded-lg px-2 mx-1 py-1"
                    @click="reset()"
                  >
                    Abbrechen
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr
            v-if="button"
            class="flex justify-center"
            :class="{
              'z-0 -mt-20': this.windowHeight < 900 && this.data.length >= 8,
            }"
          >
            <SmallButton
              :class="{
                'mt-5': this.windowHeight < 900 && this.data.length < 8,
              }"
              class="flex mx-2 2xl:py-3 2xl:my-4 md:py-2 z-20 md:rounded-full md:bg-white/50"
              size=""
              preset="outlined"
              @click="this.$emit('new-case')"
              ><Icon
                iconName="plus"
                color="rgba(0, 68, 114, 0.8)"
                :size="this.windowHeight > 900 ? '28' : '22'"
              ></Icon
              ><span class="mx-2 md:text-sm"> Neuer Fall</span></SmallButton
            >
          </tr>
          <tr class="rounded-b-lg py-2">
            <td><div v-if="this.data.length < 8" class="py-3"></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Icon from "../interface-components/Icon.vue";
import SmallButton from "../interface-components/SmallButton.vue";
import LoadButton from "../interface-components/LoadButton.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tooltip: false,
      loading: true,
      deleteRequest: false,
      selected: "",
      edit: false,
    };
  },
  components: {
    Icon,
    SmallButton,
    LoadButton,
  },
  props: {
    onlyNames: { type: Boolean, default: false },
    size: { type: String, default: "medium" },
    showRecord: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    color: String,
    icon: String,
    button: { type: Boolean, default: true },
    data: {
      type: Array,
      default: () => [],
    },
    labels: {
      type: Array,
      default: ["Fallname", "Fallbeschreibung", "Anmerkungen"],
    },
    limit: { type: Number, default: 10 },
  },
  methods: {
    /**
     * A method to reset the selected item and delete request.
     *
     */
    reset() {
      this.selected = "";
      this.deleteRequest = false;
    },
    /**
     * A method to force update and reset the delete request.
     *
     * @return {void} No return value
     */
    forceUpdate() {
      this.$forceUpdate;
      this.deleteRequest = false;
    },
    /**
     * Emits an "open" event with the given ID.
     *
     * @param {number} id - The ID to be emitted.
     * @return {void}
     */
    open(id) {
      this.$emit("open", id);
    },
  },
  computed: {
    ...mapGetters({
      getNewCase: "getNewCase",
      getCurrentSession: "getCurrentSession",
      getCaseConfig: "getCaseConfig",
    }),
  },
};
</script>

<style>
@media screen and (min-width: 900px) {
  tbody {
    display: block;
    max-height: 500px;
    overflow-y: scroll;
  }
}

@media screen and (max-width: 1200px) {
  tbody {
    display: block;
    max-height: 380px;
    overflow-y: scroll;
  }
}

@media screen and (min-width: 1200px) and (max-width: 1600px) {
  tbody {
    display: block;
    max-height: 300px;
    overflow-y: scroll;
  }
}
thead,
tbody tr {
  display: table;
  table-layout: fixed;
}
</style>
