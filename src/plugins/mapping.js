/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

import MappingArea from '../lib/mapper/MappingArea'
import {GeoPoint} from '../lib/mapper/Mercator'

// localhost
const mappingBaseUrl = 'http://localhost:3333'

// orangem.me
// const mappingBaseUrl = 'http://orangem.me:3333'

// на реботе
// const mappingBaseUrl = ''

const mappingArea = new MappingArea(mappingBaseUrl)
  .setGeoPoint(new GeoPoint(39.849086, 57.303309))
  .setZoom(14)

export default ({ Vue }) => {
  Vue.prototype.$mapping = mappingArea
}
