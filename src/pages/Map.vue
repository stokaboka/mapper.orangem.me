<template>
  <q-page ref="page" class="no-scroll">

    <q-resize-observable @resize="onResize"></q-resize-observable>

    <div
      class="absolute"
      :style="layersStyle"
      v-touch-pan.prevent="onTouchPan"
    >

      <map-layer
        ref="map"
        id="MAP"
        @load-tiles-started="onLoadTilesStarted"
        @load-tiles-progress="onLoadTilesProgress"
        @load-tiles-complete="onLoadTilesComplete"
      ></map-layer>

      <objects-layer
        v-if="mapReady"
        v-for="layer in layers"
        :key="layer.id"
        v-bind="layer">
      </objects-layer>

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
      :inc-disable="mapControls.incDisable"
      :dec-disable="mapControls.decDisable"
      @increment="doIncZoom"
      @decrement="doDecZoom"
    >
    </map-controls>

  </q-page>
</template>

<script>

import {createNamespacedHelpers} from 'vuex'

import MapLayer from '../components/MapLayer'
import MapControls from '../components/MapControls'
import ObjectsLayer from '../components/ObjectsLayer'

const { mapState, mapActions } = createNamespacedHelpers('network')

export default {
  name: 'Map',
  components: {ObjectsLayer, MapControls, MapLayer},
  data () {
    return {

      mapControls: {
        zoom: 12,
        incDisable: false,
        decDisable: false
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
      },

      mapReady: false
    }
  },

  computed: {
    layersStyle () {
      return {
        'left': `${this.layersPosition.left}px`,
        'top': `${this.layersPosition.top}px`
      }
    },

    ...mapState(['layers'])
  },

  mounted () {
    this.loadNetworkData({ vm: this })
  },

  methods: {

    doIncZoom () {
      this.mapControls = this.$refs.map.onZoomChange(1)
    },

    doDecZoom () {
      this.mapControls = this.$refs.map.onZoomChange(-1)
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
      this.mapReady = false
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
      this.recalcPixelsPoints({ vm: this })
      this.mapReady = true
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
      this.positionLayersToCenter(size)
    },

    ...mapActions([ 'createLayer', 'loadNetworkData', 'recalcPixelsPoints' ])
  }

}
</script>

<style>
  .map-controls-position__right-center {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
