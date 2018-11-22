
const loadLayers = ({ commit }, {vm}) => {
  commit('setLayersReady', false)
  vm.$dataProvider.loadLayers()
    .then(() => {
      commit('setLayers', vm.$dataProvider.getLayers())
      commit('setLayersIndex', vm.$dataProvider.getLayers())
      commit('setLayersReady', true)
    })
    .catch((error) => {
      console.log(error)
    })
}

export {loadLayers}
