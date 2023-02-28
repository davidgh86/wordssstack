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
          <ion-row v-for="(option, index) in options" :key="index">
            <ion-col size="11">
              <ion-item>
                {{ option }}
              </ion-item>
            </ion-col>
            
            <ion-col size="1">
                <ion-icon :src="trashOutline" @click="removeOption(index)"></ion-icon>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="11">
              <ion-item>
                <ion-label position="floating">new tag</ion-label>
                <ion-input :value="inputTag" @ionInput="setOption($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
            <ion-col size="1">
              <ion-icon :src="addCircleOutline" @click="addOption()" ></ion-icon>
            </ion-col>
          </ion-row>  
        </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonButtons, IonContent, IonHeader, IonMenuButton, 
          IonPage, IonTitle, IonToolbar, IonRow, IonGrid, IonCol, 
          IonInput, IonItem, IonLabel, IonIcon } from '@ionic/vue'
import { addCircleOutline, trashOutline } from 'ionicons/icons';

import tagsManager from '@/service/tagsManager';

export default defineComponent({
  name: 'CreatePoll',
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
    IonCol,
    IonInput,
    IonItem,
    IonLabel,
    IonIcon,
    
  },
  setup() {

    const options = ref(tagsManager.getTags())
    const inputTag = ref("")

    function setOption(option){
      inputTag.value = option
    }

    function removeOption(index) {
      tagsManager.removeTag(options.value[index])
      options.value.splice(index, 1)
    }

    function addOption() {
      tagsManager.addTag(inputTag.value)
      options.value.push(inputTag.value)
      inputTag.value=""
    }


    return {
      addCircleOutline,
      trashOutline,
      options,
      addOption,
      setOption,
      removeOption,
      inputTag
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
