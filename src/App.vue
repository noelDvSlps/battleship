<template>
  <div id="main-container">
    <router-view
      :props="{ baseURL: this.baseURL, difficulties: this.difficulties, userInfo: this.userInfo }"
    >
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      difficulties: [],
      baseURL: 'https://battleship-api-wgpw.onrender.com/api/v1',
      // baseURL: 'http://localhost:5000/api/v1',
      userInfo: {},
      loginSuccess: false
    }
  },
  async mounted() {
    
    try {
      this.difficulties = await this.getDifficulties()
      this.difficulties = this.difficulties.data
    } catch (e) {
      alert("SERVER FAILED")
      throw new Error(e)
    }

    const maybeUser = JSON.parse(localStorage.getItem('userInformation'))
    if (maybeUser) {
      this.userInfo = maybeUser
      // this.windows.logIn = false
      // this.windows.playground = true
    }
  },
  methods: {
    getUserInfo(userInfo) {
      this.userInfo = userInfo
      this.loginSuccessful()
    },
    loginSuccessful() {
      this.loginSuccess = true
      // this.windows.logIn = false
      // this.windows.playground = true
    },
    quitBattleship() {
      localStorage.clear()
      this.userInfo ={}
      // this.windows.logIn = true
      // this.windows.playground = false
    },
    getDifficulties() {
      return fetch(this.baseURL + '/difficulties').then((response) => {
        if (!response.ok) {
          throw new Error('could not get difficulties')
        }
        return response.json()
      })
    }
  }
}
</script>
<style scoped>
#main-container {
  position: relative;
  z-index: 100;
}
</style>
