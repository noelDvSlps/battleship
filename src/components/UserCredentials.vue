<template class="template-class">
  <h1>BATTLESHIP</h1>

  <form @submit.prevent="signInOrSignUp" style="display: flex; flex-direction: column; width: 100%">
    <label for="">Username</label>
    <input id="username" type="text" required v-model="username" />
    <label for="">Password</label>
    <input required v-model="password" id="password" type="password" autocomplete="on" />
    <div v-if="signInWindow === false" >
      <label for="" style="display: block">Confirm Password</label>
      <input
        required
        v-model="confirmPassword"
        id="confirmPassword"
        type="password"
        autocomplete="on"
        style="width: 100%;"
      />
    </div>
   

    <button type="submit" @click="signInOrSignUp" style="margin-top: 20px">
      {{ this.loading ? 'Loading...' : this.signInWindow ? 'Sign In' : 'Sign Up' }}
    </button>
    <div style="text-align: right; margin-top: 10px">
      <a @click="changeBtnCaption">{{ !this.signInWindow ? 'Already have an account? Click here' : 'Don\'t have an account? Click here' }}</a>
    </div>
  </form>
</template>
<script>
export default {
  emits: ['signIn'],
  props: ['props'],
  name: 'UserCredentials',

  data() {
    return {
      loading: false,
      signInWindow: true,
      btnCaption: 'Sign In',
      username: '',
      password: '',
      confirmPassword: '',
      timeStamp: 0
    }
  },
  methods: {
    getTimestampInSeconds() {
      return Math.floor(Date.now() / 1000)
    },
    changeBtnCaption() {
      this.signInWindow = !this.signInWindow
    },
    async signInOrSignUp() {
      this.loading = true
      // 👇🏾 you need to wait two second to invoke this function again / also prevents twice form submission
      const newTimeStamp = this.getTimestampInSeconds()
      if (newTimeStamp - this.timeStamp < 2) {
        return
      }
      this.timeStamp = newTimeStamp
      // 👆🏾 you need to wait two second to invoke this function again / also prevents twice form submission

      const username = this.username
      const password = this.password
      const confirmPassword = this.confirmPassword
      console.log(this.props.userInfo)
      try {
        if (!this.signInWindow) {
          const result = await this.signUp(username, password, confirmPassword)
          const parsedResult = JSON.parse(result)
         
          if (parsedResult.error) {
            alert('username already exist')
            throw new Error(parsedResult.error)
          } 

          await this.signIn(username, password)
        } else {
          await this.signIn(username, password)
        }
        this.loading = false
      } catch (e) {
       
        this.loading = false
        throw new Error(e)
      }
    },

    // {"success":false,"error":{"index":0,"code":11000,"keyPattern":{"username":1},"keyValue":{"username":"noel"}}}

    signUp(username, password, confirmPassword, createdAt = Date.now()) {
      console.log(this.props)
      if (password.trim() === "") {
        alert('password cannot be empty')
        return
      }
      if (password !== confirmPassword) {
        alert('password not the same')
        return
      }
      return fetch(this.props.baseURL + '/users/register', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ username, password, createdAt })
      })
      .then(async (response) => {
        const json_response = await response.json()
        if (!response.ok) {
          throw new Error(json_response)
        }
        return JSON.stringify(json_response)
      })
    },

    async signIn(username, password) {
      let response = await fetch(this.props.baseURL + '/users', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
      
     
      const jsonResponse = await (response.json())
        
          if (!response.ok) {
            alert(jsonResponse.message)
            this.loading = false
            throw new Error('jsonResponse.message')
          }
          
          localStorage.setItem('token', jsonResponse.token)
          localStorage.setItem('userInformation', JSON.stringify(jsonResponse.userInformation))
          this.$emit("signIn", jsonResponse.userInformation)
          this.$router.push('/battleground')
         
       
    }
  },
  mounted() {
    const maybeUser = JSON.parse(localStorage.getItem('userInformation'))
    if (maybeUser) {
      this.userInfo = maybeUser
      this.$router.push('/battleground')
    }
  }
}
</script>
