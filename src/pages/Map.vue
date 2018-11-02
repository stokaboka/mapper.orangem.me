<template>
  <q-page>

    <div
      class="mapper-layers"
      :style="layersStyle"
      v-touch-pan.prevent="onTouchPan"
    >

      <canvas
        ref="canvas"
        class="mapper-layer-map"
        :width="canvasSize"
        :height="canvasSize"
        v-touch-pan.prevent="onTouchPan"
      ></canvas>

    </div>

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
      tilesUrl: 'http://localhost:3000/images',

      layersTop: 0,
      layersLeft: 0
    }
  },

  computed: {
    layersStyle () {
      return {
        'left': `${this.layersLeft}`,
        'top': `${this.layersTop}`,
        'width': `${this.canvasSize}px`,
        'height': `${this.canvasSize}px`
      }
    }
  },

  created () {

  },

  mounted () {
    this.initTiles()
    this.initTiles()
  },

  methods: {
    initTiles: function (lon, lat, zoom) {
      const mappingArea = new MappingArea()

      let grid = mappingArea
        .setZoom(this.zoom)
        .setGeoPoint(this.geoPoint)
        .getGrid()

      this.setRoute(this.geoPoint, this.zoom)

      this.loadTiles(grid)
    },

    getTileImageFileName: function (x, y) {
      return `${this.tilesUrl}/${this.zoom}/${x}-${y}.png`
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
    },

    setRoute (geoPoint, zoom) {
      let newRoute = Object.assign(
        {},
        this.$route.params,
        geoPoint,
        {zoom}
      )
      this.$router.push({name: 'map', params: newRoute})
    },

    onTouchPan (obj) {
      console.log(obj)
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

  .mapper-layers {
    position: absolute;
    background-color: darkgrey;
  }

  .mapper-layer-map {
    position: absolute;
  }

</style>
