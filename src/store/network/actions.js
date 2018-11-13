
const getRandomPoint = (vm, area) => {
  const size = {
    lon: area.rb.lon - area.lt.lon,
    lat: area.rb.lat - area.lt.lat
  }

  const rnd = {
    lon: Math.random() * size.lon,
    lat: Math.random() * size.lat
  }

  let geo = {
    lon: area.lt.lon + rnd.lon,
    lat: area.lt.lat + rnd.lat
  }
  // geo = {
  //   lon: 39.849086,
  //   lat: 57.303309
  // }
  // geo = {
  //   lon: 39.877582,
  //   lat: 57.308744
  // }

  // const abspixels = vm.$mapping.geoPointToPixelsPoint(geo)
  const pixels = vm.$mapping.geoPointToRelativePixelsPoint(geo)

  return {geo, pixels}
}

const getRandomPolyline = (n, vm, area) => {
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    out[i] = getRandomPoint(vm, area)
  }
  return out
}

const getRandomTypeObject = (n) => {
  return Math.round(Math.random() * n, 0)
}

const createObject = (id, vm, area) => {
  const out = {
    id: id,
    type: getRandomTypeObject(1),
    points: null
  }

  switch (out.type) {
    case 0 : // point 1
    case 1 : // point 2
      out.points = getRandomPoint(vm, area)
      break
    case 2 : // polyline 1
    case 3 : // polyline 2
    case 4 : // polyline 1
      out.points = getRandomPolyline(out.type, vm, area)
      break
  }

  return out
}

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
  let out = new Array(points.length)
  for (let i = 0; i < points.length; i++) {
    out[i] = recalcPoint(points[i], vm)
  }
  return out
}

const recalcObject = (object, vm) => {
  let points
  switch (object.type) {
    case 0 : // point 1
    case 1 : // point 2
      points = recalcPoint(object.points, vm)
      break
    case 2 : // polyline 1
    case 3 : // polyline 2
    case 4 : // polyline 1
      points = recalcPolyline(object.points, vm)
  }

  return Object.assign(
    {},
    object,
    {
      points
    })
}

const generateObjects = ({ getters, commit }, {vm}) => {
  let area = getters.area

  let layers = new Array(getters.numLayers)

  for (let l = 0; l < getters.numLayers; l++) {
    let objects = new Array(getters.numObjectsPerLayer)

    for (let o = 0; o < getters.numObjectsPerLayer; o++) {
      let object = createObject(`${l}-${o}`, vm, area)
      objects[o] = object
    }

    layers[l] = {
      id: `${l}`,
      title: `Title ${l}`,
      description: `Description ${l}`,
      objects
    }
  }
  //
  // console.log('generateObjects')
  // console.log(layers)
  // console.log('--------------------------')

  commit('setLayers', layers)
}

const recalcPixelsPoints = ({ getters, commit }, {vm}) => {
  let layers = getters.layers
  let la = new Array(getters.numLayers)
  for (let l = 0; l < getters.numLayers; l++) {
    let objects = new Array(getters.numObjectsPerLayer)
    for (let o = 0; o < getters.numObjectsPerLayer; o++) {
      objects[o] = recalcObject(layers[l].objects[o], vm)
    }
    la[l] = Object.assign({}, layers[l], {objects})
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

export {createLayer, generateObjects, recalcPixelsPoints}
