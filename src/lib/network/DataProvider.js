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
