<template>
  <canvas
    ref="canvas"
    class="mapper-layer-map"
    :width="canvasWidth"
    :height="canvasHeight"
  ></canvas>
</template>

<script>

import MappingArea from '../lib/mapper/MappingArea'

export default {
  name: 'MapLayer',

  props: {

    // mTilesUrl: { type: String, required: true },

    mWidthTiles: { type: Number, required: true },
    mHeightTiles: { type: Number, required: true },

    mZoom: { type: Number, required: true },
    mGeoPoint: { type: Object, required: true }

  },

  data () {
    return {
      tilesUrl: 'http://localhost:3000/images'
    }
  },

  mounted () {
    this.initTiles()
  },

  computed: {
    canvasWidth () {
      return this.mWidthTiles * 256
    },
    canvasHeight () {
      return this.mHeightTiles * 256
    }
  },

  methods: {
    initTiles: function () {
      const mappingArea = new MappingArea(this.mWidthTiles, this.mHeightTiles)

      let grid = mappingArea
        .setZoom(this.mZoom)
        .setGeoPoint(this.mGeoPoint)
        .getGrid()

      this.loadTiles(grid)
    },

    getTileImageFileName: function (x, y) {
      return `${this.tilesUrl}/${this.mZoom}/${x}-${y}.png`
    },

    loadTiles: function (grid) {
      let ctx = this.$refs.canvas.getContext('2d')

      for (let x = 0; x < grid.size.x; x++) {
        for (let y = 0; y < grid.size.y; y++) {
          this.loadTile(ctx, grid.begin, x, y)
        }
      }
    },

    loadTile: function (ctx, begin, x, y) {
      let img = new Image()
      let self = this

      img.addEventListener('load', function (event) {
        ctx.drawImage(this, x * 256, y * 256)
      })

      img.addEventListener('error', function (event) {
        console.log(self)
      })

      img.src = this.getTileImageFileName(begin.x + x, begin.y + y)
    }
  },

  watch: {
    '$route' (to, from) {
      console.log('MapLayer')
      console.log(from)
      console.log(to)
      this.initTiles()
    },

    'mZoom' (val, oldVal) {
      this.initTiles()
    },

    'mGeoPoint' (val, oldVal) {
      this.initTiles()
    }
  }

}
</script>

<style>
  .mapper-layer-map {
    position: absolute;
  }
</style>
