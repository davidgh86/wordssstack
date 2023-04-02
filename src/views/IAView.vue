<template>
  <ion-page>
    <chat-component @wrong-credentials="askCredentials()" ref="chat"></chat-component>
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
import openAIApi from '@/service/openAIApi';
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonRow, IonTitle, IonToolbar, IonPage } from '@ionic/vue';

export default defineComponent({
  name: 'IAView',
  components: {
    ChatComponent,
    IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonRow, IonItem, IonLabel, IonInput, IonPage
  },
  setup() {

    const chat = ref(null)

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
      this.$refs.chat.callOpenAi()
      openAiConfigOpen.value = false
    }

    return {
      openAiBearerToken,
      openAiConfigOpen,
      updateOpenAiToken,
      saveOpenAiToken,
      callOpenAi,
      askCredentials,
      closeOpenAiConfigOpen
    }
  }
});
</script>

