
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

const setLayer = ({ commit }, layer) => {
  commit('setLayer', layer)
  commit('reindexLayers')
}

export {loadLayers, setLayer}
