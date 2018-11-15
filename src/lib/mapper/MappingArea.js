/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

// const TilesCalculator = require('./TilesCalculator')

import TilesCalculator from './TilesCalculator'
import Piper from '../Piper'

import axios from 'axios'

class MappingArea {
  constructor () {
    this.geoPoint = null

    this.areaSizeWidth = 6
    this.areaSizeHeight = 6

    this.beginTile = {x: 0, y: 0}
    this.beginTilePixels = {x: 0, y: 0}

    this.tilesLoaderUrl = 'http://localhost:3000/mapper'

    this.halfAreaSizeWidth = Math.ceil(this.areaSizeWidth / 2)
    this.halfAreaSizeHeight = Math.ceil(this.areaSizeHeight / 2)

    this.tilesCalculator = new TilesCalculator()

    this.point = null
    this.typePoint = null

    this.minZoom = 2
    this.maxZoom = 19

    this.tilesUrl = 'http://localhost:3000/images'

    this.piper = new Piper()
  }

  getZoom () {
    return this.tilesCalculator.zoom
  }
  setZoom (value) {
    this.tilesCalculator.zoom = value
    return this
  }

  changeZoom (value) {
    if (this.minZoom < this.getZoom() && this.getZoom() < this.maxZoom) {
      this.setZoom(this.getZoom() + value)
    }
    return this
  }

  getMapControlsInfo () {
    return {
      zoom: this.getZoom(),
      incDisable: this.getZoom() >= this.maxZoom,
      decDisable: this.getZoom() <= this.minZoom
    }
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
          // console.log('Tiles loader started')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  setGeoPoint (point) {
    this.point = point
    this.geoPoint = point
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

  geoPointToPixelsPoint (geoPoint) {
    return this.tilesCalculator.meterToPixels(this.tilesCalculator.geoToMeter(geoPoint))
  }

  pixelsPointToRelativePixelsPoint (pixelsPoint) {
    return {
      x: pixelsPoint.x - this.beginTilePixels.x,
      y: pixelsPoint.y - this.beginTilePixels.y
    }
  }

  geoPointToRelativePixelsPoint (geoPoint) {
    const pixelsPoint = this.geoPointToPixelsPoint(geoPoint)
    return this.pixelsPointToRelativePixelsPoint(pixelsPoint)
  }

  getGrid () {
    let tilePoint = null
    let geoPoint = null

    this.setGeoPoint(this.geoPoint)

    this.piper.context(this.tilesCalculator)

    switch (this.typePoint) {
      case 'GEO':

        geoPoint = this.point

        tilePoint = this.piper
          .clear()
          .value(this.point)
          .pipe([
            this.tilesCalculator.geoToMeter,
            this.tilesCalculator.meterToPixels,
            this.tilesCalculator.pixelToTile
          ])
          .calc()
          .value()

        break

      case 'METER':

        geoPoint = this.piper
          .clear()
          .value(this.point)
          .pipe([
            this.tilesCalculator.meterToGeo
          ])
          .calc()
          .value()

        tilePoint = this.piper
          .clear()
          .value(this.point)
          .pipe([
            this.tilesCalculator.meterToPixels,
            this.tilesCalculator.pixelToTile
          ])
          .calc()
          .value()

        break

      case 'PIXEL':

        geoPoint = this.piper
          .clear()
          .value(this.point)
          .pipe([
            this.tilesCalculator.pixelsToMeter,
            this.tilesCalculator.meterToGeo
          ])
          .calc()
          .value()

        tilePoint = this.piper
          .clear()
          .value(this.point)
          .pipe([
            this.tilesCalculator.pixelToTile
          ])
          .calc()
          .value()

        break

      case 'TILE':

        geoPoint = this.piper
          .clear()
          .value(this.point)
          .pipe([
            this.tilesCalculator.tileToPixels,
            this.tilesCalculator.pixelsToMeter,
            this.tilesCalculator.meterToGeo
          ])
          .calc()
          .value()

        tilePoint = this.point

        break

      default:
        return null
    }

    this.beginTile = {
      x: tilePoint.x - this.halfAreaSizeWidth,
      y: tilePoint.y - this.halfAreaSizeHeight
    }

    this.beginTilePixels = this.tilesCalculator.tileToPixels(this.beginTile)

    this.doLoadTiles(geoPoint, 0)

    return {
      begin: this.beginTile,
      size: {
        x: this.areaSizeWidth,
        y: this.areaSizeHeight
      },
      z: this.getZoom()
    }
  }

  onPan (position) {
    const piper = new Piper()

    this.geoPoint = piper
      .context(this.tilesCalculator)
      .value(this.geoPoint)
      .pipe([
        this.tilesCalculator.geoToMeter,
        this.tilesCalculator.meterToPixels
      ])
      .calc()
      .minus(position.x, 'x')
      .minus(position.y, 'y')
      .pipe([
        this.tilesCalculator.pixelsToMeter,
        this.tilesCalculator.meterToGeo
      ])
      .calc()
      .value()
  }

  getTileImageFileName (x, y) {
    return `${this.tilesUrl}/${this.tilesCalculator.zoom}/${x}-${y}.png`
  }
}

// module.exports = MappingArea
// module.exports.default = MappingArea
export default MappingArea
