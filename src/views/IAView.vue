<template>
  <ion-page>
    <ion-row>
      <ion-select aria-label="mode" placeholder="Select mode" v-model="iaMode">
        <ion-select-option value="chat">Chat</ion-select-option>
        <ion-select-option value="complete">Complete</ion-select-option>
        <ion-select-option value="images">Images</ion-select-option>
      </ion-select>
    </ion-row>
    <chat-component @wrong-credentials="askCredentials()" ref="chat" v-if="iaMode === 'chat'"></chat-component>
    <complete-component @wrong-credentials="askCredentials()" ref="complete" v-if="iaMode === 'complete'"></complete-component>
    <images-component @wrong-credentials="askCredentials()" ref="images" v-if="iaMode === 'images'"></images-component>
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

import ChatComponent from '@/components/openai/ChatComponent.vue';
import CompleteComponent from "@/components/openai/CompleteComponent.vue"
import ImagesComponent from "@/components/openai/ImagesComponent.vue"
import openAIApi from '@/service/openAIApi';
import { IonButton, IonButtons, IonContent, IonHeader, 
  IonInput, IonItem, IonLabel, IonModal, IonRow, 
  IonTitle, IonToolbar, IonPage, IonSelect, IonSelectOption,
  //IonMenuButton, 
  } from '@ionic/vue';

export default defineComponent({
  name: 'IAView',
  components: {
    ChatComponent, CompleteComponent,
    IonModal, IonHeader, IonToolbar, IonButtons, 
    IonButton, IonTitle, IonContent, IonRow, 
    IonItem, IonLabel, IonInput, IonPage,
    IonSelect, IonSelectOption,
    ImagesComponent, 
    //IonMenuButton
  },
  setup() {

    const chat = ref(null)

    const complete = ref(null)

    const images = ref(null)

    const iaMode = ref("images")

    const openAiBearerToken = ref("")

    const openAiConfigOpen = ref(false)

    function updateOpenAiToken(newOpenAiToken){
      openAiBearerToken.value = newOpenAiToken
    }

    function saveOpenAiToken() {
      openAIApi.setBearerToken(openAiBearerToken.value)
    }

    function askCredentials() {
      openAiConfigOpen.value = true
    }

    function closeOpenAiConfigOpen() {
      openAiConfigOpen.value = false
    }

    function callOpenAi() {
      saveOpenAiToken()
      if (iaMode.value==="chat") {
        this.$refs.chat.callOpenAi()
      } else if (iaMode.value==="complete") {
        this.$refs.complete.callOpenAi()
      } else if (iaMode.value==="images") {
        this.$refs.images.callOpenAi()
      } else {
        alert("Not valid model")
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
      iaMode
    }
  }
});
</script>

