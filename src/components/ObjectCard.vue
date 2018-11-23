<template>
  <q-card>
    <q-card-title>
      <span>{{type}}</span>
    </q-card-title>
    <q-card-separator />
    <q-card-main>
      <q-icon :name="icon" ></q-icon>
      <span>{{id}}</span>
      <span>{{label}}</span>
      <span>{{type}}</span>
    </q-card-main>
  </q-card>
</template>

<script>
export default {
  name: 'ObjectCard',
  data () {
    return {}
  },
  props: {
    id: String,
    label: String,
    type: String,
    icon: String
  }
}
</script>

<style>
</style>
