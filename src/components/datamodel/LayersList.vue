<template>
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
</template>

<script>

import {createNamespacedHelpers} from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('model')

export default {
  name: 'LayersList',
  data () {
    return {}
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

    ...mapGetters(['layers'])
  },

  methods: {
    setLayerData (layer) {
      this.setLayer({layer, vm: this})
    },
    ...mapActions(['setLayer'])
  }

}
</script>

<style>
</style>
