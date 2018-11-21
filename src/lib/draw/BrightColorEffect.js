/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

export default class BrightColorEffect {
  constructor (r, g, b) {
    this.target = 'style'
    this.prop = 'color'
    this.r = r
    this.g = g
    this.b = b
  }

  do (style) {
    let r = parseInt(style.substr(1, 2), 16) + this.r
    let g = parseInt(style.substr(3, 2), 16) + this.g
    let b = parseInt(style.substr(5, 2), 16) + this.b
    r = (r > 255 ? 255 : r).toString(16)
    g = (g > 255 ? 255 : g).toString(16)
    b = (b > 255 ? 255 : b).toString(16)
    console.log(style, `#${r}${g}${b}`)
    return `#${r}${g}${b}`
  }
}
