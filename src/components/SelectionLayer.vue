<template>
  <canvas
    ref="canvas"
    v-if="selectionLayerVisible"
    class="selection-layer-map"
    :width="width"
    :height="height"
  ></canvas>
</template>

<script>

import Drawer from '../lib/draw/Drawer'
import BrightColorEffect from '../lib/draw/BrightColorEffect'
import RotateColorEffect from '../lib/draw/RotateColorEffect'
import {createNamespacedHelpers} from 'vuex'

const { mapGetters } = createNamespacedHelpers('network')
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
    drawer
      .setLayer('selection')
      .setSize({
        width: this.width,
        height: this.height
      })
  },

  updated () {
    if (this.selectionLayerVisible) {
      this.redraw()
    }
  },

  computed: {
    ...mapGetters(['selectionLayerVisible'])
  },

  methods: {

    redraw () {
      let ctx = this.$refs.canvas.getContext('2d')
      drawer
        .setContext(ctx)
        .clear()
        .drawObjects(this.$dataProvider.selectionLayer)
    }

  }

}
</script>

<style>
  .selection-layer-map {
    position: absolute;
  }
</style>
