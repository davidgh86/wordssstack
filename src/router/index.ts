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
    path: '/templates',
    component: () => import ('../views/TemplateEditor.vue')
  },
  {
    path: '/tags',
    component: () => import ('../views/TagManager.vue')
  },
  {
    path: '/restore',
    component: () => import ('../views/RestoreDefault.vue')
  },
  {
    path: '/poll',
    component: () => import ('../views/CreatePoll.vue')
  },
  {
    path: '/link',
    component: () => import ('../views/AddUrlToText.vue')
  },
  {
    path: '/',
    component: () => import ('../views/StackPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
