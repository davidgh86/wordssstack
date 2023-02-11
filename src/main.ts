import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import * as intentInstance from 'cordova-plugin-intent/www/android/IntentPlugin';
//import wordpressApi from './service/wordpressApi';

import stackManager from './service/stackManager';

//import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

/* Theme variables */
import './theme/variables.css';

import { store } from './store'
import debug from './service/debug';

debug.disableDebug()

store.commit('initialize')

const app = createApp(App)
  .use(store)
  .use(IonicVue)
  .use(router);

// router.beforeResolve((to, from, next) =>{
//   if (!wordpressApi.isInitialized()) {
//     next({
//       path: '/config',
//       replace: true
//     })
//   } else {
//     next()
//   }
// });

router.isReady().then(() => {
  app.mount('#app');
});


const processTextUrl = (url: string) => {
  stackManager.processTextUrl(url)
}

const intentManager = (Intent) => {
  debug.debugAlert("main ts 1.1" + JSON.stringify(Intent))
  if (Intent.clipItems) {
    const mimeType = Intent.type
    debug.debugAlert("main ts 1.2" + JSON.stringify(Intent.clipItems))
    for (const clipItem of Intent.clipItems) {
      debug.debugAlert("main ts 3" + JSON.stringify(clipItem))
      if (clipItem.uri) { // is file
        debug.debugAlert("Loading File " + clipItem.uri)
        const savedUrl = clipItem.uri
        stackManager.processFileUrl(savedUrl, mimeType)
      } else if (clipItem.text) {
        debug.debugAlert("Loading Uri " + clipItem.text)
        // TODO refactor
        processTextUrl(clipItem.text)
        
      }
    }
  } else if (Intent.data) {
    // Intent.data is the url
    debug.debugAlert("Loading Uri 2 " + JSON.stringify(Intent.data))
    processTextUrl(Intent.data)
  }
}

document.addEventListener('deviceReady', () => {
  intentInstance.getCordovaIntent((Intent) => {
    debug.debugAlert("main ts 1")
    intentManager(Intent)
  }, () => debug.debugAlert("Error"))
})

document.addEventListener('deviceReady', () => {
  intentInstance.setNewIntentHandler((Intent) => {
    debug.debugAlert("main ts 2")
    intentManager(Intent)
  })
})
