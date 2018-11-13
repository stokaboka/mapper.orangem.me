<template>
  <canvas
    ref="canvas"
    class="mapper-layer-map"
    :width="canvasWidth"
    :height="canvasHeight"
  ></canvas>
</template>

<script>

const point = function (ctx, options) {
  ctx.fillStyle = options.fillStyle
  ctx.fillRect(options.x, options.y, options.w, options.h)
  // console.log(options)
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

}

const polyline02 = function (ctx, options) {

}

const polyline03 = function (ctx, options) {

}

const drawMethods = [point01, point02, polyline01, polyline02, polyline03]

export default {
  name: 'ObjectsLayer',
  data () {
    return {
      canvasWidth: this.$mapping.areaSizeWidth * 256,
      canvasHeight: this.$mapping.areaSizeHeight * 256
    }
  },

  props: {
    id: String,
    title: String,
    description: String,
    objects: Array
  },

  mounted () {
    this.drawObjects()
  },

  methods: {
    drawObjects () {
      let ctx = this.$refs.canvas.getContext('2d')

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

      for (const object of this.objects) {
        this.drawObject(ctx, object)
      }
    },

    drawObject (ctx, object) {
      drawMethods[object.type](ctx, object)
    }

  },

  watch: {
    objects () {
      this.drawObjects()
    }
  }
}
</script>

<style>
  .mapper-layer-map {
    position: absolute;
  }
</style>
