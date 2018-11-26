/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

export default class RotateColorEffect {
  constructor () {
    this.target = 'style'
    this.prop = 'color'
  }

  do (style) {
    const _r = style.substr(1, 2)
    const _g = style.substr(3, 2)
    const _b = style.substr(5, 2)
    const r = _g
    const g = _b
    const b = _r
    // console.log(style, `#${r}${g}${b}`)
    return `#${r}${g}${b}`
  }
}
