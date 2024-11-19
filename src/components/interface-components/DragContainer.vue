<!--INTERFACE COMPONENT: Draggable container that lets user resize it-->
<template>
  <div
    class="resizable-container w-full"
    @dblclick="
      this.width = this.maxWidth;
      this.$emit('dragend');
    "
    @mousedown="startResize"
    @touchstart="startResize"
    :style="{ width: width + 'px', float: side === 'left' ? 'right' : 'left' }"
    v-if="rendercomponent"
  >
    <div
      class="resizable-border cursor-w-resize hover:bg-sky-400/25 rounded-full flex items-center"
      :class="{ 'right-0': side == 'right', 'left-0': side == 'left' }"
      @mouseover="this.hoverResize = true"
      @mouseleave="this.hoverResize = false"
    >
      <!--Resize indicator when hovering-->
      <Icon
        v-if="hoverResize"
        iconName="arrowScale"
        class="absolute animate-pulse -ml-3"
        size="42"
      ></Icon>
    </div>
    <div class="resizable-content px-2">
      <slot ref="child" />
    </div>
  </div>
</template>

<script>
import Icon from "../interface-components/Icon.vue";

export default {
  data() {
    return {
      rendercomponent: true,
      isResizing: false,
      startX: 0,
      width: 650,

      key: 0,
      hoverResize: false,
    };
  },
  props: {
    minWidth: Number,
    maxWidth: Number,
    side: { type: String, default: "right" }, // side of drag bar: left or right
  },
  methods: {
    /**
     * Sets the width of the component and updates the rendering.
     *
     * @param {number} e - The new width value.
     * @return {void} This function does not return anything.
     */
    setWidth(e) {
      this.width = e;
      this.rendercomponent = false;

      {
        this.$nextTick(() => {
          this.rendercomponent = true;
        });
      }
    },
    /**
     * Starts the resizing process when the mouse is near the edge of the element.
     *
     * @param {Event|TouchEvent} e - The event that triggered the start of the resize.
     * @return {void} This function does not return anything.
     */
    startResize(e) {
      const edgeTolerance = 50;
      const rect = this.$el.getBoundingClientRect();
      const isNearEdge =
        this.side === "left" && e.clientX <= rect.left + edgeTolerance
          ? e.clientX <= rect.left + edgeTolerance
          : this.side === "right" && e.clientX >= rect.right - edgeTolerance;

      if (!isNearEdge) {
        return; // Don't start resizing if not near the edge
      }
      e.preventDefault();
      this.isResizing = true;
      this.startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
      document.addEventListener("mousemove", this.resize);
      document.addEventListener("mouseup", this.stopResize);
      document.addEventListener("touchmove", this.resize);
      document.addEventListener("touchend", this.stopResize);
    },
    /**
     * Resizes the element based on the mouse movement when the resizing process is started.
     *
     * @param {Event|TouchEvent} e - The event that triggered the resize.
     * @return {void} This function does not return anything.
     */
    resize(e) {
      if (this.isResizing) {
        const clientX = e.type.includes("touch")
          ? e.touches[0].clientX
          : e.clientX;

        // Check the side property to determine resizing direction
        if (this.side === "left") {
          // Resizing from the left, adjust calculations accordingly
          const newWidth = this.width - (clientX - this.startX);
          if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
            this.width = newWidth;
          }
        } else {
          // Default behavior (resizing from the right)
          const newWidth = this.width + (clientX - this.startX);
          if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
            this.width = newWidth;
          }
        }

        this.startX = clientX;
      }
    },
    /**
     * Stops the resizing process and emits a "dragend" event. Removes event listeners for mouse and touch events.
     * Increments the key to trigger a re-render.
     *
     * @param {Event} e - The event that triggered the stopResize function.
     * @return {void} This function does not return anything.
     */
    stopResize(e) {
      if (this.isResizing) {
        this.isResizing = false;
        this.$emit("dragend");
        document.removeEventListener("mousemove", this.resize);
        document.removeEventListener("mouseup", this.stopResize);
        document.removeEventListener("touchmove", this.resize);
        document.removeEventListener("touchend", this.stopResize);
        this.key++; // Increment the key to trigger a re-render
      }
    },
  },
  components: { Icon },
  mounted() {
    this.width = this.maxWidth;
    this.resize();
    this.$emit("dragend");
  },
};
</script>

<style scoped>
.resizable-container {
  position: relative;
}

.resizable-border {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30px;
  margin-right: -10px;
  height: 94%;
  margin-top: 15px;
  z-index: 20;
  user-select: none;
}
.resizable-content {
  resize: none;
  margin-right: -10px;
  resize: horizontal;
  overflow: hidden;
  user-select: none;
}
</style>
