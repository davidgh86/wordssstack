<template>
    <ion-grid>
        <ion-row>
          <ion-col v-for="(itm, idx) in placeholders" :key="idx">
            <ion-button color="primary" @click="editPlaceHolder('{'+itm.variableName+'}')">{{ itm.variableName }}</ion-button>
          </ion-col>
        </ion-row>      
        <ion-row class="input-template">
            <textarea name="textarea" v-model="htmlEditorContent" rows="10" cols="50">Write something here</textarea>
        </ion-row>
        <ion-row>
            <ion-button color="primary" @click="saveTemplate()">Save template</ion-button>
        </ion-row>
        <ion-row>
            <TemplateVariablesManager 
              :defaultTemplateVariables="placeholders" 
              @variableAdded="newVar($event)" 
              @variableChange="confirmVar($event)" 
              @variableRemoved="varRemoved($event)"
              @variableNameChange="replaceVariblesInTemplate($event)"
            >
            </TemplateVariablesManager>
        </ion-row>
        <ion-row>
          <ion-col>
            <div v-html="renderedTemplate">
            </div>
          </ion-col>
        </ion-row>
    </ion-grid>
</template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { 
            IonCol,
            IonRow, 
            IonGrid, 
            IonButton, 
          } from '@ionic/vue'
  import TemplateVariablesManager from '@/components/TemplateVariablesManager.vue';
  import templateManagerService from '@/service/templateManagerService';

  import _ from 'lodash'
  
  export default defineComponent({
    name: 'SingleTemplateManager',
    components: {
      IonCol,
      IonGrid,
      IonRow,
      IonButton,
      TemplateVariablesManager
    },
    props : {
        htmlContent: String,
        variables: Array
    },
    setup(props) {

      const htmlEditorContent = ref(props.htmlContent)

      const placeholders = ref(props.variables)

      let oldVariables = JSON.parse(JSON.stringify(props.variables))

      const initialRender = templateManagerService.renderTemplate(oldVariables, props.htmlContent)

      const renderedTemplate = ref(initialRender)//templateManagerService.renderTemplate(oldVariables, props.htmlContent))

      function saveTemplate() {
        // TODO emit template save
        return
      }
  
      function getTextAreaElement() {
        return document.getElementsByClassName("input-template").item(0).getElementsByTagName("textarea").item(0)
      }
  
      function editPlaceHolder(myValue) {
        let myField = getTextAreaElement()
        if (myField.selectionStart || myField.selectionStart == 0) {
          var startPos = myField.selectionStart;
          var endPos = myField.selectionEnd;
          htmlEditorContent.value = myField.value.substring(0, startPos)
              + myValue
              + myField.value.substring(endPos, myField.value.length);
        } else {
          htmlEditorContent.value += myValue;
        }
        this.$emit("templateChanged", htmlEditorContent.value)
      }
  
      function newVar(event) {
        //oldVariables = placeholders.value
      }
  
      function confirmVar(event) {
        //oldVariables = placeholders.value
      }
  
      function varRemoved(event) {
        //oldVariables = placeholders.value
      }

      const replaceVariblesInTemplate = _.debounce((event) => {
        const idx = event.idx
        const oldVarName = oldVariables[idx].variableName
        const replaced = templateManagerService.updateTemplateVariables(oldVarName, event.variableName, htmlEditorContent.value)
        htmlEditorContent.value = replaced
        oldVariables = JSON.parse(JSON.stringify(placeholders.value))
        renderedTemplate.value = templateManagerService.renderTemplate(oldVariables, htmlEditorContent.value)
      }, 1000);

      // function replaceVariblesInTemplate(event) {
      //   //
      // }
  
  
      return {
        htmlEditorContent,
        placeholders,
        editPlaceHolder,
        saveTemplate,
        newVar,
        confirmVar,
        varRemoved,
        replaceVariblesInTemplate,
        renderedTemplate
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
  /* .no-style {
    all: initial;
  }

  .no-style * {
    all: unset;
  } */
  </style>
  