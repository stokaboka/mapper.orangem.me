<template>
  <q-layout view="hHh LpR fff">

    <q-layout-header>

      <q-toolbar color="primary">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Left Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Mapper
          <div slot="subtitle">The Mapper is a high performance mapping system v{{ $q.version }}</div>
        </q-toolbar-title>

        <q-tabs>
          <q-route-tab slot="title" icon="view_quilt" to="/about" replace hide="icon" label="About" />
          <q-route-tab slot="title" icon="view_day" to="/map" replace hide="icon" label="Map" />
          <q-route-tab slot="title" icon="view_day" to="/settings" replace label="Settings" />
        </q-tabs>

      </q-toolbar>

    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        inset-delimiter
        highlight>

          <q-collapsible icon="layers" label="Слои">
            <div>
              <q-list no-border>
                <q-item
                  v-for="layer in xLayers"
                  :key="layer.id">
                  <q-item-main>
                    <q-checkbox v-model="layer.visible" :label="layer.label" @input="setLayer(layer)" />
                  </q-item-main>
                </q-item>
                <q-item>
                  <q-item-main>
                    <q-checkbox v-model="$dataProvider.selectionLayerVisible" label="Selection" />
                  </q-item-main>
                </q-item>
              </q-list>

            </div>
          </q-collapsible>

        <q-item-separator />

          <q-collapsible icon="perm_identity" label="Second">
            <div>
              Content 1
            </div>
          </q-collapsible>

        <q-item-separator />

          <q-collapsible icon="shopping_cart" label="Third">
            <div>
              Content 2
            </div>
          </q-collapsible>

      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>

import { openURL } from 'quasar'
import {createNamespacedHelpers} from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('network')

export default {
  name: 'Main',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },

  computed: {
    xLayers () {
      return this.layers.map((layer) => {
        return {...layer}
      })
    },

    ...mapGetters(['layers'])
  },

  methods: {
    openURL,
    ...mapActions(['setLayer'])
  }
}
</script>

<style>
</style>
