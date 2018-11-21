
import DrawerPrimitives from './DrawerPrimitives'

export default class Drawer {
  constructor () {
    this.ctx = null

    this.layer = ''

    this.methods = {
      '1': this.point01,
      '2': this.point02,
      '3': this.point03,
      '4': this.polyline01,
      '5': this.polyline02,
      '6': this.polyline03
    }

    this.size = {
      width: 0,
      height: 0
    }

    this.drawerPrimitives = new DrawerPrimitives()

    this.effects = []
  }

  addEffect (effect) {
    this.drawerPrimitives.addEffect(effect)
    return this
  }

  removeEffect (effect) {
    this.drawerPrimitives.removeEffect(effect)
    return this
  }

  setLayer (layer) {
    this.layer = layer
    return this
  }

  setContext (ctx) {
    this.ctx = ctx
    this.drawerPrimitives.setContext(ctx)
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

  // point (options) {
  //   this.ctx.fillStyle = options.fillStyle
  //   this.ctx.fillRect(options.x, options.y, options.w, options.h)
  //   return this
  // }

  point01 (options) {
    this.drawerPrimitives.point({
      fillStyle: 'green',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  point02 (options) {
    this.drawerPrimitives.polyline({
      fillStyle: 'red',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  point03 (options) {
    this.drawerPrimitives.point({
      fillStyle: 'blue',
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  polyline01 (options) {
    this.drawerPrimitives.polyline({
      fillStyle: 'red',
      strokeStyle: 'orangered',
      lineWidth: 4,
      points: options.points.map((point) => { return point.pixels })
    })
    return this
  }

  polyline02 (options) {
    this.drawerPrimitives.polyline({
      fillStyle: 'yellow',
      strokeStyle: 'green',
      lineWidth: 5,
      points: options.points.map((point) => { return point.pixels })
    })
    return this
  }

  polyline03 (options) {
    this.drawerPrimitives.polyline({
      fillStyle: 'red',
      strokeStyle: 'orange',
      lineWidth: 3,
      points: options.points.map((point) => { return point.pixels })
    })
    return this
  }
}
