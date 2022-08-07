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

//import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

/* Theme variables */
import './theme/variables.css';

import { store } from './store'

const app = createApp(App)
  .use(store)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});

// document.addEventListener('deviceReady', () => {
//   intentInstance.getCordovaIntent((Intent) => {
//     alert("Cordova Intent ->> " + JSON.stringify(Intent))
//   }, () => alert("Error"))
// })

document.addEventListener('deviceReady', () => {
  intentInstance.setNewIntentHandler((Intent) => {
    alert("New ->> instance  " + JSON.stringify(Intent))
  })
})

// SEE DOCS https://www.npmjs.com/package/@capacitor/filesystem/v/1.1.0
// const writeSecretFile = async () => {
//   await Filesystem.writeFile({
//     path: 'secrets/text.txt',
//     data: "This is a test",
//     directory: Directory.Documents,
//     encoding: Encoding.UTF8,
//   });
// };

// const readSecretFile = async () => {
//   const contents = await Filesystem.readFile({
//     path: 'secrets/text.txt',
//     directory: Directory.Documents,
//     encoding: Encoding.UTF8,
//   });

//   console.log('secrets:', contents);
// };

// const deleteSecretFile = async () => {
//   await Filesystem.deleteFile({
//     path: 'secrets/text.txt',
//     directory: Directory.Documents,
//   });
// };

// const readFilePath = async () => {
//   // Here's an example of reading a file with a full file path. Use this to
//   // read binary data (base64 encoded) from plugins that return File URIs, such as
//   // the Camera.
//   const contents = await Filesystem.readFile({
//     //path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt'
//     path: 'content:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt'
//   });

//   console.log('data:', contents);
// };
