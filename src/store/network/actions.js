import axios from 'axios'

const recalcPoint = (point, vm) => {
  return Object.assign(
    {},
    point,
    {
      pixels: vm.$mapping.geoPointToRelativePixelsPoint(point.geo)
    }
  )
}

const recalcPolyline = (points, vm) => {
  return points.map(point => {
    return recalcPoint(point, vm)
  })
}

const recalcObject = (object, vm) => {
  switch (object.type) {
    case 0 : // point 1
    case 1 : // point 2
      object.points = recalcPoint(object.points, vm)
      break
    case 2 : // polyline 1
    case 3 : // polyline 2
    case 4 : // polyline 1
      object.points = recalcPolyline(object.points, vm)
  }

  return object
}

const recalcPixelsPoints = ({ getters, commit }, {vm}) => {
  let la = getters.layers.map(
    (layer) => {
      layer.objects = layer.objects.map(
        (object) => {
          return recalcObject(object, vm)
        })
      return layer
    })
  commit('setLayers', la)
}

const createLayer = ({ commit }, objects) => {
  commit('addLayer', objects)
}

const loadNetworkData = ({ commit }, {vm}) => {
  const srvUrl = 'http://localhost:3000/dp'
  const url = `${srvUrl}/lon/${vm.$mapping.geoPoint.lon}/lat/${vm.$mapping.geoPoint.lat}/zoom/${vm.$mapping.getZoom()}`

  return axios.get(url)
    .then(response => {
      commit('setLayers', response.data.layers)
    })
    .catch(error => {
      console.log(error)
      // commit('setError', error)
    })
}

export {createLayer, loadNetworkData, recalcPixelsPoints}
