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
    path: '/ai',
    component: () => import ('../views/IAView.vue'),
    children: [
      {
        path: "/chat",
        name: "chat",
        component: () => import ('../components/openai/ChatComponent.vue')
      },
      {
        path: "/complete",
        name: "complete",
        component: () => import ('../components/openai/CompleteComponent.vue')
      },
      {
        path: "/image",
        name: "image",
        component: () => import ('../components/openai/ImagesComponent.vue'),
        children: [
          { 
            path: "/create",
            name: "create",
            component: () => import ('../components/openai/images/CreateImagesComponent.vue')
          },
          { 
            path: "/variation/:stackIndex?",
            name: "variation",
            component: () => import ('../components/openai/images/VariateImagesComponent.vue'),
          }
        ]
      },
      {
        path: "/audio",
        name: "audio",
        component: () => import ('../components/openai/AudioComponent.vue'),
        children: [
          { 
            path: "/transcription/:stackIndex?",
            name: "transcription",
            component: () => import ('../components/openai/audio/CreateTranscriptionComponent.vue')
          },
          { 
            path: "/translation/:stackIndex?",
            name: "translation",
            component: () => import ('../components/openai/audio/CreateTranslationComponent.vue'),
          }
        ]
      }
    ]
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
