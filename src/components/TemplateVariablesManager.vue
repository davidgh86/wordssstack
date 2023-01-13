<template>
    <ion-grid>
        <ion-row v-for="(templateVariable, idx) in templateVariables" :key="idx">
            <ion-col size="4">
                <ion-input :value="templateVariable.variableName" @ionInput="changeVariableName($event.target.value, idx)"></ion-input>
            </ion-col>
            <ion-col size="4">
                <ion-input :value="templateVariable.variableValue" @ionInput="changeVariableValue($event.target.value, idx)"></ion-input>
            </ion-col>
            <ion-col size="2">
                <ion-button color="primary" @click="emitVariable(idx)">OK</ion-button>
            </ion-col>
            <ion-col size="2">
                <ion-button color="primary" @click="removeItem(idx)">X</ion-button>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-button color="primary" @click="addVariable()">Add new variable</ion-button>
        </ion-row>
    </ion-grid>
</template>
  
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { 
          IonRow, IonGrid, 
          IonCol, 
          IonButton, 
          IonInput
        } from '@ionic/vue'
  
  export default defineComponent({
    name: 'TemplateVariablesManager',
    components: {
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonInput,
    },
    emits: [ "variableChange", "variableRemoved",  "variableAdded" ],
    props : {
        defaultTemplateVariables: Object
    },
    setup(props) {

        const templateVariables = ref(props.defaultTemplateVariables)

        function changeVariableName(name, idx) {
            templateVariables.value[idx].variableName = name
            this.$emit("variableNameChange", { idx : idx, variableName: name })
        }

        function changeVariableValue(value, idx) {
            templateVariables.value[idx].variableValue = value
            this.$emit("variableValueChange", { idx : idx, variableValue: value })
        }

        function emitVariable(idx) {
            this.$emit("variableChange", { idx : idx, variable: templateVariables.value[idx] })
        }

        function addVariable() {
            templateVariables.value.push({ variableName: "variableName" + templateVariables.value.length, variableValue: "variableValue" + templateVariables.value.length })
            this.$emit("variableAdded", templateVariables.value[templateVariables.value.length-1])
        }

        function removeItem(idx) {
            templateVariables.value.splice(idx, 1)
            this.$emit("variableRemoved", idx )
        }
    
        return {
            templateVariables,
            changeVariableName,
            changeVariableValue,
            emitVariable,
            addVariable,
            removeItem
        }
    }
  });
  </script>
  
  <style scoped>
  </style>
  