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
import ImagesCache from '../lib/network/ImagesCache'

const imagesCache = new ImagesCache()
let loadedGridTiles = {}

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

    onZoomChange (changes) {
      this.$mapping.changeZoom(changes)
      loadedGridTiles = {}
      this.initTiles(false)
      return this.$mapping.getMapControlsInfo()
    },

    onPan (position) {
      this.$mapping.onPan(position)
      loadedGridTiles = {}
      this.initTiles(false)
    },

    initTiles: function (clear) {
      this.grid = this.$mapping.getGrid()
      this.loadTiles(this.grid, clear)
    },

    loadTiles: function (grid, clear) {
      let ctx = this.$refs.canvas.getContext('2d')

      if (clear) {
        loadedGridTiles = {}
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
      let self = this

      const tileX = begin.x + x
      const tileY = begin.y + y
      const tile = `${tileX}-${tileY}`

      if (loadedGridTiles[tile]) {
        console.log(`tile loaded and drawing complete ${tile}`)
        self.onImageLoadedComplete()
        return
      }

      if (imagesCache.exist(this.$mapping.getZoom(), tile)) {
        const cachedImage = imagesCache.get(this.$mapping.getZoom(), tile)
        ctx.drawImage(cachedImage, x * 256, y * 256)
        loadedGridTiles[tile] = 1
        console.log(`draw from images cache ${tile}`)
        self.onImageLoadedComplete()
      } else {
        let img = new Image()

        img.addEventListener('load', function (event) {
          ctx.drawImage(this, x * 256, y * 256)
          loadedGridTiles[tile] = 1
          self.onImageLoadedComplete()
          imagesCache.put(self.$mapping.getZoom(), tile, this)
        })

        img.addEventListener('error', function (event) {
          self.onImageLoadedError()
        })

        img.src = this.$mapping.getTileImageFileName(tileX, tileY)
      }
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
