<template>
  <ion-page>
    <ion-content>
      <ion-row>
        <ion-col>
          <h3>Image</h3>
        </ion-col>
      </ion-row>
      <ion-row v-for="template in imageTemplates" :key="template.uuid">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template.template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template)">choose</ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Audio</h3>
        </ion-col>
      </ion-row>
      <ion-row v-for="template in audioTemplates" :key="template.uuid">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template.template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template)">choose</ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Video</h3>
        </ion-col>
      </ion-row>
      <ion-row v-for="template in videoTemplates" :key="template.uuid">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template.template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template)">choose</ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Youtube</h3>          
        </ion-col>
      </ion-row>
      <ion-row v-for="template in youtubeTemplates" :key="template.uuid">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template.template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template)">choose</ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Twitter</h3>          
        </ion-col>
      </ion-row>
      <ion-row v-for="template in twitterTemplates" :key="template.uuid">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template.template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template)">choose</ion-button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h3>Strawpoll</h3>          
        </ion-col>
      </ion-row>
      <ion-row v-for="template in strawpollTemplates" :key="template.uuid">
        <ion-col col="6">
          <ion-textarea :readonly="true">{{ template.template }}</ion-textarea>
        </ion-col>
        <ion-col col="6">
          <ion-button @click="persistTemplate(template)">choose</ion-button>
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
import templateRepository from "@/service/database/templateRepository"
import templateService from '@/service/templateService';

import { useRouter } from 'vue-router';

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

    const router = useRouter()

    const imageTemplates = ref([])
    const videoTemplates = ref([])
    const audioTemplates = ref([])
    const youtubeTemplates = ref([])
    const strawpollTemplates = ref([])
    const twitterTemplates = ref([])
    const htmlTemplates = ref([])

    templateRepository.getAllTemplates().then(tmpls => {
      tmpls.forEach(tmpl => {
        if(tmpl.type == "audio") {
          audioTemplates.value.push(tmpl)
        } else if (tmpl.type == "video") {
          videoTemplates.value.push(tmpl)
        } else if (tmpl.type == "image") {
          imageTemplates.value.push(tmpl)
        } else if (tmpl.type == "youtube") {
          youtubeTemplates.value.push(tmpl)
        } else if (tmpl.type == "strawpoll") {
          strawpollTemplates.value.push(tmpl)
        } else if (tmpl.type == "twitter") {
          twitterTemplates.value.push(tmpl)
        } else if (tmpl.type == "html") {
          htmlTemplates.value.push(tmpl)
        } 
      })
    })

    function persistTemplate(template) {
      templateService.setTemplate(template.type, template.template)
      router.push({name: "templateEditor", params: {type: template.type}})
    }

    return {
      imageTemplates,
      videoTemplates,
      audioTemplates,
      youtubeTemplates,
      strawpollTemplates,
      twitterTemplates,
      htmlTemplates,
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


