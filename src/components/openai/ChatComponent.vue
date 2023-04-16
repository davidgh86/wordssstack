<template>
      <ion-content :fullscreen="true">
          <ion-grid>
            <ion-row>
                <ion-select aria-label="mode" placeholder="Select model" v-model="iaModel" value="gpt-3.5-turbo">
                    <ion-select-option value="gpt-3.5-turbo">gpt-3.5-turbo</ion-select-option>
                    <ion-select-option value="gpt-3.5-turbo-0301">gpt-3.5-turbo-0301</ion-select-option>
                </ion-select>
            </ion-row>
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
      </ion-content>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, /**defineExpose*/ } from 'vue';
  import { 
            //IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar, 
            IonContent, IonRow, IonGrid, IonCol,
            IonItem, IonLabel, IonInput, IonRange, IonToggle, IonButton,
            IonSelect, IonSelectOption
          } from '@ionic/vue'
  
  import { useRouter } from 'vue-router'
  
  import openAIApi from '@/service/openAIApi';
  import stackManager from '@/service/stackManager';
  
  export default defineComponent({
    name: 'ChatComponent',
    emits: ['wrong-credentials'],
    expose: ['callOpenAi'],
    components: {
      IonContent,
      IonGrid,
      IonRow,
      IonCol,
      IonItem, IonLabel, IonInput,
      IonRange,
      IonToggle, 
      IonButton,
      IonSelect, IonSelectOption
    },
    setup(props, { emit }) {
  
      const router = useRouter()

      const iaModel = ref("gpt-3.5-turbo")
  
      const prompt = ref("")
  
      const messages = ref([])
  
      const temperature = ref(70)
      const maxLength = ref(256)
  
      const topP = ref(100)
      const freqPenalty = ref(0)
      const presPenalty = ref(0)
  
      const advancedConfig = ref(false)
  
      
  
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

      const callOpenAi = () => {
        if (!openAIApi.hasBearerToken()) {
          emit("wrong-credentials", callOpenAi)
        } else {
          fetchOpenApi()
          prompt.value = ""
        }
      }
      
      function ask() {
        messages.value.push({role: "user", content: prompt.value})
        callOpenAi()
      }
  
      function fetchOpenApi() {
        openAIApi.generateChatResponse(messages.value, 
                  temperature.value/100, 
                  maxLength.value, 
                  topP.value/100, 
                  freqPenalty.value/100, 
                  presPenalty.value/100,
                  iaModel.value
                  ).then(response => {
                    messages.value.push(response)
                  }).catch(e => {
                    alert(JSON.stringify(e))
                  })
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
        callOpenAi,
        ask,
        iaModel
      }
    }
  });
  </script>
  
  <style scoped>
  </style>
  