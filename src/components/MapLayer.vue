<template>
  <canvas
    ref="canvas"
    class="mapper-layer-map"
    :width="width"
    :height="height"
  ></canvas>
</template>

<script>

import {GeoPoint} from '../lib/mapper/Mercator'

export default {
  name: 'MapLayer',

  props: {
    width: Number,
    height: Number
  },

  data () {
    return {

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
        this.$mapping.setGeoPoint(new GeoPoint(
          parseFloat(this.$route.params.lon),
          parseFloat(this.$route.params.lat)
        )
        )
      }

      if (this.$route.params.zoom) {
        this.$mapping.setZoom(parseInt(this.$route.params.zoom))
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

    // setRoute () {
    //   let newRoute = Object.assign(
    //     {},
    //     this.$route.params,
    //     this.geoPoint,
    //     {zoom: this.$mapping.getZoom()}
    //   )
    //   this.$router.push({name: 'map', params: newRoute})
    // },

    onZoomChange (changes) {
      this.$mapping.changeZoom(changes)
      this.initTiles(false)
      return this.$mapping.getMapControlsInfo()
    },

    onPan (position) {
      this.$mapping.onPan(position)
      this.initTiles(false)
    },

    initTiles: function (clear) {
      this.grid = this.$mapping.getGrid()
      this.loadTiles(this.grid, clear)
      // this.setRoute()
    },

    loadTiles: function (grid, clear) {
      let ctx = this.$refs.canvas.getContext('2d')

      if (clear) {
        ctx.fillStyle = 'gray'
        ctx.fillRect(0, 0, this.width, this.height)
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

      img.src = this.$mapping.getTileImageFileName(begin.x + x, begin.y + y)
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
