<template>
  <!-- <app-table @click-box="clickBox" :tableRow="row" :tableCol="col"></app-table> -->
  <app-table></app-table>
</template>

<script>
import AppTable from './components/AppTable.vue'


export default {
  name: 'App',
  components: {
    AppTable
  }
}
</script>
