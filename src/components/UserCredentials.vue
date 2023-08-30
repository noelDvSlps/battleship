<template class="template-class">
  <h1>BATTLESHIP</h1>
  <h2>{{ this.loading ? "Loading..." : "" }}</h2>
  <form @submit.prevent="signInOrSignUp" style="display: flex; flex-direction: column; width: 100%">
    <label for="">Username</label>
    <input id="username" type="text" required v-model="username" />
    <label for="">Password</label>
    <input required v-model="password" id="password" type="password" autocomplete="on" />
    <div v-if="signInWindow === false">
      <label for="" style="display: block">Confirm Password</label>
      <input
        required
        v-model="confirmPassword"
        id="confirmPassword"
        type="password"
        autocomplete="on"
      />
    </div>
    <div style="text-align: right; margin-top: 10px">
      <a @click="changeBtnCaption">{{ !this.signInWindow ? 'Sign In' : 'Register' }}</a>
    </div>

    <button type="submit" @click="signInOrSignUp" style="margin-top: 20px">
      {{ this.signInWindow ? 'Sign In' : 'Sign Up' }}
    </button>
  </form>
</template>
<script>
export default {
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

      try {
        if (!this.signInWindow) {
          this.loading = true
         await this.signUp(username, password, confirmPassword)
         await this.signIn(username, password)
          this.loading = false
        
      } else {
        this.loading = true
        await this.signIn(username, password)
         this.loading = false
      }
      } catch (e) {
        throw new Error(e)
      }
      
    },
    
    signUp(username, password, confirmPassword) {
      if (password !== confirmPassword) {
        alert('password not the same')
        return
      }
      return fetch(this.props.baseURL + '/users/register', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ username, password })
        }).then(async (response) => {
          const json_response = await response.json()
        if(!response.ok) {
            const isArray = (Array.isArray(json_response))
          //if it is an array, there is an error
          if (isArray) {
            let errors = []
            json_response[0].errors.issues.map(issue => {
              errors.push(issue.message)
            })
            alert(errors)
            throw new Error(errors)
          }
          alert(JSON.stringify(json_response))
          throw new Error(json_response)
        }
       
        return(JSON.stringify(json_response))
      })
    },

    signIn(username, password) {
      
      fetch(this.props.baseURL + '/users', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ username, password })
            })
        .then((response) => {
          if (!response.ok) {
            alert('login failed')
            throw new Error('login failed')
          }
          return response.json()
        })
        .then((response) => {
          localStorage.setItem('token', response.token)
          localStorage.setItem('userInformation', JSON.stringify(response.userInformation))
          this.$router.push("/battleground")
        })
    }
  },
  mounted() {
    const maybeUser = JSON.parse(localStorage.getItem('userInformation'))
    if (maybeUser) {
      this.userInfo = maybeUser
      this.$router.push("/battleground")
    }
   
  }
}
</script>
