<template>
  <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-item>
            <ion-label>Variate</ion-label>
            <ion-button color="primary" @click="askForFile">Add</ion-button>
          </ion-item>
        </ion-row>
        <ion-row>
          <ion-col size="8">
            <audio controls v-if="audioUrl">
                <source :src="audioUrl">
                Your browser does not support the audio element.
            </audio>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-button @click="ask()">ASK</ion-button>
          </ion-col>
        </ion-row>

        <ion-row v-if="transcriptionResult">
          Transcription result
        </ion-row>

        <ion-row v-if="transcriptionResult">
          <ion-col size="8">{{ transcriptionResult }}</ion-col>
          <ion-col size="4"><ion-button @click="stack()">stack</ion-button></ion-col>
        </ion-row>

        <ion-row>
          <label for="select-language">Select a model:</label>
          <select id="select-language" v-model="selectedModel">
            <option v-for="(iaModel, iaModelDescription) in iaModels" :key="iaModel" :value="selectedModel">{{ iaModelDescription }}</option>
          </select>
        </ion-row>
        <ion-row>
          <ion-col>
            {{ selectedModel }}
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="4">
            Temperature
          </ion-col>
          <ion-col size="4">
            {{ temperature / 100 }}
          </ion-col>
          <ion-col size="4">
            <ion-range :min="0" :max="100" :v-model="temperature"></ion-range>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            {{ temperature }}
          </ion-col>
        </ion-row>
      </ion-grid>
      <input id="fileSelector" hidden type="file" name="myFile" @change="loadFile"/>
  </ion-content>
</template>

<script lang="ts">
import { computed, defineComponent, ref, } from 'vue';
import { 
        IonContent, IonRow, IonGrid,
        IonCol, IonRange, IonInput,
        IonItem, IonLabel, IonButton
      } from '@ionic/vue'

import { useRoute, useRouter } from 'vue-router'


import openAIApi from '@/service/openAIApi';
import stackManager from '@/service/stackManager';
import { useStore } from 'vuex';

import { v4 as uuid } from 'uuid'

import languagesJSON from '@/resources/languages.js'
import AudioStackElement from '@/wordpressstack/audioStackElement';
import audioService from '@/service/audioService';

interface ImageData {
  url: string;
  file: File | null;
}

export default defineComponent({
name: 'CreateTranslationComponent',
emits: ['wrong-credentials'],
expose: ['callOpenAi'],
components: {
  IonContent,
  IonGrid,
  IonRange,
  IonCol,
  IonRow,
  IonItem,
  IonLabel,
  IonButton
},
setup(props, { emit }) {

  const languages = languagesJSON

  const selectedModel = ref("whisper-1")

  const iaModels = {
    "whisper-1": "whisper-1"
  }

  const temperature = ref(70)

  const store = useStore()

  const router = useRouter()

  const route = useRoute()

  const file = ref(null);

  const transcriptionResult = ref(null)

  const audioUrl = computed(() => {
    if (file.value) {
      return URL.createObjectURL(file.value);
    }
    return null;
  });

  const getInitialFile = () => {
    if (route.params.stackIndex) {
      const stackIndex = parseInt(route.params.stackIndex as string)
      const element = (store.state.stack[stackIndex]) as AudioStackElement

      fetch(element.rawDataSrc)
      .then(response => {
        return response.blob()
      })
      .then(blob => {
        file.value = blob
      });
    } 
  }

  getInitialFile()


  const callOpenAi = () => {
    if (!openAIApi.hasBearerToken()) {
      emit("wrong-credentials", callOpenAi)
    } else {
      fetchOpenApi()
      file.value = null
    }
  }
  
  function stack() {
    stackManager.addTextToEditor(transcriptionResult.value)
    router.push("/inbox")
  }

  function ask() {
    callOpenAi()
  }
  
  async function fetchOpenApi() {
    if (!file.value) {
      alert("Not selected file")
      return;
    }

    const fileName = `${uuid()}.wav`

    const audioBlob = await audioService.convertToWav(file.value);
    
    openAIApi.createAudioTranslation(audioBlob, fileName, selectedModel.value, temperature.value / 100).then(response => {
                transcriptionResult.value = response
              }).catch(e => {
                alert("ERROR "+ JSON.stringify(e))
              })
  }

  function loadFile(event){
    if(event.target.files.length > 0){
      alert("TODO check png less 4MB")
      file.value = event.target.files[0] as Blob
      
    }
  }

  function askForFile() {
      const fileSelector = document.getElementById("fileSelector")
      fileSelector?.click()
    }

  return {
    ask,
    loadFile,
    askForFile,
    audioUrl,
    file,
    languages,
    selectedModel,
    iaModels,
    temperature,
    transcriptionResult,
    stack
  }
}
});
</script>

<style scoped>
.input-tag > div {
  background-color: grey !important
}
</style>
