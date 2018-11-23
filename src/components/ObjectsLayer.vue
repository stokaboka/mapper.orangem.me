<template>
  <canvas
    :ref="cid"
    v-if="visible"
    :id="cid"
    class="mapper-layer-map"
    :width="width"
    :height="height"
  ></canvas>
</template>

<script>

import Drawer from '../lib/draw/Drawer'

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
    }
  },

  methods: {
    async loadLayerData (layer) {
      await this.$dataProvider.loadLayer(layer)
        .then(() => {
          this.redraw()
        })
        .catch((error) => {
          console.log(error)
        })
    },

    reset () {
      this.loadLayerData(this.id)
    },

    redraw () {
      console.log(`redraw ${this.id} ${this.label}`)
      const ld = this.$dataProvider.getLayerData(this.id)

      let ctx = this.$refs[this.cid].getContext('2d')
      if (ctx) {
        drawer
          .setContext(ctx)
          .clear()
          .drawObjects(ld)

        this.$emit('object-layer-redraw', this.id)
      } else {
        console.log(`context not found. layer ${this.id} ${this.label}`)
      }
    }
  },

  watch: {

    id (value) {
      this.loadLayerData(value)
    },

    visible (value) {
      // drawer.clear()
      // if (value) {
      //   this.redraw()
      // }
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
