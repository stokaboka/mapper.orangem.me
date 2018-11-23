// import { keyBy } from 'lodash'
import Vue from 'vue'

// const reindexLayersCollection = (layers) => {
//   return layers.map((layer, index) => {
//     return Object.assign({}, layer, {index})
//   })
// }

const setLayers = (state, layers) => {
  state.layers = layers
}

const reindexLayers = (state) => {
  state.layers = state.layers.map((layer, index) => {
    return Object.assign(layer, {index})
  })
}

const setLayersVisible = (state, layers) => {
  state.layersVisible = state.layers.filter((layer) => {
    return layer.visible
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
  // console.log('mutation setLayer')
  // console.log(state.layers)
}

export {
  setLayers,
  reindexLayers,
  setLayersVisible,
  setMapReady,
  setLayersReady,
  setLayer
}
