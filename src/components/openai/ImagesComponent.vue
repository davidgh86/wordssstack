<template>
  <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
            <ion-select aria-label="mode" placeholder="Select model" v-model="action" value="create">
                <ion-select-option v-for="item of actions" :value="item.value" :key="item.value">{{ item.value }}</ion-select-option>
            </ion-select>
        </ion-row>
        <ion-row v-if="action === 'create'">
          <create-images-component @wrong-credentials="emitWrongCredentials"></create-images-component>
        </ion-row>
        <ion-row v-if="action === 'edit'">
          <edit-images-component @wrong-credentials="emitWrongCredentials"></edit-images-component>
        </ion-row>
        <ion-row v-if="action === 'variation'">
          <variate-images-component @wrong-credentials="emitWrongCredentials"></variate-images-component>
        </ion-row>

      </ion-grid>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { 
        IonContent, IonRow, IonGrid, 
        IonSelect, IonSelectOption
      } from '@ionic/vue'
import CreateImagesComponent from './images/CreateImagesComponent.vue';
import EditImagesComponent from './images/EditImagesComponent.vue';
import VariateImagesComponent from './images/VariateImagesComponent.vue';

export default defineComponent({
name: 'ImagesComponent',
emits: ['wrong-credentials'],
expose: ['callOpenAi'],
components: {
  IonContent,
  IonGrid,
  IonRow,
  IonSelect,
  IonSelectOption,
  CreateImagesComponent,
  EditImagesComponent,
  VariateImagesComponent,
},
setup(props, { emit }) {

  const actions = ref([
    { value: "create" },
    //{ value: "edit" },
    { value: "variation" }
  ]);

  const action = ref("transform")

  function emitWrongCredentials() {
    emit("wrong-credentials")
  }

  return {
    action,
    actions,
    emitWrongCredentials
  }
}
});
</script>

<style scoped>
</style>
