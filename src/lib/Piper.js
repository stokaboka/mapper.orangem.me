/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

export default class Piper {
  constructor () {
    this.functions = []
    this.val = null
  }

  pipe (functions) {
    this.functions = functions
  }

  calc (value) {
    if (this.functions) {
      this.val = value
      for (const func of this.functions) {
        this.val = func.call(this, this.val)
      }
      this.functions = []
    }
    return this
  }

  value () {
    return this.val
  }
}
