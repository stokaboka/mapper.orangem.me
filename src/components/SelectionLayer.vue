<template>
  <canvas
    ref="canvas"
    class="selection-layer-map"
    :width="width"
    :height="height"
    @click="onClick"
  ></canvas>
</template>

<script>

import Drawer from '../lib/draw/Drawer'

const drawer = new Drawer()

export default {
  name: 'SelectionLayer',

  props: {
    width: Number,
    height: Number
  },

  data () {
    return {
    }
  },

  mounted () {
    this.$dataProvider.setMapper(this.$mapping)

    let ctx = this.$refs.canvas.getContext('2d')
    drawer
      .setLayer('selection')
      .setContext(ctx)
      .setSize({
        width: this.width,
        height: this.height
      })
  },

  methods: {

    redraw () {
      drawer.drawObjects(this.$dataProvider.selectionLayer)
    },

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
    selectionLayer (value, oldValue) {
      console.log('selectionLayer', value)
      drawer.drawObjects(this.$dataProvider.selectionLayer)
    },
    '$dataProvider.selectionLayer' (value, oldValue) {
      console.log('$dataProvider.selectionLayer', value)
      drawer.drawObjects(this.$dataProvider.selectionLayer)
    }
  }
}
</script>

<style>
</style>
