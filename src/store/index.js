import Vue from 'vue'
import Vuex from 'vuex'

import model from './model'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      model
    },

    strict: process.env.NODE_ENV !== 'production'
  })

  return Store
}
