<template>
  <div id="main-container">
    <div>{{ this.message }}</div>
    <router-view
    v-if = server
    @logOut = "logOut"
    @signIn = "signIn"
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
      server: false,
      message: "Checking Server...",
      difficulties: [],
      baseURL: 'https://battleship-api-wgpw.onrender.com/api/v1',
      // baseURL: 'http://localhost:5000/api/v1',
      userInfo: {},
      loginSuccess: false
    }
  },
  
  async mounted() {
    const attempts = 20
    let server = false
        for (let i = 0; i < attempts; i++) {
            server = await this.isServerOk()
            const attempt = (`Checking Server... Attempt # ${i + 1}/${attempts}`)
            this.message = `${attempt}...${server ? "😁 Success" : "☹️ Failed"} `
            this.message = ((i+1) === attempts) ? "☹️ Cannot access server, please try again later" : this.message
            if(server){
              setTimeout(()=>{
                this.message = ""
                this.server = true
              }, 1000)
              break
            }
        }
    if(!server)  {
      throw new Error("Cannot connect to server")
      
    }
    this.difficulties = await this.getDifficulties()
    this.difficulties = this.difficulties.data
    const maybeUser = JSON.parse(localStorage.getItem('userInformation'))
    if (maybeUser) {
      this.userInfo = maybeUser
    }
  },
  methods: {
    async isServerOk(){
    try {
      await fetch(this.baseURL)
    } catch (err){
      return false
    }
        return true
  },
    logOut(){
      this.userInfo= {}
    },
    signIn(userInfo){
      this.userInfo= userInfo
    },
    getUserInfo(userInfo) {
      this.userInfo = userInfo
      this.loginSuccessful()
    },
    loginSuccessful() {
      this.loginSuccess = true
    },
    quitBattleship() {
      localStorage.clear()
      this.userInfo ={}
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
