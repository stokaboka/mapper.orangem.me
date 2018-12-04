<template>
  <div>
    <q-btn-dropdown :label="deviceGroup.name">
      <!-- dropdown content -->
      <q-list link>
        <q-item v-for="dg in deviceGroups" :key="dg.id" v-close-overlay @click.native="onClick(dg)">
          <q-item-main>
            <q-item-tile label>
              {{dg.name}}
            </q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>

import {createNamespacedHelpers} from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('model')

export default {
  name: 'DeviceGroups',
  data () {
    return {}
  },

  mounted () {
    this.getDeviceGroups({vm: this})
  },

  computed: {
    ...mapGetters(['deviceGroups', 'deviceGroup'])
  },

  methods: {
    onClick (dg) {
      this.setDeviceGroup({value: dg, vm: this})
    },
    ...mapActions(['getDeviceGroups', 'setDeviceGroup'])
  }

}
</script>

<style>
</style>
