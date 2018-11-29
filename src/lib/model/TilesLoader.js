/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

import ImagesCache from './ImagesCache'

export default class TilesLoader {
  constructor () {
    this.vue = null
    this.mapping = null
    this.dataProvider = null

    this.debug = false

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
      errors: 0,
      loading: 0
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

    this.log('INIT', 'Complete')

    return this
  }

  log (type, message) {
    if (this.debug) {
      console.log(`*** TilesLoader:: [${type}] ${message}`)
    }
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

    this.log('CLEAR', 'Counter cleared')

    return this
  }

  clearGraphics () {
    if (this.ctx) {
      this.ctx.fillStyle = 'gray'
      this.ctx.fillRect(0, 0, this.size.width, this.size.height)
    }
    this.log('CLEAR', 'Context cleared')
    return this
  }

  clearCache () {
    this.cache.clear()
    this.log('CLEAR', 'Cache cleared')
    return this
  }

  setContext (ctx) {
    this.ctx = ctx
    this.log('SET', 'Context initialized')
    return this
  }

  start () {
    this.grid = this.mapping.getGrid()
    this.emit('load-tiles-started')
    this.loadTiles()
    this.log('START', 'load started')
    return this
  }

  emit (event, playload) {
    if (playload) {
      this.vue.$emit(event, playload)
    } else {
      this.vue.$emit(event)
    }
  }

  startWaitTimer () {
    const self = this
    this.log('ON LOADED FINISH', 'start wait timer')

    if (this.waitTimer) {
      clearTimeout(this.waitTimer)
    }

    this.waitTimer = setTimeout(() => {
      self.loadTiles()
    }, this.waitTimerTimeout)
  }

  onImageLoadedFinish (sendProgress) {
    this.counter.complete = 0
    this.counter.errors = 0

    this.log('ON LOADED FINISH', `complete: ${sendProgress} `)

    for (const tile in this.loaded) {
      if (this.loaded[tile] === 1) {
        this.counter.complete++
      }
      if (this.loaded[tile] === 0) {
        this.counter.errors++
      }
    }

    this.log('ON LOADED FINISH', `load-tiles-progress ${sendProgress} loading:${this.counter.loading} complete:${this.counter.complete} errors:${this.counter.errors} total:${this.counter.images}`)

    if (this.counter.complete + this.counter.errors === this.counter.images) {
      if (this.counter.errors > 0) {
        if (this.waitTimer) {
          if (this.counter.loading === 0) {
            this.startWaitTimer()
          } else {
            this.log('ON LOADED FINISH', 'wait timer already started')
          }
        } else {
          this.startWaitTimer()
        }
      } else {
        this.log('ON LOADED FINISH', 'load-tiles-complete')
      }
    }

    if (this.counter.complete === this.counter.images) {
      this.emit('load-tiles-complete')
    } else {
      this.emit('load-tiles-progress', this.counter)
    }
  }

  onImageLoadedComplete (tile) {
    this.loaded[tile] = 1
    this.busy = false
    this.counter.loading--
    this.onImageLoadedFinish(true)
  }

  onImageLoadedError (tile) {
    this.loaded[tile] = 0
    this.busy = false
    this.counter.loading--
    this.onImageLoadedFinish(false)
  }

  loadTiles () {
    this.log('LOAD TILES', 'start loadTiles')

    this.counter.images = this.grid.size.x * this.grid.size.y
    this.counter.complete = 0
    this.counter.errors = 0
    this.counter.loading = 0

    for (let x = 0; x < this.grid.size.x; x++) {
      for (let y = 0; y < this.grid.size.y; y++) {
        this.loadTile(x, y)
      }
    }
  }

  loadTile (x, y) {
    // let self = this

    const tileX = this.grid.begin.x + x
    const tileY = this.grid.begin.y + y
    const tile = `${tileX}-${tileY}`
    const zoom = this.mapping.getZoom()

    if (this.loaded[tile]) {
      this.log('LOAD TILE +++', `tile ${tile} already loaded `)
      return
    } else {
      this.log('LOAD TILE', `start load tile ${tile}`)
    }

    if (this.cache.exist(zoom, tile)) {
      this.loadTileImageFromCache(x, y, tile, tileX, tileY, zoom)
    } else {
      this.loadTileImage(x, y, tile, tileX, tileY, zoom)
    }
  }

  loadTileImage (x, y, tile, tileX, tileY, zoom) {
    let self = this

    const img = new Image()

    img.addEventListener('load', function (event) {
      self.ctx.drawImage(this, x * 256, y * 256)
      self.cache.put(zoom, tile, this)
      self.log('LOAD TILE ***', `tile ${tile} loaded`)
      self.onImageLoadedComplete(tile)
    })

    img.addEventListener('error', function (event) {
      self.log('LOAD TILE !!!', `tile ${tile} error`)
      self.onImageLoadedError(tile)
    })

    this.busy = true
    this.counter.loading++
    img.src = this.mapping.getTileImageFileName(tileX, tileY)
  }

  loadTileImageFromCache (x, y, tile, tileX, tileY, zoom) {
    const cachedImage = this.cache.get(zoom, tile)
    this.ctx.drawImage(cachedImage, x * 256, y * 256)
    this.log('LOAD TILE', `tile ${tile} get from cache`)
    this.counter.loading++
    this.onImageLoadedComplete(tile)
  }
}
