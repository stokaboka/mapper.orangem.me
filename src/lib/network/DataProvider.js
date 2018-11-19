/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

import axios from 'axios'

export default class DataProvider {
  constructor (baseUrl) {
    this.mapper = null
    this.baseUrl = baseUrl
    this.layers = []
    this.layersData = {}
  }

  setMapper (mapper) {
    this.mapper = mapper
    return this
  }

  setLayers (value) {
    this.layers = value
    return this
  }

  getLayers () {
    return this.layers
  }

  setLayerData (layer, data) {
    this.layersData[layer] = data
  }

  getLayerData (layer) {
    if (this.layersData[layer]) {
      return this.layersData[layer]
    } else {
      return []
    }
  }

  inBox (box, point) {
    if (box.x <= point.x && point.x <= box.x + box.width) {
      if (box.y <= point.y && point.y <= box.y + box.height) {
        return true
      }
    }
    return false
  }

  findObjectByRelativePixels (pixels) {
    let box = {
      x: pixels.x - 5,
      y: pixels.y - 5,
      width: 10,
      height: 10
    }

    for (const layer of this.layers) {
      const layerData = this.getLayerData(layer.id)
      const object = layerData.find((element) => {
        if (Array.isArray(element.points)) {
          console.log(' --- polyline ---')
          return false
        } else {
          return this.inBox(box, element.points.pixels)
        }
      })

      if (object) {
        return {layer, object}
      }
    }

    return null
  }

  /**
   * TODO change metod/variables names: load, layers
   * @param layer
   * @returns {Promise<AxiosResponse<any>>}
   */
  async loadLayer (layer) {
    let url = `${this.baseUrl}/lon/${this.mapper.geoPoint.lon}/lat/${this.mapper.geoPoint.lat}/zoom/${this.mapper.getZoom()}/layer/${layer}`

    let response = await axios.get(url)
      .then((resp) => {
        // this.layersData[layer] = resp.data.objects
        this.setLayerData(layer, resp.data.objects)
        // return resp
      })
      .catch((err) => {
        console.log(err)
        return err
      })
    return response
  }

  async loadLayers () {
    let url = `${this.baseUrl}/layers`
    let response = await axios.get(url)
      .then((resp) => {
        this.layers = resp.data
      })
      .catch((err) => {
        console.log(err)
        return err
      })
    return response
  }
}
