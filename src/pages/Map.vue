<template>
  <q-page ref="page" class="no-scroll">

    <q-resize-observable @resize="onResize"></q-resize-observable>

    <div
      class="absolute"
      :style="layersStyle"
      v-touch-pan.prevent="onTouchPan"
      @click="onClick"
    >

      <map-layer
        ref="map"
        id="MAP"
        :width="canvasWidth"
        :height="canvasHeight"
        @load-tiles-started="onLoadTilesStarted"
        @load-tiles-progress="onLoadTilesProgress"
        @load-tiles-complete="onLoadTilesComplete"
      ></map-layer>

      <objects-layer
        v-for="layer in layers"
        :key="layer.id"
        :id="layer.id"
        :label="layer.label"
        :visible="layer.visible"
        :width="canvasWidth"
        :height="canvasHeight"
        @object-layer-redraw="onObjectLayerRedraw"
      >
      </objects-layer>

      <selection-layer
        ref="selection"
        :width="canvasWidth"
        :height="canvasHeight"
        @on-selected-object-click="onSelectedObjectClick"
      >
      </selection-layer>

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

    <!--<q-popover touch-position v-model="showObjectInfoPopOver">-->

      <!--<object-card-->
        <!--v-if="selectedObject"-->
        <!--v-bind="selectedObject">-->
      <!--</object-card>-->

    <!--</q-popover>-->

  </q-page>
</template>

<script>

import MapLayer from '../components/MapLayer'
import MapControls from '../components/MapControls'
import ObjectsLayer from '../components/ObjectsLayer'
import SelectionLayer from '../components/SelectionLayer'
import {createNamespacedHelpers} from 'vuex'
import ObjectCard from '../components/ObjectCard'

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('network')

let flags = {
  touchPan: false
}

export default {
  name: 'Map',
  components: {ObjectCard, SelectionLayer, ObjectsLayer, MapControls, MapLayer},
  data () {
    return {

      canvasWidth: this.$mapping.areaSizeWidth * 256,
      canvasHeight: this.$mapping.areaSizeHeight * 256,

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

      showObjectInfoPopOver: false,
      selectedObject: null
    }
  },

  computed: {

    layersStyle () {
      return {
        'left': `${this.layersPosition.left}px`,
        'top': `${this.layersPosition.top}px`
      }
    },

    ...mapGetters([
      'layers',
      'ready',
      'layersReady',
      'mapReady',
      'selectionLayerVisible'
    ])

  },

  mounted () {
    this.$dataProvider.setMapper(this.$mapping)
    this.loadLayers({vm: this})
  },

  methods: {

    setRoute () {
      let newRoute = Object.assign(
        {},
        this.$route.params,
        this.$mapping.geoPoint,
        {zoom: this.$mapping.getZoom()}
      )
      this.$router.push({name: 'map', params: newRoute})
    },

    doIncZoom () {
      this.mapControls = this.$refs.map.onZoomChange(1)
    },

    doDecZoom () {
      this.mapControls = this.$refs.map.onZoomChange(-1)
    },

    positionLayersToCenter (pageSize) {
      const pageHeight = pageSize ? pageSize.height : this.$refs.page.$el.offsetHeight
      const pageWidth = pageSize ? pageSize.width : this.$refs.page.$el.offsetWidth

      this.layersPosition = {
        left: Math.round((pageWidth - this.canvasWidth) / 2, 10),
        top: Math.round((pageHeight - this.canvasHeight) / 2, 10)
      }
    },

    onLoadTilesStarted () {
      // this.layersPosition.left = 0
      // this.layersPosition.top = 0
      this.mapLayer.loading.progress = true
      this.setLayersReady(false)
      this.setMapReady(false)
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
      this.setRoute()
      this.setMapReady(true)
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
        flags.touchPan = true

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

        flags.touchPan = false
      }
    },

    addToSelection (object) {
      this.$dataProvider.addToSelection(object)
      this.$refs.selection.redraw()
    },

    showObjectInfo (object) {
      console.log('showObjectInfo')
      console.log(object)
      this.showObjectInfoPopOver = true
      this.selectedObject = object
    },

    async onObjectClick (objectInfo, addToSelection) {
      await this.$dataProvider.getObjectInfo(objectInfo)
        .then((response) => {
          if (this.selectionLayerVisible && addToSelection) {
            this.addToSelection(objectInfo.object)
          }
          this.showObjectInfo(objectInfo.object)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    onSelectedObjectClick (objectInfo) {
      this.$dataProvider.removeFromSelection(objectInfo.object)
      this.$refs.selection.redraw()
    },

    onObjectLayerRedraw () {
      this.$refs.selection.redraw()
    },

    onResize (size) {
      this.positionLayersToCenter(size)
    },

    /**
     * on mouse click event handler
     * @param event
     */
    onClick (event) {
      this.showObjectInfoPopOver = false

      if (flags.touchPan) {
        return
      }

      // relative pixels coordinate
      const pixels = {
        x: event.offsetX,
        y: event.offsetY
      }

      let findSelectionObject = null

      // test objects in selection layer
      if (this.selectionLayerVisible && event.ctrlKey) {
        findSelectionObject = this.$dataProvider.findObjectByRelativePixelsInSelectionLayer(pixels)
      }

      if (findSelectionObject) {
        // console.log('click on selection', findSelectionObject.object.id)
        // action on selected object
        this.onSelectedObjectClick(findSelectionObject)
      } else {
        // test objects in layers
        const findObject = this.$dataProvider.findObjectByRelativePixels(pixels)

        if (findObject) {
          // console.log('click on layer', findObject.object.id)
          // action on selected object
          this.onObjectClick(findObject, event.ctrlKey)
        }
      }
    },

    ...mapActions(['loadLayers']),
    ...mapMutations(['setLayersReady', 'setMapReady'])
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
