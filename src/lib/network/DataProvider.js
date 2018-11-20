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

    this.selectionLayer = []

    this.lineSearchPrecision = 5
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

  distanceFromPointToLine (point, line) {
    const x0 = point.x
    const y0 = point.y
    const x1 = line.x1
    const y1 = line.y1
    const x2 = line.x2
    const y2 = line.y2

    if (x1 === x2 && y1 === y2) {
      return false
    }

    let d1 = (y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1
    d1 = Math.abs(d1)

    let d2y = (y2 - y1)
    let d2x = (x2 - x1)
    let d2 = Math.sqrt(d2y * d2y + d2x * d2x)

    let d = d1 / d2

    return d
  }

  onLine (point, points) {
    for (let i = 1; i < points.length; i++) {
      const d = this.distanceFromPointToLine(
        point,
        {
          x1: points[i - 1].pixels.x,
          y1: points[i - 1].pixels.y,
          x2: points[i].pixels.x,
          y2: points[i].pixels.y
        })
      // console.log(`distance ${d}`)
      if (d <= this.lineSearchPrecision) {
        return true
      }
    }
    return false
  }

  onBox (box, point) {
    if (box.x <= point.x && point.x <= box.x + box.width) {
      if (box.y <= point.y && point.y <= box.y + box.height) {
        return true
      }
    }
    return false
  }

  getFindBox (pixels) {
    return {
      x: pixels.x - 5,
      y: pixels.y - 5,
      width: 10,
      height: 10
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
    this.selectionLayer = this.selectionLayer.map((element) => {
      return element.id !== object.id
    })
  }

  findObjectByRelativePixelsInSelectionLayer (pixels) {
    const object = this.findObjectByRelativePixelsInLayer(pixels, this.selectionLayer)
    if (object) {
      return {layer: {id: 'selection'}, object}
    } else {
      return null
    }
  }

  findObjectByRelativePixelsInLayer (pixels, layerData) {
    const box = this.getFindBox(pixels)
    const object = layerData.find((element) => {
      if (Array.isArray(element.points)) {
        return this.onLine(pixels, element.points)
      } else {
        return this.onBox(box, element.points.pixels)
      }
    })

    return object
  }

  findObjectByRelativePixels (pixels) {
    for (const layer of this.layers) {
      const layerData = this.getLayerData(layer.id)
      const object = this.findObjectByRelativePixelsInLayer(pixels, layerData)

      if (object) {
        return {layer, object}
      }
    }

    return null
  }

  prepareLayers (layers) {
    return layers
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
