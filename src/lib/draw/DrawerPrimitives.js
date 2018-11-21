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

    this.effects = []
  }

  addEffect (effect) {
    this.effects.push(effect)
  }

  removeEffect (effect) {
    this.effects.splice(this.effects.indexOf(effect), 1)
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

  applyStyleEffects (style) {
    for (const effect of this.effects) {
      if (effect.target === 'style' && effect.prop === 'color') {
        style = effect.do(style)
      }
    }
    return style
  }

  setStyle (options) {
    this.ctx.fillStyle = options.fillStyle ? options.fillStyle : this.defaults.fillStyle
    this.ctx.strokeStyle = options.strokeStyle ? options.strokeStyle : this.defaults.strokeStyle
    this.ctx.lineWidth = options.lineWidth ? options.lineWidth : this.defaults.lineWidth

    this.ctx.fillStyle = this.applyStyleEffects(this.ctx.fillStyle)
    this.ctx.strokeStyle = this.applyStyleEffects(this.ctx.strokeStyle)
  }
}
