/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

export default class BorderEffect {
  constructor (color, border) {
    this.target = 'draw'
    this.color = color
    this.border = border
    this.ctx = null

    this.delta = 10
  }

  setContext (ctx) {
    this.ctx = ctx
    return this
  }

  do (options) {
    if (this.ctx) {
      let x1 = 0
      let x2 = 0
      let y1 = 0
      let y2 = 0

      this.ctx.strokeStyle = this.color
      this.ctx.lineWidth = this.border

      if (options.points) {
        x1 = Math.min(options.points[0].x, options.points[1].x)
        y1 = Math.min(options.points[0].y, options.points[1].y)

        x2 = Math.max(options.points[0].x, options.points[1].x)
        y2 = Math.max(options.points[0].y, options.points[1].y)

        x1 = options.points[0].x
        y1 = options.points[0].y
        x2 = options.points[1].x
        y2 = options.points[1].y

        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)

        this.ctx.stroke()
      } else {
        x1 = options.x
        y1 = options.y

        x2 = options.x + options.w
        y2 = options.y + options.h

        this.ctx.beginPath()
        this.ctx.moveTo(x1 - this.delta, y1 - this.delta)
        this.ctx.lineTo(x2 + this.delta, y1 - this.delta)
        this.ctx.lineTo(x2 + this.delta, y2 + this.delta)
        this.ctx.lineTo(x1 - this.delta, y2 + this.delta)
        this.ctx.lineTo(x1 - this.delta, y1 - this.delta)
        this.ctx.stroke()
      }
    }
  }
}
