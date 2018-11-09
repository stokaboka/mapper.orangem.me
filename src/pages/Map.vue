<template>
  <q-page ref="page">

    <q-resize-observable @resize="onResize"></q-resize-observable>

    <div
      class="absolute"
      :style="layersStyle"
      v-touch-pan.prevent="onTouchPan"
    >

      <map-layer
        ref="map"
        @load-tiles-started="onLoadTilesStarted"
        @load-tiles-progress="onLoadTilesProgress"
        @load-tiles-complete="onLoadTilesComplete"
      ></map-layer>

    </div>

    <q-progress
      v-if="mapLayer.loading.progress"
      class="absolute-top"
      style="width: 100%"
      :percentage="mapLayer.loading.percentage"
      color="negative"
      stripe :buffer="mapLayer.loading.buffer" >
    </q-progress>

    <map-controls
      class="map-controls-position__right-center"
      @increment="doIncZoom"
      @decrement="doDecZoom"
    >
    </map-controls>

  </q-page>
</template>

<script>

import MapLayer from '../components/MapLayer'
import MapControls from '../components/MapControls'

export default {
  name: 'Map',
  components: {MapControls, MapLayer},
  data () {
    return {
      zoom: 12,
      geoPoint: {
        lon: 39.849086,
        lat: 57.303309
      },

      layersPosition: {
        left: 0,
        top: 0
      },

      startDragLayersPosition: {
        left: 0,
        top: 0
      },

      mapLayer: {
        loading: {
          progress: false,
          percentage: 0,
          buffer: 0
        }
      }
    }
  },

  computed: {
    layersStyle () {
      return {
        'left': `${this.layersPosition.left}px`,
        'top': `${this.layersPosition.top}px`
      }
    }
  },

  methods: {

    doIncZoom () {
      this.$refs.map.onZoomChange(1)
    },

    doDecZoom () {
      this.$refs.map.onZoomChange(-1)
    },

    positionLayersToCenter (pageSize) {
      const pageHeight = pageSize ? pageSize.height : this.$refs.page.$el.offsetHeight
      const pageWidth = pageSize ? pageSize.width : this.$refs.page.$el.offsetWidth

      const canvasWidth = this.$refs.map.canvasWidth
      const canvasHeight = this.$refs.map.canvasHeight

      this.layersPosition = {
        left: Math.round((pageWidth - canvasWidth) / 2, 10),
        top: Math.round((pageHeight - canvasHeight) / 2, 10)
      }
    },

    onLoadTilesStarted () {
      // this.layersPosition.left = 0
      // this.layersPosition.top = 0
      this.mapLayer.loading.progress = true
    },

    onLoadTilesProgress (counter) {
      if (counter.images > 0) {
        this.mapLayer.loading.percentage = 100 * counter.complete / counter.images
        this.mapLayer.loading.buffer = 100 * counter.errors / counter.images
      }
    },

    onLoadTilesComplete () {
      this.mapLayer.loading.progress = false
      this.positionLayersToCenter()
    },

    dragLayers (delta) {
      this.layersPosition.left += delta.x
      this.layersPosition.top += delta.y
    },

    onChangeLayersPosition (position) {
      this.$refs.map.onPan(position)
    },

    onTouchPan (event) {
      this.dragLayers(event.delta)

      if (event.isFirst) {
        this.startDragLayersPosition = {
          left: this.layersPosition.left,
          top: this.layersPosition.top
        }
      }

      if (event.isFinal) {
        const deltaPos = {
          x: this.layersPosition.left - this.startDragLayersPosition.left,
          y: this.layersPosition.top - this.startDragLayersPosition.top
        }

        this.onChangeLayersPosition(deltaPos)
      }
    },

    onResize (size) {
      console.log(size)
      this.positionLayersToCenter(size)
    }

  }

}
</script>

<style>
  .map-controls-position__right-center {
    right: 0;
  }
</style>
