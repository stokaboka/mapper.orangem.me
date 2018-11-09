<template>
  <div class="column">
    <q-btn
      round
      size="md"
      @click="$emit('increment')"
    >+</q-btn>
    <q-btn
      round
      size="md"
      @click="$emit('decrement')"
    >-</q-btn>
  </div>
</template>

<script>
export default {
  name: 'MapControls',
  data () {
    return {}
  }
}
</script>

<style>
</style>
