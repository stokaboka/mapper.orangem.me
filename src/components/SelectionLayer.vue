<template>
  <canvas
    ref="canvas"
    class="selection-layer-map"
    :width="canvasWidth"
    :height="canvasHeight"
    @click="onClick"
  ></canvas>
</template>

<script>

import Drawer from '../lib/draw/Drawer'

const drawer = new Drawer()

export default {
  name: 'SelectionLayer',

  data () {
    return {
      canvasWidth: this.$mapping.areaSizeWidth * 256,
      canvasHeight: this.$mapping.areaSizeHeight * 256
    }
  },

  methods: {
    onClick (event) {
      const findObj = this.$dataProvider.findObjectByRelativePixels({
        x: event.offsetX,
        y: event.offsetY
      })
      if (findObj) {
        console.log(findObj.object.id)
        this.$emit('on-selected-object-click', findObj)
      }
    }
  },

  watch: {
    '$dataProvider.selectionLayer' (value, oldValue) {
      drawer.drawObjects(this.$dataProvider.selectionLayer)
    }
  }
}
</script>

<style>
</style>
