<template>
  <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
            <ion-select aria-label="mode" placeholder="Select model" v-model="iaModel" value="text-davinci-003">
                <ion-select-option v-for="item of models" :value="item.value" :key="item.value">{{ item.value }}</ion-select-option>
            </ion-select>
        </ion-row>
        <ion-row>
          <ion-col size="9">
            <ion-item>
              <ion-textarea label="Prompt" placeholder="Type something here" v-model="prompt"></ion-textarea>
            </ion-item>
          </ion-col>
          <ion-col size="1">
            <ion-button @click="ask()">ASK</ion-button>
          </ion-col>
          <ion-col size="1">
            <ion-button @click="stackContent()">Stack</ion-button>
          </ion-col>
          <ion-col size="1">
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
            Stop sequences
          </ion-col>
          <ion-col size="9" class="input-tag">
              <!-- <ion-input :value="stopSequences" @ionInput="setStopSequences($event.target.value)"></ion-input> -->
              <vue3-tags-input :tags="stopSequences"></vue3-tags-input>
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

        <ion-row v-if="advancedConfig">
          <ion-col size="3">
            Best of
          </ion-col>
          <ion-col size="1">
            {{ bestOf }}
          </ion-col>
          <ion-col size="3">
            <ion-range :min="1" :max="20" :value="bestOf" @ionChange="updateBestOf($event)"></ion-range>
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
        IonItem, IonLabel, IonRange, IonToggle, IonButton,
        IonTextarea, IonSelect, IonSelectOption
      } from '@ionic/vue'

import Vue3TagsInput from 'vue3-tags-input';

import { useRouter } from 'vue-router'

import openAIApi from '@/service/openAIApi';
import stackManager from '@/service/stackManager';

export default defineComponent({
name: 'CompleteComponent',
emits: ['wrong-credentials'],
expose: ['callOpenAi'],
components: {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem, IonLabel,
  IonRange,
  IonToggle, 
  IonButton,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  Vue3TagsInput
},
setup(props, { emit }) {

  const router = useRouter()

  const models = ref([
    { value: "text-davinci-003" },
    { value: "text-curie-001" },
    { value: "text-babbage-001" },
    { value: "text-ada-001" },
    { value: "text-davinci-002" },
    { value: "text-davinci-001" },
    { value: "davinci-instruct-beta" },
    { value: "davinci" },
    { value: "curie-instruct-beta" },
    { value: "curie" },
    { value: "babbage" },
    { value: "ada" }
  ]);

  const iaModel = ref("text-davinci-003")

  const prompt = ref("")

  const stopSequences = ref([])

  const temperature = ref(70)
  const maxLength = ref(256)

  const topP = ref(100)
  const freqPenalty = ref(0)
  const presPenalty = ref(0)
  const bestOf = ref(1)

  const advancedConfig = ref(true)

  function stackContent(){
    stackManager.addTextToEditor(prompt.value)
    router.push("/inbox")
  }

  function setPrompt(pr){
    prompt.value = pr
  }

  function setStopSequences(stopSq) {
    stopSequences.value = stopSq
  }

  function reset() {
    prompt.value = ""
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

  function updateBestOf({detail}) {
    bestOf.value = detail.value
  }

  const callOpenAi = () => {
    debugger;
    if (!openAIApi.hasBearerToken()) {
      emit("wrong-credentials")
    } else {
      fetchOpenApi()
      prompt.value = ""
    }
  }
  
  function ask() {
    callOpenAi()
  }

  function fetchOpenApi() {
    openAIApi.generateCompletionResponse(
      iaModel.value,
      prompt.value,
      maxLength.value,
      temperature.value/100,
      topP.value/100,
      stopSequences.value,
      presPenalty.value/100,
      freqPenalty.value/100,
      bestOf.value
      ).then(response => {
                prompt.value = response
              }).catch(e => {
                alert(JSON.stringify(e))
              })
  }

  return {
    prompt,
    setPrompt,
    reset,
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
    iaModel,
    models,
    stopSequences,
    setStopSequences,
    updateBestOf,
    bestOf,
  }
}
});
</script>

<style scoped>
.input-tag > div {
  background-color: grey !important
}
</style>
