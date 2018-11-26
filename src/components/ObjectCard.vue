<template>
  <q-card class="object-card__size">
    <q-card-title>
      <q-icon :name="icon" slot="right" v-bind:style="iconStyle">
      </q-icon>
      <span>{{type}}</span>
    </q-card-title>
    <q-card-separator />
    <q-card-main>

      <dl class="horizontal">

        <dt class="text-left">ID</dt>
        <dd>{{id}}</dd>

        <dt class="text-left">Name</dt>
        <dd>{{label}}</dd>

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
    type: String,
    label: String,
    color: String,
    icon: String
  },

  computed: {
    iconStyle () {
      return {
        'color': this.color
      }
    }
  }
}
</script>

<style>
  .object-card__size {
    min-width: 200px;
  }
</style>
