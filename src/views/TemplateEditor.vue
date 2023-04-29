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
                  <ion-select-option v-for="(__, propertyName) in templateMap" :key="propertyName" :value="propertyName">{{propertyName}}</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
          </ion-row>
        </ion-grid>
        
        <ion-row v-for="(value, propertyName) in templateMap" :key="propertyName">
          <SingleTemplateManager v-if="templateType == propertyName" 
                :variables="value.variables" 
                :htmlContent="value.template" @confirmTemplate="saveTemplate($event)"></SingleTemplateManager>
        </ion-row>
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
import { TypesConstantsConfig } from '@/constants/typesConstantsConfig';
import { useRoute } from 'vue-router'

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

    const templateMap = ref(TypesConstantsConfig.getTemplateMap())

    const route = useRoute()

    const type = route.params.type?route.params.type as string:"image"

    const templateType = ref(type)

    const htmlEditorContent = ref(templateEditor.getTemplate(type))

    function radioGroupChange(event) {
      templateType.value = event.target.value
      const type = event.target.value

      htmlEditorContent.value = templateEditor.getTemplate(type)
    }

    function saveTemplate(event) {
      const type = templateType.value
      templateManagerService.setTemplateAndVariables(type, event.template, event.variables)
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
      templateMap,
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


