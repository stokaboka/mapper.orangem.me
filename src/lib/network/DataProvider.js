/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

import axios from 'axios'

export default class DataProvider {
  constructor (baseUrl) {
    this.mapper = null
    this.baseUrl = baseUrl
    this.layers = []

    // this.axios = axios.create()
    // this.axios.interceptors.response.use(
    //   (response) => {
    //     this.layers = response.data.layers
    //     return response
    //   },
    //   (error) => {
    //     return Promise.reject(error)
    //   }
    // )
  }

  responseComplete (response) {
    this.layers = response.data.layers
    return response
  }

  responseError (error) {
    return Promise.reject(error)
  }

  setMapper (mapper) {
    this.mapper = mapper
    return this
  }

  getLayers () {
    return this.layers
  }

  recalcPoint (point) {
    return Object.assign(
      {},
      point,
      {
        pixels: this.mapper.geoPointToRelativePixelsPoint(point.geo)
      }
    )
  }

  recalcPolyline (points) {
    return points.map(point => {
      return this.recalcPoint(point)
    })
  }

  recalcObject (object) {
    switch (object.type) {
      case 0 : // point 1
      case 1 : // point 2
        object.points = this.recalcPoint(object.points)
        break
      case 2 : // polyline 1
      case 3 : // polyline 2
      case 4 : // polyline 1
        object.points = this.recalcPolyline(object.points)
    }

    return object
  }

  recalcObjects (objects) {
    return objects.map(
      (object) => {
        return this.recalcObject(object)
      })
  }

  recalcLayers () {
    return this.layers.map(
      (layer) => {
        layer.objects = this.recalcObjects(layer.objects)
        return layer
      })
  }

  recalc () {
    this.layers = this.recalcLayers()
    return this
  }

  async load () {
    const url = `${this.baseUrl}/lon/${this.mapper.geoPoint.lon}/lat/${this.mapper.geoPoint.lat}/zoom/${this.mapper.getZoom()}`
    let response = await axios.get(url)
      .then((resp) => {
        console.log(resp)
      })
      .catch((err) => {
        console.log(err)
      })
    return response
  }
}
