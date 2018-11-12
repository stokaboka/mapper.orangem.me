<template>
  <div class="column">
    <q-btn
      round
      size="md"
      color="white"
      text-color="blue-gray"
      class="q-title text-weight-bold mapper-map-control-button"
      @click="$emit('increment')"
      :disable="incDisable"
    >{{incLabel}}</q-btn>
    <q-btn
      round
      size="md"
      color="white"
      text-color="blue-gray"
      class="q-title text-weight-bold mapper-map-control-button"
      @click="$emit('decrement')"
      :disable="decDisable"
    >{{decLabel}}</q-btn>
  </div>
</template>

<script>
export default {
  name: 'MapControls',
  data () {
    return {
      incLabel: '+',
      decLabel: '-'
    }
  },

  props: {
    incDisable: false,
    decDisable: false,
    minValue: 2,
    maxValue: 19
  }
}
</script>

<style>
  .mapper-map-control-button {
    margin: 3px 0;
  }
</style>
