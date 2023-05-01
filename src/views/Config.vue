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
              <ion-button color="primary" @click="setConfig()">Save</ion-button>
            </ion-col>
            <ion-col>
              <ion-button color="primary" @click="removeConfig()">Clear</ion-button>
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
import { useRouter } from 'vue-router'
import wordpressApi from '@/service/wordpressApi';

export default defineComponent({
  name: 'ConfigComponent',
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

    const title = ref("")
    
    const hostName = ref("")

    const user = ref("")

    const password = ref("")

    function setHostName(host) {
      hostName.value = host
    }

    function setUser(usr) {
      user.value = usr
    }

    function setPassword(pwd) {
      password.value = pwd
    }

    function isConfigured(): boolean {
      return !!localStorage.getItem("host") && !!localStorage.getItem("user") && !!localStorage.getItem("password")
    }

    function setConfig() {
      hostName.value = hostName.value.trim()
      user.value = user.value.trim()
      password.value = password.value.trim()

      localStorage.setItem("host", hostName.value)
      localStorage.setItem("user", user.value)
      localStorage.setItem("password", password.value)

      wordpressApi.me().then(() => {
        alert("valid conection")
        
        if (isConfigured()) {
          router.push("/inbox")
        }
      }).catch(e => {
        alert("Not valid conection")
        alert("Not valid conection " + e.message)
        this.removeConfig()
      })
    }    

    function removeConfig() {
      localStorage.removeItem("host")
      localStorage.removeItem("user")
      localStorage.removeItem("password")
    }

    onMounted(() => {
      if (localStorage.getItem("host")) {
        hostName.value = localStorage.getItem("host")
      }
      if (localStorage.getItem("user")) {
        user.value = localStorage.getItem("user")
      }
      if (localStorage.getItem("password")) {
        password.value = localStorage.getItem("password")
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
