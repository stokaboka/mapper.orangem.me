import { keyBy } from 'lodash'

const setLayers = (state, layers) => {
  state.layers = layers
}

const setLayersVisible = (state, layers) => {
  state.layersVisible = state.layers.filter((layer) => {
    return layer.visible
  })
}

const setLayersIndex = (state, layers) => {
  state.layersIndex = keyBy(layers, (layer) => { return layer.id })
}

const setLayersReady = (state, value) => {
  state.layersReady = value
}

const setMapReady = (state, value) => {
  state.mapReady = value
}

const setLayer = (state, layer) => {
  state.layersIndex[layer.id] = Object.assign({}, layer)
}

export {setLayers, setLayersIndex, setLayersVisible, setMapReady, setLayersReady, setLayer}
