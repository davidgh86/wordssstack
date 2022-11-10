<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.params.id }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="floating">Host name</ion-label>
                <!-- workaround because not working -->
                <ion-input :value="hostName" @ionInput="setHostName($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="floating">User</ion-label>
                <!-- workaround because not working -->
                <ion-input :value="user" @ionInput="setUser($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="floating">Password</ion-label>
                <!-- workaround because not working -->
                <ion-input :value="password" @ionInput="setPassword($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-button color="primary" @click="setConfig">Primary</ion-button>
            </ion-col>
            <ion-col>
              <ion-button color="primary" @click="removeConfig">Clean cache</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { IonButtons, IonContent, IonHeader, IonMenuButton, 
          IonPage, IonTitle, IonToolbar, IonRow, IonGrid, IonCol, 
          IonButton, IonInput, IonItem, IonLabel } from '@ionic/vue'
import { useRouter, useRoute } from 'vue-router'

import wordpressApi from '../service/wordpressApi';



export default defineComponent({
  name: 'FolderPage',
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonInput,
    IonItem,
    IonLabel
  },
  setup() {
    
    const router = useRouter()
    const route = useRoute()

    const title = ref("")
    
    const hostName = ref("")

    const user = ref("")

    const password = ref("")

    function setHostName(host) {
      this.hostName.value = host
    }

    function setUser(user) {
      this.user.value = user
    }

    function setPassword(password) {
      this.password.value = password
    }

    function setConfig() {
      localStorage.setItem("host", this.hostName.value)
      localStorage.setItem("user", this.user.value)
      localStorage.setItem("password", this.password.value)
      wordpressApi.init()
    }

    function isConfigured(): boolean {
      return !!localStorage.getItem("host") && !!localStorage.getItem("user") && !!localStorage.getItem("password")
    }

    function removeConfig() {
      localStorage.removeItem("host")
      localStorage.removeItem("user")
      localStorage.removeItem("password")
    }

    onMounted(() => {
      if (isConfigured()) {
        router.push("/inbox")
      }
    })


    
    return {
      title,
      hostName,
      setHostName,
      setUser,
      setPassword,
      user,
      password,
      setConfig,
      removeConfig
    }
  }
});
</script>

<style scoped>
.element {
  border-radius: 4px;
  background-color: var(--ion-color-medium);
  margin: 0.1rem;
  position: relative;
}
.x {
    font-size: 24px;
    position: absolute;
    top: -10px;
    right: -10px;
}
</style>
