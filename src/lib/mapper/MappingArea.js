/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

// const TilesCalculator = require('./TilesCalculator')

import Mapping from './Mapping'

import axios from 'axios'

class MappingArea extends Mapping {
  constructor (url) {
    super()
    this.tilesLoaderUrl = `${url}/mapper`
    this.tilesUrl = `${url}/images`
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

  getGrid () {
    let grid = super.getGrid()
    this.doLoadTiles(grid.geoPoint, 0)
    return grid
  }

  getTileImageFileName (x, y) {
    return `${this.tilesUrl}/${this.tilesCalculator.zoom}/${x}-${y}.png`
  }
}

// module.exports = MappingArea
// module.exports.default = MappingArea
export default MappingArea
