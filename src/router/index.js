import { createRouter, createWebHistory } from 'vue-router'
import UserCredentialsVue from '../components/UserCredentials.vue'
import AppTableVue from '../components/AppTable.vue'
import TopTenVue from '../components/TopTen.vue'
import PageNotFoundVue from '../components/PageNotFound.vue'

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
  },
  {
    path: '/top-ten',
    name: 'TopTen',
    component: TopTenVue
  },
  {
    path: '/:pathMatch(.*)',
    name: 'PageNotFound',
    component: PageNotFoundVue
  }
]

// eslint-disable-next-line no-undef
const router = createRouter({ history: createWebHistory(''), routes })

export default router
