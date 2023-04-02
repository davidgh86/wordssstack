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
                <ion-label position="floating">Text</ion-label>
                <!-- workaround because not working -->
                <ion-input :value="linkText" @ionInput="setText($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="floating">Url</ion-label>
                <!-- workaround because not working -->
                <ion-input :value="linkUrl" @ionInput="setUrl($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-button color="primary" @click="addLink()">Create</ion-button>
            </ion-col>
          </ion-row>
          <!-- <ion-row>Here {{ store.state.caretPosition }} - Node name - {{ store.state.caretPositionNodeName }} - {{ store.state.htmlEditorContent }}</ion-row> -->
        
        </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonButtons, IonContent, IonHeader, IonMenuButton, 
          IonPage, IonTitle, IonToolbar, IonRow, IonGrid, IonCol, 
          IonInput, IonItem, IonLabel, IonButton } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { addCircleOutline, trashOutline } from 'ionicons/icons';

import stackManager from '@/service/stackManager';
//import { useStore } from 'vuex';

export default defineComponent({
  name: 'CreatePoll',
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
    IonInput,
    IonItem,
    IonLabel   ,
    IonButton 
  },
  setup() {

    //const store = useStore()
    
    const router = useRouter()
    
    const linkText = ref("")

    const linkUrl = ref("")

    function setText(text) {
      linkText.value = text
    }

    function setUrl(url) {
      linkUrl.value = url
    }

    function addLink() {
      if (!linkText.value.trim() || !linkText.value.trim()) {
        if (!linkText.value.trim()) {
          alert("add a description")
        }
        if (!linkText.value.trim()) {
          alert("add an url")
        }
        return
      }
      stackManager.addLink(linkText.value, linkUrl.value)
      router.push("/inbox")
    }

    

    return {
      linkText,
      linkUrl,
      setText,
      setUrl,
      addCircleOutline,
      trashOutline,
      addLink,
      //store
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
