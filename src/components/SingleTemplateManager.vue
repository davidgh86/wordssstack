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
            <TemplateVariablesManager :defaultTemplateVariables="placeholders" @variableAdded="newVar($event)" @variableChange="confirmVar($event)" @variableRemoved="varRemoved($event)">
            </TemplateVariablesManager>
        </ion-row>
    </ion-grid>
</template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { 
            IonRow, 
            IonGrid, 
            IonButton, 
          } from '@ionic/vue'
  import TemplateVariablesManager from '@/components/TemplateVariablesManager.vue';
  
  export default defineComponent({
    name: 'SingleTemplateManager',
    components: {
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
          myField.value = myField.value.substring(0, startPos)
              + myValue
              + myField.value.substring(endPos, myField.value.length);
        } else {
            myField.value += myValue;
        }
      }
  
      function newVar(event) {
        //placeholders.value.push(event)
      }
  
      function confirmVar(event) {
        //placeholders.value[event.idx] = event.variable
      }
  
      function varRemoved(event) {
        //placeholders.value.splice(event, 1)
      }
  
  
      return {
        htmlEditorContent,
        placeholders,
        editPlaceHolder,
        saveTemplate,
        newVar,
        confirmVar,
        varRemoved
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
  