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
import TilesLoader from '../lib/model/TilesLoader'

const tilesLoader = new TilesLoader()

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

  mounted () {
    tilesLoader
      .init(this)
      .setSize(this.width, this.height)

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

    onZoomChange (changes) {
      this.$mapping.changeZoom(changes)
      this.initTiles(false)
      return this.$mapping.getMapControlsInfo()
    },

    onPan (position) {
      this.$mapping.onPan(position)
      this.initTiles(false)
    },

    initTiles: function (clearGraphics) {
      const ctx = this.$refs.canvas.getContext('2d')
      tilesLoader
        .clearLoader()
        .setContext(ctx)
      if (clearGraphics) {
        tilesLoader.clearGraphics()
      }
      tilesLoader.start()
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
