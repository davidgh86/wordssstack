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
          <!-- <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="floating">Host name</ion-label>
                <ion-input :value="hostName" @ionInput="setHostName($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="floating">User</ion-label>
                <ion-input :value="user" @ionInput="setUser($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="floating">Password</ion-label>
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
          </ion-row> -->
          <ion-row>
            <ion-list>
              <!-- <ion-radio-group :value="templateType" @ionChange="radioGroupChange">
                <ion-item>
                  <ion-label>Image</ion-label>
                  <ion-radio slot="end" value="image"></ion-radio>
                </ion-item>
                <ion-item>
                  <ion-label>Video</ion-label>
                  <ion-radio slot="end" value="video"></ion-radio>
                </ion-item>
                <ion-item>
                  <ion-label>Html</ion-label>
                  <ion-radio slot="end" value="html"></ion-radio>
                </ion-item>
                <ion-item>
                  <ion-label>Youtube</ion-label>
                  <ion-radio slot="end" value="youtube"></ion-radio>
                </ion-item>
              </ion-radio-group> -->
              <ion-item>
                <ion-select placeholder="Select fruit" :value="templateType" @ionChange="radioGroupChange">
                  <ion-select-option value="image">Image</ion-select-option>
                  <ion-select-option value="video">Video</ion-select-option>
                  <ion-select-option value="html">Html</ion-select-option>
                  <ion-select-option value="youtube">Youtube</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
          </ion-row>
        </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { IonButtons, IonContent, IonHeader, IonMenuButton, 
          IonPage, IonTitle, IonToolbar, IonRow, IonGrid, 
          // IonCol, 
          // IonButton, 
          // IonInput, 
          IonItem,
          IonList,
          // IonLabel,
          // IonRadioGroup,
          // IonRadio 
          IonSelect,
          IonSelectOption
        } from '@ionic/vue'
import { useRouter } from 'vue-router'

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
    // IonCol,
    // IonButton,
    // IonInput,
    IonItem,
    //IonLabel,
    IonList,
    // IonRadioGroup,
    // IonRadio
    IonSelect,
    IonSelectOption
  },
  setup() {
    
    const router = useRouter()

    const title = ref("")
    
    const hostName = ref("")

    const user = ref("")

    const password = ref("")

    const templateType = ref("image")

    function radioGroupChange(event) {
      templateType.value = event.target.value
    }

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
      if (isConfigured()) {
        router.push("/inbox")
      }
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
      removeConfig,
      radioGroupChange,
      templateType
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
