<template>
  <q-page>
    <!-- content -->
    The Map page
    <canvas ref="canvas" :width="canvasSize" :height="canvasSize"></canvas>
  </q-page>
</template>

<script>

import MappingArea from '../lib/mapper/MappingArea'

export default {
  name: 'Map',
  data () {
    return {
      zoom: 12,
      geoPoint: { lon: 39.849086, lat: 57.303309 },
      canvasSize: 6 * 256,
      numTiles: 6,
      tiles: [],
      tilesUrl: 'http://localhost:3000/images'
    }
  },

  created () {

  },

  mounted () {
    this.initTiles()
  },

  methods: {
    initTiles: function (lon, lat, zoom) {
      const mappingArea = new MappingArea()

      let grid = mappingArea
        .setZoom(this.zoom)
        .setGeoPoint(this.geoPoint)
        .getGrid()

      this.loadTiles(grid)
    },

    getTileImageFileName: function (x, y) {
      return `${this.tilesUrl}/${this.zoom}/${x}-${y}.png`
    },

    loadTiles: function (grid) {
      console.log('loadTiles')
      console.log(grid)
      let images = []
      let ctx = this.$refs.canvas.getContext('2d')

      for (let x = 0; x < grid.size.x; x++) {
        for (let y = 0; y < grid.size.y; y++) {
          let img = new Image()
          images.push(img)
          img.addEventListener('load', function (event) {
            let __x = x, __y = y
            // здесь выполняет drawImage функцию
            ctx.drawImage(images[__x * __y], __x * 256, __y * 256)
          })
          img.src = this.getTileImageFileName(grid.begin.x + x, grid.begin.y + y)
        }
      }
    },

    loadTile: function () {

    }
  },

  watch: {
    '$route' (to, from) {
      // react to route changes...
      console.log(from)
      console.log(to)
      this.initTiles()
    }
  }

}
</script>

<style>
  .mapper-map-container {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
  }

  .mapper-map-container__row {
    flex-direction: row;
  }

  .mapper-map-container__col {
    flex-direction: column;
  }

  canvas {
    position: absolute;
    left: 0;
    top: 0;
    background-color: darkgrey;
  }

</style>
