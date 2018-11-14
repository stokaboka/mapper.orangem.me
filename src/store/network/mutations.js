const setLayers = (state, playload) => {
  state.layers = playload
}

const numLayers = (state, playload) => {
  state.numLayers = playload
}

const numObjectsPerLayer = (state, playload) => {
  state.numObjectsPerLayer = playload
}

const addLayer = (state, playload) => {
  state.layers.push(playload)
}

export {setLayers, addLayer, numLayers, numObjectsPerLayer}
