<template>
  <ion-page>
    <ion-row>
      <ion-select aria-label="mode" placeholder="Select mode" v-model="iaMode" @ion-change="handleOptionChange">
        <ion-select-option value="chat">Chat</ion-select-option>
        <ion-select-option value="complete">Complete</ion-select-option>
        <ion-select-option value="image">Images</ion-select-option>
        <ion-select-option value="audio">Audio</ion-select-option>
      </ion-select>
    </ion-row>
    <router-view @wrong-credentials="askCredentials($event)"></router-view>
    <ion-modal :is-open="openAiConfigOpen">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="closeOpenAiConfigOpen()">Cancel</ion-button>
          </ion-buttons>
          <ion-title>Config open AI tokens</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="callOpenAi()">Confirm</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-row>
          <ion-item>
            <ion-label>
              OpenAI api bearer token
            </ion-label>
            <ion-input :value="openAiBearerToken" @ionInput="updateOpenAiToken($event.target.value)"></ion-input>
          </ion-item>
        </ion-row>
        <ion-row>
          <ion-button @click="saveOpenAiToken()">Cancel</ion-button>
        </ion-row>
        
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import openAIApi from '@/service/openAIApi';
import { IonButton, IonButtons, IonContent, IonHeader, 
  IonInput, IonItem, IonLabel, IonModal, IonRow, 
  IonTitle, IonToolbar, IonPage, IonSelect, IonSelectOption,
  //IonMenuButton, 
  } from '@ionic/vue';

import { RouterView, useRouter } from 'vue-router';

export default defineComponent({
  name: 'IAView',
  components: {
    IonModal, IonHeader, IonToolbar, IonButtons, 
    IonButton, IonTitle, IonContent, IonRow, 
    IonItem, IonLabel, IonInput, IonPage,
    IonSelect, IonSelectOption,
    RouterView
  },
  setup() {

    const router = useRouter()

    let callOpenAiMethod = null

    //const childComponentType = ref(null)

    const iaMode = ref("images")

    const openAiBearerToken = ref("")

    const openAiConfigOpen = ref(false)

    function updateOpenAiToken(newOpenAiToken){
      openAiBearerToken.value = newOpenAiToken
    }

    function saveOpenAiToken() {
      openAIApi.setBearerToken(openAiBearerToken.value)
    }

    function askCredentials(method) {
      callOpenAiMethod = method
      openAiConfigOpen.value = true
    }

    function closeOpenAiConfigOpen() {
      openAiConfigOpen.value = false
    }

    function handleOptionChange() {
      router.push({ name: iaMode.value })
    }

    function callOpenAi() {
      saveOpenAiToken()
      
      if (callOpenAiMethod) {
        callOpenAiMethod()
        callOpenAiMethod = null
      }
      
      openAiConfigOpen.value = false
    }

    return {
      openAiBearerToken,
      openAiConfigOpen,
      updateOpenAiToken,
      saveOpenAiToken,
      callOpenAi,
      askCredentials,
      closeOpenAiConfigOpen,
      iaMode,
      handleOptionChange
    }
  }
});
</script>

