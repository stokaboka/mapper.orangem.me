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
  // let out = new Array(points.length)
  for (let i = 0; i < points.length; i++) {
    // out[i] = recalcPoint(points[i], vm)
    points[i] = recalcPoint(points[i], vm)
  }
  return points
  // return out
}

const recalcObject = (object, vm) => {
  // let points
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
  // return Object.assign(
  //   {},
  //   object,
  //   {
  //     points
  //   })
}

const recalcPixelsPoints = ({ getters, commit }, {vm}) => {
  let layers = getters.layers
  let la = new Array(layers.length)

  for (let l = 0; l < layers.length; l++) {
    // let layer = layers[l]
    // let objects = new Array(layer.objects.length)

    for (let o = 0; o < layers[l].objects.length; o++) {
      layers[l].objects[o] = recalcObject(layers[l].objects[o], vm)
    }

    la[l] = layers[l]
    // la[l] = Object.assign({}, layer, {objects: layer.objects})
  }

  //
  // console.log('recalcPixelsPoints')
  // console.log(la)
  // console.log('--------------------------')

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
