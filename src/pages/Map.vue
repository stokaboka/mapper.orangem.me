<template>
  <q-page>

    <div
      class="mapper-layers"
      :style="layersStyle"
      v-touch-pan.prevent="onTouchPan"
    >

      <map-layer
        :m-width-tiles="tilesByX"
        :m-height-tiles="tilesByY"
        :m-zoom="zoom"
        :m-geo-point="geoPoint"
      >
      </map-layer>

    </div>

  </q-page>
</template>

<script>

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
      layersLeft: 0
    }
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

    setRoute (geoPoint, zoom) {
      let newRoute = Object.assign(
        {},
        this.$route.params,
        geoPoint,
        {zoom}
      )
      this.$router.push({name: 'map', params: newRoute})
    },

    onTouchPan (event) {
      console.log(event)
      this.layersLeft += event.delta.x
      this.layersTop += event.delta.y
    }

  },

  watch: {
    '$route' (to, from) {
      console.log('Map')
      console.log(from)
      console.log(to)
      // this.initTiles()
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
