
const loadLayers = ({ commit }, {vm}) => {
  commit('setLayersReady', false)
  vm.$dataProvider.loadLayers()
    .then(() => {
      commit('setLayers', vm.$dataProvider.getLayers())
      commit('reindexLayers')
      commit('setLayersReady', true)
    })
    .catch((error) => {
      console.log(error)
    })
}

const setLayer = ({ commit }, {layer, vm}) => {
  commit('setLayer', layer)
  commit('reindexLayers')
  vm.$dataProvider.setLayer(layer)
}

export {loadLayers, setLayer}
