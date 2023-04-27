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
          <h3>Image</h3>
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in imageTemplates" :key="index">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template, 'image')"></ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Audio</h3>
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in audioTemplates" :key="index">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template, 'audio')"></ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Video</h3>
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in videoTemplates" :key="index">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template, 'video')"></ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Youtube</h3>          
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in youtubeTemplates" :key="index">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template, 'youtube')"></ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Twitter</h3>          
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in twitterTemplates" :key="index">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template, 'twitter')"></ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Strawpoll</h3>          
        </ion-col>
      </ion-row>
      <ion-row v-for="(template, index) in strawpollTemplates" :key="index">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template, 'strawpoll')"></ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
  
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonContent,
          IonPage, IonRow, IonCol,
          IonButton, IonTextarea
        } from '@ionic/vue'
import templateLoaderService from "@/service/template/templateLoaderService"
import temaplateDB from '@/service/database/temaplateDB'

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
    IonButton,
    IonTextarea,
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

    function persistTemplate(template, type) {
      temaplateDB.persistTemplate(template, type)
    }

    return {
      imageTemplates,
      videoTemplates,
      audioTemplates,
      youtubeTemplates,
      strawpollTemplates,
      twitterTemplates,
      htmlTemplates,
      obtainTemplates,
      persistTemplate
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


