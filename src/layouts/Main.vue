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

          <q-collapsible opened icon="layers" label="Слои">
            <div>
              <q-list no-border>
                <q-item
                  v-for="layer in xLayers"
                  :key="layer.id">
                  <q-item-main>
                    <q-checkbox v-model="layer.visible" :label="layer.label" @input="setLayerData(layer)" />
                  </q-item-main>
                </q-item>
                <q-item>
                  <q-item-main>
                    <q-checkbox v-model="selectionLayerVisible" label="Selection"/>
                  </q-item-main>
                </q-item>
              </q-list>

            </div>
          </q-collapsible>

        <q-item-separator />

        <q-collapsible opened icon="category" label="Объект">
            <object-card
              v-if="selectedObject"
              v-bind="selectedObject"
            >
            </object-card>
        </q-collapsible>

        <q-item-separator />

          <q-collapsible icon="edit" label="Редактор">
            <div>
              Редактор
            </div>
          </q-collapsible>

        <q-item-separator />

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
import ObjectCard from '../components/ObjectCard'
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('model')

export default {
  name: 'Main',
  components: {ObjectCard},

  mounted () {
    this.getDeviceGroups({vm: this})
  },

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

    selectionLayerVisible: {
      get () {
        return this.$store.getters['model/selectionLayerVisible']
      },
      set (value) {
        this.$store.commit('model/setSelectionLayerVisible', value)
      }
    },

    ...mapGetters(['layers', 'selectedObject', 'deviceGroups'])
  },

  methods: {
    openURL,
    setLayerData (layer) {
      this.setLayer({layer, vm: this})
      // this.$dataProvider.setLayer(layer)
    },
    ...mapMutations(['setSelectionLayerVisible', 'setSelectedObject']),
    ...mapActions(['setLayer', 'getDeviceGroups'])
  }
}
</script>

<style>
</style>
