/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

import axios from 'axios'

import {onLine, onBox, getFindBox} from './Geometry'

export default class DataProvider {
  constructor (baseUrl) {
    this.mapper = null
    this.baseUrl = baseUrl
    this.layers = []
    this.layersData = {}

    this.selectionLayer = []
    this.selectionLayerVisible = true
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

  setLayer (layer) {
    const idx = this.layers.findIndex((elem) => {
      return elem.id === layer.id
    })
    if (idx > -1) {
      this.layers[idx] = Object.assign(this.layers[idx], layer)
    }
  }

  existObjectIn (list, object) {
    const existObject = list.find((element) => {
      return element.id === object.id
    })
    if (existObject) {
      return true
    } else {
      return false
    }
  }

  /**
   * TODO - error on add exist object
   * @param object
   */
  addToSelection (object) {
    if (this.existObjectIn(this.selectionLayer, object)) {
      this.removeFromSelection(object)
    } else {
      this.selectionLayer = [...this.selectionLayer, object]
    }
  }

  removeFromSelection (object) {
    this.selectionLayer.splice(this.selectionLayer.indexOf(object), 1)
  }

  findObjectByRelativePixelsInSelectionLayer (pixels) {
    if (this.selectionLayerVisible) {
      const object = this.findObjectByRelativePixelsInLayer(pixels, this.selectionLayer)
      if (object) {
        return {layer: {id: 'selection'}, object}
      }
    }
    return null
  }

  findObjectByRelativePixelsInLayer (pixels, layerData) {
    const box = getFindBox(pixels)
    const object = layerData.find((element) => {
      if (Array.isArray(element.points)) {
        return onLine(pixels, element.points)
      } else {
        return onBox(box, element.points.pixels)
      }
    })

    return object
  }

  findObjectByRelativePixels (pixels) {
    for (const layer of this.layers) {
      if (layer.visible) {
        const layerData = this.getLayerData(layer.id)
        const object = this.findObjectByRelativePixelsInLayer(pixels, layerData)

        if (object) {
          return {layer, object}
        }
      }
    }
    return null
  }

  prepareSelectionLayer (layers) {
    return layers.filter((element) => {
      this.selectionLayer.find((sl) => {
        return sl.id === element.id
      })
    })
  }

  prepareLayersIdCollection (layers) {
    return layers.filter((element) => {
      return element.visible
    })
  }

  prepareLayers (layers) {
    return layers.map((element) => {
      return {
        ...element,
        visible: true
      }
    })
  }

  /**
   * TODO change method/variables names: load, layers
   * @param layer
   * @returns {Promise<AxiosResponse<any>>}
   */
  async loadLayer (layer) {
    let url = `${this.baseUrl}/lon/${this.mapper.geoPoint.lon}/lat/${this.mapper.geoPoint.lat}/zoom/${this.mapper.getZoom()}/layer/${layer}`

    let response = await axios.get(url)
      .then((resp) => {
        this.setLayerData(layer, resp.data.objects)
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
        this.layers = this.prepareLayers(resp.data)
        this.selectionLayer = this.prepareSelectionLayer(this.layers)
      })
      .catch((err) => {
        console.log(err)
        return err
      })
    return response
  }

  async getObjectInfo (objectInfo) {
    let url = `${this.baseUrl}/layer/${objectInfo.layer.id}/object/${objectInfo.object.id}`
    let response = await axios.get(url)
      .then((resp) => {
        return resp
      })
      .catch((err) => {
        console.log(err)
        return err
      })
    return response
  }
}
