
import DrawerPrimitives from './DrawerPrimitives'

export default class Drawer {
  constructor () {
    this.ctx = null
    this.layer = ''

    this.methods = {
      'communication': this.polyline01,
      'equipment': this.point01,
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
    // console.log(`clear ${this.layer}`)
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.size.width, this.size.height)
    }
    return this
  }

  drawObjects (objects) {
    if (this.ctx) {
      for (const object of objects) {
        this.drawObject(object)
      }
    }
    return this
  }

  drawObject (object) {
    if (this.ctx) {
      if (this.methods[object.type]) {
        this.methods[object.type].call(this, object)
      } else {
        console.log(`Draw functiom not defined for type "${object.type}"`)
      }
    }
    return this
  }

  point01 (options) {
    this.drawerPrimitives.point({
      fillStyle: options.color,
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  point02 (options) {
    this.drawerPrimitives.polyline({
      fillStyle: options.color,
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  point03 (options) {
    this.drawerPrimitives.point({
      fillStyle: options.color,
      x: options.points.pixels.x - 10 / 2,
      y: options.points.pixels.y - 10 / 2,
      w: 10,
      h: 10
    })
    return this
  }

  polyline01 (options) {
    this.drawerPrimitives.polyline({
      fillStyle: options.color,
      strokeStyle: options.color,
      lineWidth: 4,
      points: options.points.map((point) => { return point.pixels })
    })
    return this
  }

  polyline02 (options) {
    this.drawerPrimitives.polyline({
      fillStyle: options.color,
      strokeStyle: options.color,
      lineWidth: 5,
      points: options.points.map((point) => { return point.pixels })
    })
    return this
  }

  polyline03 (options) {
    this.drawerPrimitives.polyline({
      fillStyle: options.color,
      strokeStyle: options.color,
      lineWidth: 3,
      points: options.points.map((point) => { return point.pixels })
    })
    return this
  }
}
