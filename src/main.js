import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

let vm = createApp(App).use(router)

vm.mount('#app')
