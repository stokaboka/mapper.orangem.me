<template>
  <canvas
    ref="canvas"
    class="mapper-layer-map"
    :width="canvasWidth"
    :height="canvasHeight"
  ></canvas>
</template>

<script>

import DataProvider from '../lib/network/DataProvider'

const dataProvider = new DataProvider('http://localhost:3000/dp')

const point = function (ctx, options) {
  ctx.fillStyle = options.fillStyle
  ctx.fillRect(options.x, options.y, options.w, options.h)
  // console.log(options)
}

const point00 = function (ctx, options) {
  point(ctx,
    {
      fillStyle: 'magenta',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
}

const point01 = function (ctx, options) {
  point(ctx,
    {
      fillStyle: 'red',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
}

const point02 = function (ctx, options) {
  point(ctx,
    {
      fillStyle: 'blue',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
}

const polyline01 = function (ctx, options) {
  point(ctx,
    {
      fillStyle: 'yellow',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 5,
      h: 5
    })
}

const polyline02 = function (ctx, options) {
  point(ctx,
    {
      fillStyle: 'orange',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 8,
      h: 16
    })
}

const polyline03 = function (ctx, options) {
  point(ctx,
    {
      fillStyle: 'green',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
}

// const drawMethods = [point01, point02, polyline01, polyline02, polyline03]

const drawMethods = {
  '0': point00,
  '1': point01,
  '2': point02,
  '3': polyline01,
  '4': polyline02,
  '5': polyline03
}

export default {
  name: 'ObjectsLayer',
  data () {
    return {
      canvasWidth: this.$mapping.areaSizeWidth * 256,
      canvasHeight: this.$mapping.areaSizeHeight * 256
    }
  },

  mounted () {
    dataProvider.setMapper(this.$mapping)
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
      this.clear()
      await dataProvider.loadLayer(layer)
        .then((response) => {
          this.drawObjects(response.data.objects)
          console.log('---objectsReady---')
        })
        .catch((error) => {
          console.log(error)
        })
    },

    clear () {
      let ctx = this.$refs.canvas.getContext('2d')
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    },

    drawObjects (objects) {
      let ctx = this.$refs.canvas.getContext('2d')
      this.clear()
      for (const object of objects) {
        this.drawObject(ctx, object)
      }
    },

    drawObject (ctx, object) {
      drawMethods[object.type](ctx, object)
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
