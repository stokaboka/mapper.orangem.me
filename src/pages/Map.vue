<template>
  <q-page>

    <div
      class="mapper-layers"
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

  </q-page>
</template>

<script>

// import { debounce } from 'quasar'
import MapLayer from '../components/MapLayer'

export default {
  name: 'Map',
  components: {MapLayer},
  data () {
    return {
      zoom: 12,
      geoPoint: { lon: 39.849086, lat: 57.303309 },

      tilesByX: 6,
      tilesByY: 6,

      layersTop: 0,
      layersLeft: 0,

      startDragPosition: {left: 0, top: 0},

      startDragLayersPosition: {left: 0, top: 0}
    }
  },

  created () {
    // this.debouncedChangePosition = this.$lodash.debounce(this.onChangeLayersPosition, 500)
  },

  computed: {
    layersStyle () {
      return {
        'left': `${this.layersLeft}px`,
        'top': `${this.layersTop}px`,
        'width': `${this.canvasSize}px`,
        'height': `${this.canvasSize}px`
      }
    }
  },

  methods: {

    onLoadTilesStarted () {
      this.layersLeft = 0
      this.layersTop = 0
      this.$q.loadingBar.start()
    },

    onLoadTilesProgress (counter) {
      if (counter.images > 0) {
        const value = 100 * counter.complete / counter.images
        this.$q.loadingBar.increment(value)
      }
    },

    onLoadTilesComplete () {
      this.$q.loadingBar.stop()
    },

    dragLayers (delta) {
      this.layersLeft += delta.x
      this.layersTop += delta.y
    },

    onChangeLayersPosition (position) {
      this.$refs.map.onChangePosition(position)
    },

    /**
     * TODO
     * - - сохранить положение слоя при старте Pan
     * - по окончании вычислить дельту между началом и концом Pan
     * - пересчитьа дельту в гео координаты
     * - прибавть/вычесть гео-дельту из текущей гео-точки
     */

    onTouchPan (event) {
      this.dragLayers(event.delta)

      if (event.isFirst) {
        this.startDragLayersPosition = {
          left: this.layersLeft,
          top: this.layersTop
        }
      }

      if (event.isFinal) {
        const deltaPos = {
          x: this.layersLeft - this.startDragLayersPosition.left,
          y: this.layersTop - this.startDragLayersPosition.top
        }

        this.onChangeLayersPosition(deltaPos)
        // this.debouncedChangePosition(deltaPos)
      }
    }

  },

  watch: {
    '$route' (to, from) {
      // console.log('Map')
      // console.log(from)
      // console.log(to)
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
