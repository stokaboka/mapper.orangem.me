<template>
  <canvas
    ref="canvas"
    class="selection-layer-map"
    :width="width"
    :height="height"
  ></canvas>
</template>

<script>

import Drawer from '../lib/draw/Drawer'
import BrightColorEffect from '../lib/draw/BrightColorEffect'
import RotateColorEffect from '../lib/draw/RotateColorEffect'

const drawer = new Drawer()

drawer
  .addEffect(new BrightColorEffect(255, 0, 255))
  .addEffect(new RotateColorEffect())

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
      drawer.clear()
      drawer.drawObjects(this.$dataProvider.selectionLayer)
    }

    // onClick (event) {
    //   const findObj = this.$dataProvider.findObjectByRelativePixelsInSelectionLayer({
    //     x: event.offsetX,
    //     y: event.offsetY
    //   })
    //   if (findObj) {
    //     console.log(findObj.object.id)
    //     this.$emit('on-selected-object-click', findObj)
    //   }
    // }
  }

}
</script>

<style>
  .selection-layer-map {
    position: absolute;
  }
</style>
