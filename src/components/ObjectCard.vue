<template>
  <q-card class="object-card__size">
    <q-card-title>
      <q-icon :name="icon"  slot="right" ></q-icon>
      <span>{{type}}</span>
    </q-card-title>
    <q-card-separator />
    <q-card-main>

      <dl class="horizontal">

        <dt class="text-left">ID</dt>
        <dd>{{id}}</dd>

        <dt class="text-left">Name</dt>
        <dd>{{label}}</dd>

        <dt class="text-left">Type</dt>
        <dd>{{type}}</dd>

      </dl>

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
  .object-card__size {
    min-width: 300px;
  }
</style>
