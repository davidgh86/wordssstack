import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/config',
    component: () => import ('../views/Config.vue')
  },
  {
    path: '/inbox',
    component: () => import ('../views/StackPage.vue')
  },
  {
    path: '/',
    component: () => import ('../views/StackPage.vue')
  },
  {
    path: '/folder/:id',
    component: () => import ('../views/FolderPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
