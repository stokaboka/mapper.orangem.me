let area = null

const getRandomPoint = () => {
  const size = {
    lon: area.rb.lon - area.lt.lon,
    lat: area.rb.lat - area.lt.lat
  }
  const rnd = {
    lon: Math.random() * size.lon,
    lat: Math.random() * size.lat
  }
  return {
    lon: area.lt.lon + rnd.lon,
    lat: area.lt.lat + rnd.lat
  }
}

const getRandomPolyline = (n) => {
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    out[i] = getRandomPoint()
  }
  return out
}

const getRandomTypeObject = (n) => {
  return Math.round(Math.random() * n, 0)
}

const createObject = () => {
  const out = {
    type: getRandomTypeObject(4),
    points: null
  }

  switch (out.type) {
    case 0 : // point 1
    case 1 : // point 2
      out.points = getRandomPoint()
      break
    case 2 : // polyline 1
    case 3 : // polyline 2
    case 4 : // polyline 1
      out.points = getRandomPolyline(5 * out.type)
  }

  return out
}

const generateObjects = ({ getters, commit }) => {
  area = getters.area

  let layers = new Array(getters.numLayers)

  for (let l = 0; l < getters.numLayers; l++) {
    let layer = new Array(getters.numObjectsPerLayer)

    for (let o = 0; o < getters.numObjectsPerLayer; o++) {
      let obj = createObject()
      layer[o] = obj
    }

    layers[l] = layer
  }

  commit('setLayers', layers)
}

const createLayer = ({ commit }, objects) => {
  commit('addLayer', objects)
}

export {createLayer, generateObjects}
