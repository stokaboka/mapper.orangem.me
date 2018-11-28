<template>
  <canvas
    :ref="cid"
    :id="cid"
    class="mapper-layer-map"
    :width="width"
    :height="height"
  ></canvas>
</template>

<script>

import Drawer from '../lib/draw/Drawer'
import {createNamespacedHelpers} from 'vuex'

const { mapGetters } = createNamespacedHelpers('model')

const drawer = new Drawer()

export default {
  name: 'ObjectsLayer',
  data () {
    return { }
  },

  mounted () {
    drawer
      .setLayer(this.id)
      .setSize({
        width: this.width,
        height: this.height
      })

    this.loadLayerData(this.id)
  },

  updated () {
    if (this.visible) {
      this.redraw()
    } else {
      this.clear()
    }
  },

  props: {
    id: String,
    label: String,
    visible: Boolean,
    width: Number,
    height: Number
  },

  computed: {
    cid () {
      return `OBJECTS_${this.id}`
    },

    ...mapGetters(['mapReady'])
  },

  methods: {
    async loadLayerData (layer) {
      await this.$dataProvider.loadLayer(layer)
        .then(() => {
          if (this.visible) {
            this.redraw()
          } else {
            this.clear()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    reset () {
      this.clear()
      this.loadLayerData(this.id)
    },

    clear () {
      drawer
        .setContext(this.getContext())
        .clear()
    },

    redraw () {
      const ld = this.$dataProvider.getLayerData(this.id)

      drawer
        .setContext(this.getContext())
        .clear()
        .drawObjects(ld)

      this.$emit('object-layer-redraw', this.id)
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

    id (value) {
      this.loadLayerData(value)
    },

    visible (value) {
      if (value) {
        this.redraw()
      } else {
        this.clear()
      }
    },

    mapReady (value) {
      if (value) {
        this.redraw()
      } else {
        this.clear()
      }
    },

    '$route' (to, from) {
      this.reset()
    }

  }
}
</script>

<style>
  .mapper-layer-map {
    position: absolute;
  }
</style>
