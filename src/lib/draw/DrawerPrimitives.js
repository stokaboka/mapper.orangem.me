/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

export default class DrawerPrimitives {
  constructor () {
    this.ctx = null

    this.defaults = {
      fillStyle: '#555555',
      strokeStyle: '#333333',
      lineWidth: 5
    }
  }

  setContext (ctx) {
    this.ctx = ctx
    return this
  }

  point (options) {
    this.setStyle(options)
    this.ctx.fillRect(options.x, options.y, options.w, options.h)
    return this
  }

  line (options) {
    this.setStyle(options)
    this.ctx.beginPath()
    this.ctx.moveTo(options.points[0].x, options.points[0].y)
    this.ctx.lineTo(options.points[1].x, options.points[1].y)
    this.ctx.stroke()
    return this
  }

  polyline (options) {
    this.setStyle(options)
    this.ctx.beginPath()
    this.ctx.moveTo(options.points[0].x, options.points[0].y)
    for (let i = 1; i < options.points.length; i++) {
      this.ctx.lineTo(options.points[i].x, options.points[i].y)
    }
    this.ctx.stroke()
    return this
  }

  setStyle (options) {
    this.ctx.fillStyle = options.fillStyle ? options.fillStyle : this.defaults.fillStyle
    this.ctx.strokeStyle = options.strokeStyle ? options.strokeStyle : this.defaults.strokeStyle
    this.ctx.lineWidth = options.lineWidth ? options.lineWidth : this.defaults.lineWidth
  }
}
