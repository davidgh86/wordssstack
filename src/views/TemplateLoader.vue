<template>
  <ion-page>
    <ion-content>
      <ion-row>
        <ion-col>
          <ion-button @click="obtainTemplates">
            Load
          </ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          Image
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in imageTemplates" :key="index">
        <ion-col col="6">
          {{ template }}
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          Audio
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in audioTemplates" :key="index">
        <ion-col col="6">
          {{ template }}
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          Video
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in videoTemplates" :key="index">
        <ion-col col="6">
          {{ template }}
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          Youtube
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in youtubeTemplates" :key="index">
        <ion-col col="6">
          {{ template }}
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          Twitter
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in twitterTemplates" :key="index">
        <ion-col col="6">
          {{ template }}
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          Strawpoll
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in strawpollTemplates" :key="index">
        <ion-col col="6">
          {{ template }}
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
  
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonContent,
          IonPage, IonRow, IonCol,
          IonButton
        } from '@ionic/vue'
import templateLoaderService from "@/service/template/templateLoaderService"
//import { quillEditor } from 'vue3-quill'

export default defineComponent({
  name: 'TemplateLoader',
  components: {
    IonContent,
    // IonButtons,
    // IonHeader,
    // IonMenuButton,
    // IonPage,
    // IonTitle,
    // IonToolbar,
    // IonGrid,
    IonRow,
    IonCol,
    IonPage,
    IonButton
    // IonItem,
    // IonList,
    // IonSelect,
    // IonSelectOption,
    // SingleTemplateManager
},
  setup() {

    const imageTemplates = ref([])
    const videoTemplates = ref([])
    const audioTemplates = ref([])
    const youtubeTemplates = ref([])
    const strawpollTemplates = ref([])
    const twitterTemplates = ref([])
    const htmlTemplates = ref([])

    function obtainTemplates() {
      const templates = templateLoaderService.inferTemplates()
      
      imageTemplates.value = templates.image?templates.image:[]
      videoTemplates.value = templates.video?templates.video:[]
      audioTemplates.value = templates.audio?templates.audio:[]
      youtubeTemplates.value = templates.youtube?templates.youtube:[]
      strawpollTemplates.value = templates.strawpoll?templates.strawpoll:[]
      twitterTemplates.value = templates.twitter?templates.twitter:[]
      htmlTemplates.value = templates.html?templates.html:[]

    }

    return {
      imageTemplates,
      videoTemplates,
      audioTemplates,
      youtubeTemplates,
      strawpollTemplates,
      twitterTemplates,
      htmlTemplates,
      obtainTemplates
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


