
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

const getDeviceGroups = ({ commit }, { vm }) => {
  vm.$dataProvider.loadDeviceGroups()
    .then((response) => {
      commit('setDeviceGroups', response)
    })
    .catch((error) => {
      console.log(error)
    })
}

const setDeviceGroup = ({ commit }, {value, vm}) => {
  commit('setDeviceGroup', value)
  const newRoute = Object.assign(
    {},
    vm.$route.params,
    value.point,
    {zoom: vm.$mapping.getZoom()}
  )
  vm.$router.push({name: 'map', params: newRoute})
}

export {loadLayers, setLayer, getDeviceGroups, setDeviceGroup}
