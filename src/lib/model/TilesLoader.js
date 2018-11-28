/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

import ImagesCache from './ImagesCache'

export default class TilesLoader {
  constructor () {
    this.vue = null
    this.mapping = null
    this.dataProvider = null

    this.grid = null

    /**
     * session images cache
     * @type {ImagesCache}
     */
    this.cache = new ImagesCache()

    /**
     * loaded tiless collection
     * @type {{}}
     */
    this.loaded = {}

    this.counter = {
      images: 0,
      complete: 0,
      errors: 0
    }

    this.size = {width: 0, height: 0}

    /**
     * graphics context
     * @type {null}
     */
    this.ctx = null

    this.busy = false

    this.waitTimerTimeout = 500
    this.waitTimer = false
  }

  init (vue) {
    this.vue = vue
    this.mapping = this.vue.$mapping
    this.dataProvider = this.vue.$dataProvider

    return this
  }

  setSize (width, height) {
    this.size = { width, height }
    return this
  }

  clearLoader () {
    this.loaded = {}
    this.counter = {
      images: 0,
      complete: 0,
      errors: 0
    }

    return this
  }

  clearGraphics () {
    if (this.ctx) {
      this.ctx.fillStyle = 'gray'
      this.ctx.fillRect(0, 0, this.size.width, this.size.height)
    }

    return this
  }

  clearCache () {
    this.cache.clear()
    return this
  }

  setContext (ctx) {
    this.ctx = ctx
    return this
  }

  start () {
    this.grid = this.mapping.getGrid()
    this.loadTiles()
    return this
  }

  emit (event, playload) {
    if (playload) {
      this.vue.$emit(event, playload)
    } else {
      this.vue.$emit(event)
    }
  }

  onImageLoadedFinish (sendProgress) {
    this.counter.complete = 0
    this.counter.errors = 0

    for (const tile in this.loaded) {
      if (this.loaded[tile] === 1) {
        this.counter.complete++
      }
      if (this.loaded[tile] === 0) {
        this.counter.errors++
      }
    }

    if (this.counter.complete + this.counter.errors === this.counter.images) {
      if (this.counter.errors > 0) {
        const self = this
        if (!this.waitTimer) {
          this.waitTimer = setTimeout(() => {
            self.loadTiles()
          }, this.waitTimerTimeout)
        }
      } else {
        this.emit('load-tiles-complete')
      }
    } else {
      if (sendProgress) {
        this.emit('load-tiles-progress', this.counter)
      }
    }
  }

  onImageLoadedComplete (tile) {
    this.loaded[tile] = 1
    this.busy = false
    this.onImageLoadedFinish(true)
  }

  onImageLoadedError (tile) {
    this.loaded[tile] = 0
    this.busy = false
    this.onImageLoadedFinish(false)
  }

  loadTiles () {
    if (this.waitTimer) {
      clearTimeout(this.waitTimer)
    }

    this.counter.images = this.grid.size.x * this.grid.size.y
    this.counter.complete = 0
    this.counter.errors = 0

    for (let x = 0; x < this.grid.size.x; x++) {
      for (let y = 0; y < this.grid.size.y; y++) {
        this.loadTile(x, y)
      }
    }

    this.emit('load-tiles-started')
  }

  loadTile (x, y) {
    let self = this

    const tileX = this.grid.begin.x + x
    const tileY = this.grid.begin.y + y
    const tile = `${tileX}-${tileY}`
    const zoom = this.mapping.getZoom()

    if (this.loaded[tile]) {
      return
    }

    if (this.cache.exist(zoom, tile)) {
      const cachedImage = this.cache.get(zoom, tile)
      this.ctx.drawImage(cachedImage, x * 256, y * 256)
      // this.loaded[tile] = 1
      console.log(`draw from images cache ${tile}`)
      this.onImageLoadedComplete(tile)
    } else {
      const img = new Image()

      img.addEventListener('load', function (event) {
        self.ctx.drawImage(this, x * 256, y * 256)
        // self.loaded[tile] = 1
        self.cache.put(zoom, tile, this)
        self.onImageLoadedComplete(tile)
      })

      img.addEventListener('error', function (event) {
        self.onImageLoadedError(tile)
      })

      this.busy = true
      img.src = this.mapping.getTileImageFileName(tileX, tileY)
    }
  }
}
