/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

// const TilesCalculator = require('./TilesCalculator')

import TilesCalculator from './TilesCalculator'
import axios from 'axios'

class MappingArea {
  constructor (pAreaSizeWidth, pAreaSizeHeight) {
    this.areaSizeWidth = pAreaSizeWidth
    this.areaSizeHeight = pAreaSizeHeight

    this.tilesLoaderUrl = 'http://localhost:3000/mapper'

    this.halfAreaSizeWidth = Math.ceil(this.areaSizeWidth / 2)
    this.halfAreaSizeHeight = Math.ceil(this.areaSizeHeight / 2)

    this.tilesCalculator = new TilesCalculator()

    this.point = null
    this.typePoint = null
  }

  getZoom () {
    return this.tilesCalculator.zoom
  }
  setZoom (value) {
    this.tilesCalculator.zoom = value
    return this
  }

  doLoadTiles (geoPoint, reload) {
    if (geoPoint) {
      const url = `${this.tilesLoaderUrl}/lon/${geoPoint.lon}/lat/${geoPoint.lat}/zoom/${this.getZoom()}/reload/${reload}`
      axios.get(url,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((results) => {
          console.log(results)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  setGeoPoint (point) {
    this.point = point
    this.typePoint = 'GEO'
    return this
  }

  setMeterPoint (point) {
    this.point = point
    this.typePoint = 'METER'
    return this
  }

  setPixelPoint (point) {
    this.point = point
    this.typePoint = 'PIXEL'
    return this
  }

  setTilePoint (point) {
    this.point = point
    this.typePoint = 'TILE'
    return this
  }

  getGrid () {
    let tilePoint = null
    let geoPoint = null
    switch (this.typePoint) {
      case 'GEO':

        geoPoint = this.point

        tilePoint = this.tilesCalculator
          .pipe([
            this.tilesCalculator.geoToMeter,
            this.tilesCalculator.meterToPixels,
            this.tilesCalculator.pixelToTile
          ])
          .calc(this.point)
        break

      case 'METER':

        geoPoint = this.tilesCalculator
          .pipe([
            this.tilesCalculator.meterToGeo
          ]).calc(this.point)

        tilePoint = this.tilesCalculator
          .pipe([
            this.tilesCalculator.meterToPixels,
            this.tilesCalculator.pixelToTile
          ])
          .calc(this.point)
        break

      case 'PIXEL':

        geoPoint = this.tilesCalculator
          .pipe([
            this.tilesCalculator.pixelsToMeter,
            this.tilesCalculator.meterToGeo
          ]).calc(this.point)

        tilePoint = this.tilesCalculator
          .pipe([
            this.tilesCalculator.pixelToTile
          ])
          .calc(this.point)
        break

      case 'TILE':

        geoPoint = this.tilesCalculator
          .pipe([
            this.tilesCalculator.tileToPixels,
            this.tilesCalculator.pixelsToMeter,
            this.tilesCalculator.meterToGeo
          ]).calc(this.point)

        tilePoint = this.point
        break

      default:
        return null
    }

    this.doLoadTiles(geoPoint, 0)

    return {
      begin: {
        x: tilePoint.x - this.halfAreaSizeWidth,
        y: tilePoint.y - this.halfAreaSizeHeight
      },
      size: {
        x: this.areaSizeWidth,
        y: this.areaSizeHeight
      },
      z: this.getZoom()
    }
  }
}

// module.exports = MappingArea
// module.exports.default = MappingArea
export default MappingArea
