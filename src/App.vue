<template>
 
  <user-credentials v-if="userCredentials === true"></user-credentials>
 

</template>

<script>

import UserCredentials from './components/UserCredentials.vue'

export default {
  name: 'App',
  components: {
    UserCredentials
  },
  data (){
    return {
      userCredentials: true,
      
    }
  }
}
</script>
