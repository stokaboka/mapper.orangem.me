<template>
  <canvas
    ref="canvas"
    class="mapper-layer-map"
    :width="canvasWidth"
    :height="canvasHeight"
    @click="onClick"
  ></canvas>
</template>

<script>

import Drawer from '../lib/draw/Drawer'

const drawer = new Drawer()

export default {
  name: 'ObjectsLayer',
  data () {
    return {
      canvasWidth: this.$mapping.areaSizeWidth * 256,
      canvasHeight: this.$mapping.areaSizeHeight * 256
    }
  },

  mounted () {
    this.$dataProvider.setMapper(this.$mapping)

    let ctx = this.$refs.canvas.getContext('2d')
    drawer
      .setLayer(this.id)
      .setContext(ctx)
      .setSize({
        width: this.$mapping.areaSizeWidth * 256,
        height: this.$mapping.areaSizeHeight * 256
      })

    this.loadLayerData(this.id)
  },

  props: {
    id: String
    // title: String,
    // description: String
    // objects: Array
  },

  methods: {
    async loadLayerData (layer) {
      drawer.clear()
      await this.$dataProvider.loadLayer(layer)
        .then(() => {
          console.log('---objectsReady---')
          const ld = this.$dataProvider.getLayerData(layer)
          drawer.drawObjects(ld)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    onClick (event) {
      const findObj = this.$dataProvider.findObjectByRelativePixels({
        x: event.offsetX,
        y: event.offsetY
      })
      if (findObj) {
        console.log(findObj.object.id)
      }
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
