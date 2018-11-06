/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

// const TilesCalculator = require('./TilesCalculator')

import TilesCalculator from './TilesCalculator'
import axios from 'axios'

class MappingArea {
  constructor (pAreaSize) {
    this.areaSize = 6
    if (pAreaSize) {
      this.areaSize = pAreaSize
    }

    this.tilesLoaderUrl = 'http://localhost:3000/mapper'

    this.halfAreaSize = Math.ceil(this.areaSize / 2)

    this.tilesCalculator = new TilesCalculator()

    this.point = null
    this.typePoint = null
  }

  setAreaSize (value) {
    this.areaSize = value
    this.halfAreaSize = Math.ceil(this.value / 2)
    return this
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
        x: tilePoint.x - this.halfAreaSize,
        y: tilePoint.y - this.halfAreaSize
      },
      size: {
        x: this.areaSize,
        y: this.areaSize
      },
      z: this.getZoom()
    }
  }
}

// module.exports = MappingArea
// module.exports.default = MappingArea
export default MappingArea
