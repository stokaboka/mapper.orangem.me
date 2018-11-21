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
import BrightColorEffect from '../lib/draw/BrightColorEffect'

const drawer = new Drawer()
const brightColorEffect = new BrightColorEffect(30, 30, 30)
drawer.addEffect(brightColorEffect)

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
  }

}
</script>

<style>
  .selection-layer-map {
    position: absolute;
  }
</style>
