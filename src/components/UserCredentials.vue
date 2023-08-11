<template class="template-class">
  <div  v-if="appTable === false" action="" style="display: flex; flex-direction: column">
    <label for="">Username</label>
    <input value="Just click Sign In"  id="username" type="text" />
    <label for="">Password</label>
    <input value="test" id="password" type="password" />
    <div v-if="registerWindow === true">
      <label for="">Confirm Password</label>
      <input id="confirmPassword" type="password" />
    </div>
    <button @click = "successLogin" style="margin-top: 20px">Sign In</button>
  </div>
  <app-table v-if="appTable === true"  ></app-table>

</template>
<script>
import AppTable from './AppTable.vue'

export default {
  name: 'UserCredentials',
  components: {
    AppTable
  },
  data() {
    return {
      registerWindow: false,
      appTable: false
    }
  },
  methods: {
  successLogin () {
    this.appTable = true
  }
}
}

</script>
