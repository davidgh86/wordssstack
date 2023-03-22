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
          <ion-row  v-for="(message, index) in messages" :key="index">
            <ion-col v-if="message.role === 'user'" size="8">
              {{ message.content }}
            </ion-col>
            <ion-col size="4" v-if="message.role === 'user'">
            </ion-col>
            <ion-col size="2" v-if="message.role === 'assistant'">
            </ion-col>
            <ion-col v-if="message.role === 'assistant'" size="6">
              {{ message.content }}
            </ion-col>
            <ion-col v-if="message.role === 'assistant'" size="4">
              <ion-button color="primary" @click="stackContent(index)">Stack</ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">
              <ion-item>
                <ion-label position="floating">Prompt</ion-label>
                <ion-input :value="prompt" @ionInput="setPrompt($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
            <ion-col size="3">
              <ion-button @click="ask()">ASK</ion-button>
            </ion-col>
            <ion-col size="3">
              <ion-button @click="reset()">Reset</ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">
              <ion-item>
                <ion-label>Advanced configuration</ion-label>
                <ion-toggle slot="end" :checked="advancedConfig" @ionChange="updateAdvancedConfig($event)" ></ion-toggle>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row v-if="advancedConfig">
            <ion-col size="3">
              Temperature
            </ion-col>
            <ion-col size="1">
              {{ temperature / 100 }}
            </ion-col>
            <ion-col size="3">
              <ion-range :min="0" :max="100" :value="temperature" @ionChange="updateTemperature($event)"></ion-range>
            </ion-col>
          </ion-row>

          <ion-row v-if="advancedConfig">
            <ion-col size="3">
              Maximum length
            </ion-col>
            <ion-col size="1">
              {{ maxLength }}
            </ion-col>
            <ion-col size="3">
              <ion-range :min="1" :max="2048" :value="maxLength" @ionChange="updateMaxLength($event)"></ion-range>
            </ion-col>
          </ion-row>

          <ion-row v-if="advancedConfig">
            <ion-col size="3">
              Top P
            </ion-col>
            <ion-col size="1">
              {{ topP / 100 }}
            </ion-col>
            <ion-col size="3">
              <ion-range :min="0" :max="100" :value="topP" @ionChange="updateTopP($event)"></ion-range>
            </ion-col>
          </ion-row>

          <ion-row v-if="advancedConfig">
            <ion-col size="3">
              Frequency penalty
            </ion-col>
            <ion-col size="1">
              {{ freqPenalty / 100 }}
            </ion-col>
            <ion-col size="3">
              <ion-range :min="0" :max="200" :value="freqPenalty" @ionChange="updateFreqPenalty($event)"></ion-range>
            </ion-col>
          </ion-row>

          <ion-row v-if="advancedConfig">
            <ion-col size="3">
              Presence penalty
            </ion-col>
            <ion-col size="1">
              {{ presPenalty / 100 }}
            </ion-col>
            <ion-col size="3">
              <ion-range :min="0" :max="200" :value="presPenalty" @ionChange="updatePresPenalty($event)"></ion-range>
            </ion-col>
          </ion-row>
              
        </ion-grid>
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
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { 
          IonButtons, IonContent, IonHeader, IonMenuButton, 
          IonPage, IonTitle, IonToolbar, IonRow, IonGrid, IonCol,
          IonItem, IonLabel, IonInput, IonRange, IonToggle, IonModal, IonButton
        } from '@ionic/vue'

import { useRouter } from 'vue-router'

import openAIApi from '@/service/openAIApi';
import stackManager from '@/service/stackManager';

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
    IonItem, IonLabel, IonInput,
    IonRange,
    IonToggle,
    IonModal, IonButton
  },
  setup() {

    const router = useRouter()

    const prompt = ref("")

    const messages = ref([])

    const temperature = ref(70)
    const maxLength = ref(256)

    const topP = ref(100)
    const freqPenalty = ref(0)
    const presPenalty = ref(0)

    const advancedConfig = ref(false)

    const openAiConfigOpen = ref(false)

    const openAiBearerToken = ref("")

    function stackContent(idx){
      stackManager.addTextToEditor(messages.value[idx].content)
      router.push("/inbox")
    }

    function setPrompt(pr){
      prompt.value = pr
    }

    function reset() {
      prompt.value = ""
      messages.value = []
    }

    function updateTemperature({detail}) {
      temperature.value = detail.value
    }

    function updateMaxLength({detail}) {
      maxLength.value = detail.value
    }

    function updateTopP({detail}) {
      topP.value = detail.value
    }

    function updateFreqPenalty({detail}) {
      freqPenalty.value = detail.value
    }

    function updatePresPenalty({detail}) {
      presPenalty.value = detail.value
    }

    function updateAdvancedConfig({detail}) {
      advancedConfig.value = detail.checked
    }

    function closeOpenAiConfigOpen() {
      openAiConfigOpen.value = false
    }
    
    function ask() {
      messages.value.push({role: "user", content: prompt.value})
      callOpenAi()
    }

    function callOpenAi() {
      
      if (openAiBearerToken.value){
        saveOpenAiToken()
      }
      if (!openAIApi.hasBearerToken()) {
        alert("Update token")
        openAiConfigOpen.value = true
      } else {
        fetchOpenApi()
        prompt.value = ""
        openAiConfigOpen.value = false
      }
      
    }

    function fetchOpenApi() {
      openAIApi.generateText(messages.value, 
                temperature.value/100, 
                maxLength.value, 
                topP.value/100, 
                freqPenalty.value/100, 
                presPenalty.value/100).then(response => {
                  messages.value.push(response)
                }).catch(e => {
                  alert(JSON.stringify(e))
                })
    }

    function updateOpenAiToken(newOpenAiToken){
      openAiBearerToken.value = newOpenAiToken
    }

    function saveOpenAiToken() {
      openAIApi.setBearerToken(openAiBearerToken.value)
    }

    return {
      prompt,
      setPrompt,
      reset,
      messages,
      stackContent,
      temperature,
      updateTemperature,
      maxLength,
      updateMaxLength,
      topP,
      updateTopP,
      freqPenalty,
      updateFreqPenalty,
      presPenalty,
      updatePresPenalty,
      advancedConfig,
      updateAdvancedConfig,
      openAiConfigOpen,
      closeOpenAiConfigOpen,
      callOpenAi,
      openAiBearerToken,
      updateOpenAiToken,
      saveOpenAiToken,
      ask
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
