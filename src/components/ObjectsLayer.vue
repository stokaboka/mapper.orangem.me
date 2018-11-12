<template>
  <canvas
    ref="canvas"
    class="mapper-layer-map"
    :width="canvasWidth"
    :height="canvasHeight"
  ></canvas>
</template>

<script>
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

      ctx.fillStyle = 'gray'
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

      for (const object of this.objects) {
        this.drawObject(ctx, object)
      }
    },

    drawObject (ctx, object) {
      switch (object.type) {
        case 0: // point 1
          break
        case 1: // point 2
          break
        case 2:
          break
        case 3:
          break
        case 4:
          break
      }
    }

  }
}
</script>

<style>
  .mapper-layer-map {
    position: absolute;
  }
</style>
