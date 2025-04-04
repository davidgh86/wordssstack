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
          <ion-row>Hola {{ templateType }} </ion-row>
          <ion-row>
            <ion-list>
              <ion-item>
                <ion-select placeholder="Select template" :value="templateType" @ionChange="radioGroupChange">
                  <ion-select-option value="image">Image</ion-select-option>
                  <ion-select-option value="video">Video</ion-select-option>
                  <ion-select-option value="html">Html</ion-select-option>
                  <ion-select-option value="youtube">Youtube</ion-select-option>
                  <ion-select-option value="twitter">Twitter</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
          </ion-row>
        </ion-grid>
        <SingleTemplateManager v-if="templateType == 'image'" :variables="imageTemplateVariables" :htmlContent="imageTemplate" @confirmTemplate="saveTemplate($event)"></SingleTemplateManager>
        <SingleTemplateManager v-if="templateType == 'video'" :variables="videoTemplateVariables" :htmlContent="videoTemplate" @confirmTemplate="saveTemplate($event)"></SingleTemplateManager>
        <SingleTemplateManager v-if="templateType == 'html'" :variables="htmlTemplateVariables" :htmlContent="htmlTemplate" @confirmTemplate="saveTemplate($event)"></SingleTemplateManager>
        <SingleTemplateManager v-if="templateType == 'youtube'" :variables="youtubeTemplateVariables" :htmlContent="youtubeTemplate" @confirmTemplate="saveTemplate($event)"></SingleTemplateManager>
        <SingleTemplateManager v-if="templateType == 'twitter'" :variables="twitterTemplateVariables" :htmlContent="twitterTemplate" @confirmTemplate="saveTemplate($event)"></SingleTemplateManager>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonButtons, IonContent, IonHeader, IonMenuButton, 
          IonPage, IonTitle, IonToolbar, IonRow, IonGrid,  
          IonItem,
          IonList,
          IonSelect,
          IonSelectOption
        } from '@ionic/vue'
import templateEditor from '../service/templateService'
import templateManagerService from '../service/templateManagerService'
import SingleTemplateManager from '@/components/SingleTemplateManager.vue';
//import { quillEditor } from 'vue3-quill'

export default defineComponent({
  name: 'TemplateEditor',
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
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    SingleTemplateManager
},
  setup() {

    const templateType = ref("image")

    const htmlEditorContent = ref(templateEditor.getImageTemplate())

    const imageTemplateVariables = ref(templateManagerService.getImageTemplateVariables())
    const videoTemplateVariables = ref(templateManagerService.getVideoTemplateVariables())
    const youtubeTemplateVariables = ref(templateManagerService.getYoutubeTemplateVariables())
    const htmlTemplateVariables = ref(templateManagerService.getHtmlTemplateVariables())
    const twitterTemplateVariables = ref(templateManagerService.getTwitterTemplateVariables())


    const imageTemplate = ref(templateManagerService.getImageTemplate())
    const videoTemplate = ref(templateManagerService.getVideoTemplate())
    const youtubeTemplate = ref(templateManagerService.getYoutubeTemplate())
    const htmlTemplate = ref(templateManagerService.getHtmlTemplate())
    const twitterTemplate = ref(templateManagerService.getTwitterTemplate())

    //const a = ref(Mustache.render("{{title}} spends {{calc}}", {title: "titulo", calc: "tis" }))

    function radioGroupChange(event) {
      templateType.value = event.target.value
      let type = event.target.value

      if (type === "image") {
        htmlEditorContent.value = templateEditor.getImageTemplate()
      } else if (type === "video") {
        htmlEditorContent.value = templateEditor.getVideoTemplate()
      } else if (type === "html") {
        htmlEditorContent.value = templateEditor.getHtmlTemplate()
      } else if (type === "youtube") {
        htmlEditorContent.value = templateEditor.getYoutubeTemplate()
      } else if (type === "twitter") {
        htmlEditorContent.value = templateEditor.getTwitterTemplate()
      }
    }

    function saveTemplate(event) {
      let type = templateType.value

      if (type === "image") {
        templateManagerService.setImageTemplateAndVariables(event.template, event.variables)
      } else if (type === "video") {
        templateManagerService.setVideoTemplateAndVariables(event.template, event.variables)
      } else if (type === "html") {
        templateManagerService.setHtmlTemplateAndVariables(event.template, event.variables)
      } else if (type === "youtube") {
        templateManagerService.setYoutubeTemplateAndVariables(event.template, event.variables)
      } else if (type === "twitter") {
        templateManagerService.setTwitterTemplateAndVariables(event.template, event.variables)
      }
    } 

    function newVar(event) {
      alert(JSON.stringify(event))
    }

    function confirmVar(event) {
      alert(JSON.stringify(event))
    }

    function varRemoved(event) {
      alert(event)
    }

    return {
      radioGroupChange,
      templateType,
      htmlEditorContent,
      saveTemplate,
      newVar,
      confirmVar,
      varRemoved,
      imageTemplateVariables,
      videoTemplateVariables,
      youtubeTemplateVariables,
      htmlTemplateVariables,
      twitterTemplateVariables,
      imageTemplate,
      videoTemplate,
      youtubeTemplate,
      htmlTemplate,
      twitterTemplate
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
