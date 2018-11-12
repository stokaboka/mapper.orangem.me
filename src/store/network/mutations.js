const setLayers = (state, playload) => {
  state.layers = playload
}

const addLayer = (state, playload) => {
  state.layers.push(playload)
}

export {setLayers, addLayer}
