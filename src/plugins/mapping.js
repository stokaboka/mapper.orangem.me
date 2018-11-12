/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

import MappingArea from '../lib/mapper/MappingArea'
import {GeoPoint} from '../lib/mapper/Mercator'

const mappingArea = new MappingArea()
  .setGeoPoint(new GeoPoint(39.849086, 57.303309))
  .setZoom(12)

export default ({ Vue }) => {
  Vue.prototype.$mapping = mappingArea
}
