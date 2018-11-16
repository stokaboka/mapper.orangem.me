
export default class Drawer {
  constructor () {
    this.ctx = null

    this.layer = ''

    this.methods = {
      '0': this.point00,
      '1': this.point01,
      '2': this.point02,
      '3': this.polyline01,
      '4': this.polyline02,
      '5': this.polyline03
    }

    this.size = {
      width: 0,
      height: 0
    }
  }

  setLayer (layer) {
    this.layer = layer
    return this
  }

  setContext (ctx) {
    this.ctx = ctx
    return this
  }

  setSize (size) {
    this.size = size
    return this
  }

  clear () {
    this.ctx.clearRect(0, 0, this.size.width, this.size.height)
    return this
  }

  drawObjects (objects) {
    for (const object of objects) {
      this.drawObject(object)
    }
  }

  drawObject (object) {
    if (this.methods[object.type]) {
      this.methods[object.type].call(this, object)
    } else {
      console.log(`Draw functiom not defined for type "${object.type}"`)
    }
  }

  point (options) {
    this.ctx.fillStyle = options.fillStyle
    this.ctx.fillRect(options.x, options.y, options.w, options.h)
    return this
  }

  point00 (options) {
    this.point({
      fillStyle: 'magenta',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  point01 (options) {
    this.point({
      fillStyle: 'red',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  point02 (options) {
    this.point({
      fillStyle: 'blue',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  polyline01 (options) {
    this.point({
      fillStyle: 'orangered',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  polyline02 (options) {
    this.point({
      fillStyle: 'orange',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 8,
      h: 16
    })
    return this
  }

  polyline03 (options) {
    this.point({
      fillStyle: 'green',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }
}
