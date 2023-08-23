import { createRouter, createWebHistory } from 'vue-router'
import UserCredentialsVue from '../components/UserCredentials.vue'
import AppTableVue from '../components/AppTable.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: UserCredentialsVue
  },
  {
    path: '/battleground',
    name: 'Battleground',
    component: AppTableVue
  }
]

// eslint-disable-next-line no-undef
const router = createRouter({ history: createWebHistory(''), routes })

export default router
