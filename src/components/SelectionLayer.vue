<template>
  <canvas
    :ref="cid"
    class="selection-layer-map"
    :width="width"
    :height="height"
  ></canvas>
</template>

<script>

import Drawer from '../lib/draw/Drawer'
// import BrightColorEffect from '../lib/draw/BrightColorEffect'
// import RotateColorEffect from '../lib/draw/RotateColorEffect'
import BorderEffect from '../lib/draw/BorderEffect'
import {createNamespacedHelpers} from 'vuex'

const { mapGetters } = createNamespacedHelpers('network')
const drawer = new Drawer()

drawer
  // .addEffect(new BrightColorEffect(255, 0, 255))
  // .addEffect(new RotateColorEffect())
  .addEffect(new BorderEffect('#ff0000', 2))

export default {
  name: 'SelectionLayer',

  props: {
    width: Number,
    height: Number
  },

  data () {
    return {
      cid: 'selection'
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

    clear () {
      drawer
        .setContext(this.getContext())
        .clear()
    },

    redraw () {
      drawer
        .setContext(this.getContext())
        .clear()
        .drawObjects(this.$dataProvider.selectionLayer)
    },

    getContext () {
      if (this.$refs[this.cid]) {
        return this.$refs[this.cid].getContext('2d')
      } else {
        return null
      }
    }

  },

  watch: {
    selectionLayerVisible (value) {
      if (value) {
        this.redraw()
      } else {
        this.clear()
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
