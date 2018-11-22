const layers = (state) => {
  return state.layers
}

const layersVisible = (state) => {
  return state.layersVisible
}

const indexOfLayer = (state) => (id) => {
  return state.layers.findIndex((element) => {
    return element.id === id
  })
}

const numLayers = (state) => {
  return state.layers.length
}

const layersReady = (state) => {
  return state.layersReady
}

const mapReady = (state) => {
  return state.mapReady
}

const ready = (state) => {
  return state.layersReady && state.mapReady
}

export {layers, layersVisible, indexOfLayer, numLayers, layersReady, mapReady, ready}
