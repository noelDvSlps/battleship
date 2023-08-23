<template>
  <div id="main-container">
    <h1>{{ $route.path }}</h1>
    <router-view
      :props="{ userInfo: this.userInfo, baseURL: this.baseURL, difficulties: this.difficulties }"
      @show-top-ten="windows.topTen = true"
      @quit-battleship="quitBattleship"
      @get-user-info="getUserInfo"
      @exit-top-ten="windows.topTen = false"
    >
    </router-view>

    <!-- <user-credentials
      
      v-if="windows.logIn === true"
      :props="{ baseURL: this.baseURL }"
    ></user-credentials> -->

    <top-ten
      :props="{ baseURL: this.baseURL, difficulties: this.difficulties }"
      v-if="windows.topTen === true"
      @exit-top-ten="windows.topTen = false"
    >
    </top-ten>

    <!-- <app-table
      v-if="windows.playground === true"
      :props="{ userInfo: this.userInfo, baseURL: this.baseURL, difficulties: this.difficulties }"
      @show-top-ten="windows.topTen = true"
      @quit-battleship="quitBattleship"
    ></app-table> -->
  </div>
</template>

<script>
import UserCredentials from './components/UserCredentials.vue'
import TopTen from './components/TopTen.vue'
import AppTable from './components/AppTable.vue'
export default {
  name: 'App',
  components: {
    UserCredentials,
    TopTen,
    AppTable
  },

  data() {
    return {
      windows: {
        logIn: true,
        playground: false,
        topTen: false,
        gameOver: false
      },
      difficulties: [],
      baseURL: 'http://localhost:3000',
      userInfo: {},
      loginSuccess: false
    }
  },
  async mounted() {
    try {
      this.difficulties = await this.getDifficulties()
    } catch (e) {
      alert(e)
      throw new Error(e)
    }

    const maybeUser = JSON.parse(localStorage.getItem('userInformation'))
    if (maybeUser) {
      this.userInfo = maybeUser
      this.windows.logIn = false
      this.windows.playground = true
    }
  },
  methods: {
    getUserInfo(userInfo) {
      this.userInfo = userInfo
      this.loginSuccessful()
    },
    loginSuccessful() {
      this.loginSuccess = true
      this.windows.logIn = false
      this.windows.playground = true
    },
    quitBattleship() {
      localStorage.clear()
      this.windows.logIn = true
      this.windows.playground = false
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
