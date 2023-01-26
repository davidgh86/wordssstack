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

//import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

/* Theme variables */
import './theme/variables.css';

import { store } from './store'

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


const intentManager = (Intent) => {
  alert("main ts 1.1" + JSON.stringify(Intent))
  if (Intent.clipItems) {
    const mimeType = Intent.type
    alert("main ts 1.2" + JSON.stringify(Intent.clipItems))
    for (const clipItem of Intent.clipItems) {
      alert("main ts 3" + JSON.stringify(clipItem))
      if (clipItem.uri) { // is file
        const savedUrl = clipItem.uri
        store.commit("addElementFromSavedExternalPath", { savedUrl, mimeType })
      } else if (clipItem.text) {
        // TODO refactor
        const isYoutubeLink = true
        if (isYoutubeLink) {
          store.state.youtubeContentUrl = clipItem.text
          store.commit('addYoutubeContent')
        }
      }
    }
  } else if (Intent.data) {
    // Intent.data is the url
    store.state.youtubeContentUrl = Intent.data
    store.commit('addYoutubeContent')
  }
}

document.addEventListener('deviceReady', () => {
  intentInstance.getCordovaIntent((Intent) => {
    alert("main ts 1")
    intentManager(Intent)
  }, () => alert("Error"))
})

document.addEventListener('deviceReady', () => {
  intentInstance.setNewIntentHandler((Intent) => {
    alert("main ts 2")
    intentManager(Intent)
  })
})
