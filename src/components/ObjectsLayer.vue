<template>
  <canvas
    ref="canvas"
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
    return {}
  },

  mounted () {
    // this.$dataProvider.setMapper(this.$mapping)

    let ctx = this.$refs.canvas.getContext('2d')
    drawer
      .setLayer(this.id)
      .setContext(ctx)
      .setSize({
        width: this.width,
        height: this.height
      })

    this.loadLayerData(this.id)
  },

  props: {
    id: String,
    width: Number,
    height: Number
  },

  methods: {
    async loadLayerData (layer) {
      drawer.clear()
      await this.$dataProvider.loadLayer(layer)
        .then(() => {
          const ld = this.$dataProvider.getLayerData(layer)
          drawer.drawObjects(ld)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },

  watch: {
    id (value) {
      this.loadLayerData(value)
    },
    '$route' (to, from) {
      this.loadLayerData(this.id)
    }
  }
}
</script>

<style>
  .mapper-layer-map {
    position: absolute;
  }
</style>
