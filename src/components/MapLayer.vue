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
import Piper from '../lib/Piper'

export default {
  name: 'MapLayer',

  data () {
    return {
      tilesUrl: 'http://localhost:3000/images',
      zoom: 12,
      geoPoint: new GeoPoint(39.849086, 57.303309),
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

  mounted () {
    this.mappingArea = new MappingArea(this.widthTiles, this.heightTiles)

    if (this.$route.params.lon && this.$route.params.lat) {
      this.geoPoint = { lon: this.$route.params.lon, lat: this.$route.params.lat }
    }

    if (this.$route.params.zoom) {
      this.zoom = this.$route.params.zoom
    }

    this.initTiles(true)
  },

  computed: {
    canvasWidth () {
      return this.widthTiles * 256
    },
    canvasHeight () {
      return this.heightTiles * 256
    }
  },

  methods: {

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
        {zoom: this.mappingArea.getZoom()}
      )
      this.$router.push({name: 'map', params: newRoute})
    },

    /**
     * map zoom change
     * @param changes
     * @returns {boolean}
     */
    onZoomChange (changes) {
      if (this.zoom > this.mappingArea.minZoom && this.zoom < this.mappingArea.maxZoom) {
        this.zoom = this.zoom + changes
        this.initTiles(true)
        return false
      } else {
        return true
      }
    },

    onPan (position) {
      const piper = new Piper()

      this.geoPoint = piper
        .context(this.mappingArea.tilesCalculator)
        .value(this.geoPoint)
        .pipe([
          this.mappingArea.tilesCalculator.geoToMeter,
          this.mappingArea.tilesCalculator.meterToPixels
        ])
        .calc()
        .minus(position.x, 'x')
        .minus(position.y, 'y')
        .pipe([
          this.mappingArea.tilesCalculator.pixelsToMeter,
          this.mappingArea.tilesCalculator.meterToGeo
        ])
        .calc()
        .value()

      this.initTiles(false)
    },

    initTiles: function (clear) {
      // console.log(`initTiles lon=${this.geoPoint.lon} lat=${this.geoPoint.lat}`)

      this.grid = this.mappingArea
        .setZoom(this.zoom)
        .setGeoPoint(this.geoPoint)
        .getGrid()

      this.loadTiles(this.grid, clear)

      this.setRoute()
    },

    // getTileImageFileName: function (x, y) {
    //   return `${this.tilesUrl}/${this.zoom}/${x}-${y}.png`
    // },

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

      img.src = this.mappingArea.getTileImageFileName(begin.x + x, begin.y + y)
    }
  },

  watch: {
    '$route' (to, from) {
      // console.log('MapLayer')
      // console.log(from)
      // console.log(to)
      // this.initTiles(true)
    }

  }

}
</script>

<style>
  .mapper-layer-map {
    position: absolute;
  }
</style>
