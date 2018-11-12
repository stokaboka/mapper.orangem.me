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
import {GeoPoint} from '../lib/mapper/Mercator'

const mappingArea = new MappingArea()
  .setGeoPoint(new GeoPoint(39.849086, 57.303309))
  .setZoom(12)

export default {
  name: 'MapLayer',

  data () {
    return {

      canvasWidth: mappingArea.areaSizeWidth * 256,
      canvasHeight: mappingArea.areaSizeHeight * 256,

      widthTiles: 6,
      heightTiles: 6,
      grid: null,
      status: {
        ready: false,
        loading: false,
        complete: false,
        errors: 0
      },
      counter: {
        images: 0,
        complete: 0,
        errors: 0
      }
    }
  },

  created () {

  },

  mounted () {
    this.initRouterParams()

    this.initTiles(true)
  },

  methods: {

    initRouterParams () {
      if (this.$route.params.lon && this.$route.params.lat) {
        mappingArea.setGeoPoint(new GeoPoint(
          parseFloat(this.$route.params.lon),
          parseFloat(this.$route.params.lat)
        )
        )
      }

      if (this.$route.params.zoom) {
        mappingArea.setZoom(parseInt(this.$route.params.zoom))
      }
    },

    onImageLoadedFinish (sendProgress) {
      if (this.counter.complete + this.counter.errors === this.counter.images) {
        if (this.counter.errors > 0) {
          setTimeout(() => {
            this.initTiles(false)
          }, 500)
        } else {
          this.$emit('load-tiles-complete')
        }
      } else {
        if (sendProgress) {
          this.$emit('load-tiles-progress', this.counter)
        }
      }
    },

    onImageLoadedComplete () {
      this.counter.complete++
      this.onImageLoadedFinish(true)
    },

    onImageLoadedError () {
      this.counter.errors++
      this.onImageLoadedFinish(false)
    },

    setRoute () {
      let newRoute = Object.assign(
        {},
        this.$route.params,
        this.geoPoint,
        {zoom: mappingArea.getZoom()}
      )
      this.$router.push({name: 'map', params: newRoute})
    },

    onZoomChange (changes) {
      mappingArea.changeZoom(changes)
      this.initTiles(false)
      return mappingArea.getMapControlsInfo()
    },

    onPan (position) {
      mappingArea.onPan(position)
      this.initTiles(false)
    },

    initTiles: function (clear) {
      this.grid = mappingArea.getGrid()
      this.loadTiles(this.grid, clear)
      this.setRoute()
    },

    loadTiles: function (grid, clear) {
      let ctx = this.$refs.canvas.getContext('2d')

      if (clear) {
        ctx.fillStyle = 'gray'
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
      }

      this.counter.images = grid.size.x * grid.size.y
      this.counter.complete = 0
      this.counter.errors = 0

      for (let x = 0; x < grid.size.x; x++) {
        for (let y = 0; y < grid.size.y; y++) {
          this.loadTile(ctx, grid.begin, x, y)
        }
      }

      this.$emit('load-tiles-started')
    },

    loadTile: function (ctx, begin, x, y) {
      let img = new Image()
      let self = this

      img.addEventListener('load', function (event) {
        ctx.drawImage(this, x * 256, y * 256)
        self.onImageLoadedComplete()
      })

      img.addEventListener('error', function (event) {
        self.onImageLoadedError()
      })

      img.src = mappingArea.getTileImageFileName(begin.x + x, begin.y + y)
    }
  },

  watch: {
    '$route' (to, from) {
      this.initRouterParams()
    }

  }

}
</script>

<style>
  .mapper-layer-map {
    position: absolute;
  }
</style>
