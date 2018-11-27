/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

export default class ImagesCache {
  constructor () {
    this.data = {}
  }

  clear () {
    this.data = {}
    return this
  }

  put (zoom, tile, img) {
    if (!this.data[zoom]) {
      this.data[zoom] = {}
    }
    this.data[zoom][tile] = img
  }

  get (zoom, tile) {
    if (this.data[zoom]) {
      if (this.data[zoom][tile]) {
        return this.data[zoom][tile]
      }
    }
  }

  exist (zoom, tile) {
    if (this.data[zoom]) {
      if (this.data[zoom][tile]) {
        return true
      }
    }
    return false
  }
}
