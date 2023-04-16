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
          <ion-col size="8"><img :src="imageUrl" v-if="imageUrl"></ion-col>
          
        </ion-row>


        <ion-row>
          <ion-col size="3">
            <ion-button @click="ask()">ASK</ion-button>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="3">
            Number or images
          </ion-col>
          <ion-col size="1">
            {{ n }}
          </ion-col>
          <ion-col size="3">
            <ion-range :min="1" :max="10" v-model="n"></ion-range>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="2">
            Size
          </ion-col>
          <ion-col size="2">
            {{ size }}
          </ion-col>
          <ion-col size="3">
            <ion-range :min="0" :max="2" v-model="imageSize"></ion-range>
          </ion-col>
        </ion-row>

        <ion-row v-for="(generatedImage, index) in generatedImages" :key="index">
          <ion-col size="8"><img :src="generatedImage.url" /></ion-col>
          <ion-col size="4"><ion-button @click="stack(index)">Stack</ion-button></ion-col>
        </ion-row>
      </ion-grid>
      <input id="fileSelector" hidden type="file" name="myFile" @change="loadFile"/>
  </ion-content>
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref, Ref } from 'vue';
import { 
        IonContent, IonRow, IonGrid,
        IonCol, IonRange, 
        IonItem, IonLabel, IonButton
      } from '@ionic/vue'

import { useRoute, useRouter } from 'vue-router'


import openAIApi from '@/service/openAIApi';
import stackManager from '@/service/stackManager';
import imageService from '@/service/imageService';
import { useStore } from 'vuex';

import { v4 as uuid } from 'uuid'
import ImageStackElement from '@/wordpressstack/imageStackElement';

interface ImageData {
  url: string;
  file: File | null;
}

export default defineComponent({
name: 'VariateImagesComponent',
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

  const store = useStore()

  const router = useRouter()

  const route = useRoute()

  const file = ref(null);

  const imageUrl = computed(() => {
    if (file.value) {
      return URL.createObjectURL(file.value);
    }
    return null;
  });

  const getInitialFile = () => {
    if (route.params.stackIndex) {
      const stackIndex = parseInt(route.params.stackIndex as string)
      const element = (store.state.stack[stackIndex]) as ImageStackElement

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

  const n = ref(1)

  const imageSize = ref(2)

  const generatedImages = ref([])

  

  function getSize() {
    const height = 2 ** (imageSize.value + 8)
     return `${height}x${height}`
  }

  const size = computed(() => {
     return getSize()
  })

  function reset() {
    file.value = null
  }

  

  const callOpenAi = () => {
    if (!openAIApi.hasBearerToken()) {
      emit("wrong-credentials", callOpenAi)
    } else {
      fetchOpenApi()
      file.value = null
    }
  }
  
  function stack(index) {
    stackManager.addElementFromBase64Src(store.state, generatedImages.value[index].url)
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

    // console.log("1")
    const squareBlob = await imageService.cropToSquarePng(file.value);
    // console.log("2")
    // const squareFile = new File([squareBlob], `${uuid()}.png`, { type: 'image/png' });
    openAIApi.createImageVariation(squareBlob, `${uuid()}.png`, n.value, getSize()).then(response => {
                generatedImages.value = response
              }).catch(e => {
                alert(e.message)
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
    prompt,
    reset,
    callOpenAi,
    ask,
    stack,
    n,
    imageSize,
    size,
    generatedImages,
    loadFile,
    askForFile,
    imageUrl,
    file
  }
}
});
</script>

<style scoped>
.input-tag > div {
  background-color: grey !important
}
</style>
