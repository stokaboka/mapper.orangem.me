/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

const lineSearchPrecision = 5

const distanceFromPointToLine = function (point, line) {
  const x0 = point.x
  const y0 = point.y
  const x1 = line.x1
  const y1 = line.y1
  const x2 = line.x2
  const y2 = line.y2

  if (x1 === x2 && y1 === y2) {
    return false
  }

  let d1 = (y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1
  d1 = Math.abs(d1)

  let d2y = (y2 - y1)
  let d2x = (x2 - x1)
  let d2 = Math.sqrt(d2y * d2y + d2x * d2x)

  let d = d1 / d2

  return d
}

const onLine = function (point, points) {
  for (let i = 1; i < points.length; i++) {
    const line = {
      x1: points[i - 1].pixels.x,
      y1: points[i - 1].pixels.y,
      x2: points[i].pixels.x,
      y2: points[i].pixels.y
    }

    const lineBox = getLineBox(line)

    if (onBox(lineBox, point)) {
      const d = distanceFromPointToLine(point, line)
      // console.log(`distance ${d}`)
      if (d <= lineSearchPrecision) {
        return true
      }
    }
  }
  return false
}

const onBox = function (box, point) {
  if (box.x <= point.x && point.x <= box.x + box.width) {
    if (box.y <= point.y && point.y <= box.y + box.height) {
      return true
    }
  }
  return false
}

const getLineBox = function (line) {
  return {
    x: Math.min(line.x1, line.x2),
    y: Math.min(line.y1, line.y2),
    width: Math.abs(line.x1 - line.x2),
    height: Math.abs(line.y1 - line.y2)
  }
}

const getFindBox = function (pixels) {
  return {
    x: pixels.x - 5,
    y: pixels.y - 5,
    width: 10,
    height: 10
  }
}

export {
  onLine,
  onBox,
  getFindBox
}
