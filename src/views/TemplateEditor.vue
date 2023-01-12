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
                </ion-select>
              </ion-item>
            </ion-list>
          </ion-row>
        </ion-grid>
        <SingleTemplateManager v-if="templateType == 'image'" :variables="imageTemplateVariables" :htmlContent="imageTemplate"></SingleTemplateManager>
        <SingleTemplateManager v-if="templateType == 'video'" :variables="videoTemplateVariables" :htmlContent="videoTemplate"></SingleTemplateManager>
        <SingleTemplateManager v-if="templateType == 'html'" :variables="htmlTemplateVariables" :htmlContent="htmlTemplate"></SingleTemplateManager>
        <SingleTemplateManager v-if="templateType == 'youtube'" :variables="youtubeTemplateVariables" :htmlContent="youtubeTemplate"></SingleTemplateManager>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { IonButtons, IonContent, IonHeader, IonMenuButton, 
          IonPage, IonTitle, IonToolbar, IonRow, IonGrid,  
          IonItem,
          IonList,
          IonSelect,
          IonSelectOption
        } from '@ionic/vue'
import { useRouter } from 'vue-router'
import templateEditor from '../service/templateService'
import templateVariableService from '../service/templateManagerService'
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
    
    const router = useRouter()

    const title = ref("")
    
    const hostName = ref("")

    const user = ref("")

    const password = ref("")

    const templateType = ref("image")

    const htmlEditorContent = ref(templateEditor.getImageTemplate())

    const imageTemplateVariables = ref(templateVariableService.getImageTemplateVariables())
    const videoTemplateVariables = ref(templateVariableService.getVideoTemplateVariables())
    const youtubeTemplateVariables = ref(templateVariableService.getYoutubeTemplateVariables())
    const htmlTemplateVariables = ref(templateVariableService.getHtmlTemplateVariables())

    const imageTemplate = ref(templateVariableService.getImageTemplate())
    const videoTemplate = ref(templateVariableService.getVideoTemplate())
    const youtubeTemplate = ref(templateVariableService.getYoutubeTemplate())
    const htmlTemplate = ref(templateVariableService.getHtmlTemplate())

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
      }
    }

    function saveTemplate() {
      let type = templateType.value

      if (type === "image") {
        templateEditor.setImageTemplate(htmlEditorContent.value)
      } else if (type === "video") {
        templateEditor.setVideoTemplate(htmlEditorContent.value)
      } else if (type === "html") {
        templateEditor.setHtmlTemplate(htmlEditorContent.value)
      } else if (type === "youtube") {
        templateEditor.setYoutubeTemplate(htmlEditorContent.value)
      }
    }

    function getTextAreaElement() {
      return document.getElementsByClassName("input-template").item(0).getElementsByTagName("textarea").item(0)
    }

    function setImagePlaceHolder() {
      let type = templateType.value

      let placeholder

      if (type === "image") {
        placeholder = "{image_src}"
      } else if (type === "video") {
        placeholder = "{video_src}" // {video_extension}
      } else if (type === "html") {
        placeholder = "{html_content}"
      } else if (type === "youtube") {
        placeholder = "{youtube_video_id}"
      }
      editPlaceHolder(placeholder)
    }

    function editPlaceHolder(myValue) {
      let myField = getTextAreaElement()
      if (myField.selectionStart || myField.selectionStart == 0) {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
      } else {
          myField.value += myValue;
      }
    }

    function setHostName(host) {
      hostName.value = host
    }

    function setUser(usr) {
      user.value = usr
    }

    function setPassword(pwd) {
      password.value = pwd
    }

    function isConfigured(): boolean {
      return !!localStorage.getItem("host") && !!localStorage.getItem("user") && !!localStorage.getItem("password")
    }

    function setConfig() {
      hostName.value = hostName.value.trim()
      user.value = user.value.trim()
      password.value = password.value.trim()

      localStorage.setItem("host", hostName.value)
      localStorage.setItem("user", user.value)
      localStorage.setItem("password", password.value)
      if (isConfigured()) {
        router.push("/inbox")
      }
    }    

    function removeConfig() {
      localStorage.removeItem("host")
      localStorage.removeItem("user")
      localStorage.removeItem("password")
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

    onMounted(() => {
      if (localStorage.getItem("host")) {
        hostName.value = localStorage.getItem("host")
      }
      if (localStorage.getItem("user")) {
        user.value = localStorage.getItem("user")
      }
      if (localStorage.getItem("password")) {
        password.value = localStorage.getItem("password")
      }
    })

    return {
      title,
      hostName,
      setHostName,
      setUser,
      setPassword,
      user,
      password,
      setConfig,
      removeConfig,
      radioGroupChange,
      templateType,
      htmlEditorContent,
      setImagePlaceHolder,
      saveTemplate,
      newVar,
      confirmVar,
      varRemoved,
      imageTemplateVariables,
      videoTemplateVariables,
      youtubeTemplateVariables,
      htmlTemplateVariables,
      imageTemplate,
      videoTemplate,
      youtubeTemplate,
      htmlTemplate
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
