const layers = (state) => {
  return state.layers
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

const selectionLayerVisible = (state) => {
  return state.selectionLayerVisible
}

const selectedObject = (state) => {
  return state.selectedObject
}

const deviceGroups = (state) => {
  return state.deviceGroups
}

export {
  layers,
  layersReady,
  mapReady,
  ready,
  selectionLayerVisible,
  selectedObject,

  deviceGroups
}
