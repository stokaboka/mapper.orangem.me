<template>
  <q-layout view="hHh LpR fff">

    <q-layout-header>

      <q-toolbar color="amber" text-color="black">
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
          <div slot="subtitle">V-{{ $q.version }}</div>
        </q-toolbar-title>

        <q-tabs color="amber" text-color="black">
          <q-route-tab slot="title" icon="view_quilt" to="/about" replace hide="icon" label="About" ></q-route-tab>
          <q-route-tab slot="title" icon="view_day" to="/map" replace hide="icon" label="Map" ></q-route-tab>
          <q-route-tab slot="title" icon="view_day" to="/settings" replace label="Settings" ></q-route-tab>
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

        <q-collapsible opened icon="map" label="Группы устройств">
          <device-groups></device-groups>
        </q-collapsible>

        <q-item-separator />

        <q-collapsible opened icon="layers" label="Слои">
          <layers-list></layers-list>
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

// import { openURL } from 'quasar'
import {createNamespacedHelpers} from 'vuex'
import ObjectCard from '../components/ObjectCard'
import LayersList from '../components/datamodel/LayersList'
import DeviceGroups from '../components/datamodel/DeviceGroups'
const { mapGetters } = createNamespacedHelpers('model')

export default {
  name: 'Main',
  components: {DeviceGroups, LayersList, ObjectCard},

  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },

  computed: {
    ...mapGetters(['selectedObject'])
  },

  methods: {
    // openURL
  }
}
</script>

<style>
</style>
