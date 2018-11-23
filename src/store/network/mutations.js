import Vue from 'vue'

const setLayers = (state, layers) => {
  state.layers = layers
}

const reindexLayers = (state) => {
  state.layers = state.layers.map((layer, index) => {
    return Object.assign(layer, {index})
  })
}

const setLayersReady = (state, value) => {
  state.layersReady = value
}

const setMapReady = (state, value) => {
  state.mapReady = value
}

const setLayer = (state, layer) => {
  Vue.set(state.layers, layer.index, layer)
}

const setSelectionLayerVisible = (state, visible) => {
  state.selectionLayerVisible = visible
}

export {
  setLayers,
  setLayer,
  reindexLayers,

  setMapReady,
  setLayersReady,

  setSelectionLayerVisible
}
