
const loadLayers = ({ commit }, {vm}) => {
  commit('setLayersReady', false)
  vm.$dataProvider.loadLayers()
    .then(() => {
      commit('setLayers', vm.$dataProvider.getLayers())
      commit('reindexLayers')
      // commit('setLayersVisible')
      commit('setLayersReady', true)
    })
    .catch((error) => {
      console.log(error)
    })
}

const setLayer = ({ commit }, layer) => {
  commit('setLayer', layer)
  commit('reindexLayers')
  // commit('setLayersVisible')
}

export {loadLayers, setLayer}
