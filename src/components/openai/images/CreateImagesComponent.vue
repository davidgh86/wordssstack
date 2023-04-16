<template>
  <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-item>
            <ion-label>Prompt</ion-label>
            <ion-input v-model="prompt"></ion-input>
          </ion-item>
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
  </ion-content>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { 
        IonContent, IonRow, IonGrid,
        IonInput, IonCol, IonRange, 
        IonItem, IonLabel, IonButton
      } from '@ionic/vue'

import { useRouter } from 'vue-router'

import openAIApi from '@/service/openAIApi';
import stackManager from '@/service/stackManager';
import { useStore } from 'vuex';

export default defineComponent({
name: 'CreateImagesComponent',
emits: ['wrong-credentials'],
expose: ['callOpenAi'],
components: {
  IonContent,
  IonGrid,
  IonRange,
  IonCol,
  IonRow,
  IonInput,
  IonItem,
  IonLabel,
  IonButton
},
setup(props, { emit }) {

  const store = useStore()

  const router = useRouter()

  const prompt = ref("")

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
    prompt.value = ""
  }

  const callOpenAi = () => {
    if (!openAIApi.hasBearerToken()) {
      emit("wrong-credentials", callOpenAi)
    } else {
      fetchOpenApi()
      prompt.value = ""
    }
  }
  
  function stack(index) {
    stackManager.addElementFromBase64Src(store.state, generatedImages.value[index].url)
    router.push("/inbox")
  }

  function ask() {
    callOpenAi()
  }
  
  function fetchOpenApi() {
    openAIApi.generateImage(prompt.value, n.value, getSize()
              ).then(response => {
                generatedImages.value = response
              }).catch(e => {
                alert(JSON.stringify(e))
              })
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
    generatedImages
  }
}
});
</script>

<style scoped>
.input-tag > div {
  background-color: grey !important
}
</style>
