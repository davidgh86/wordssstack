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
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <div id="container">
        <ion-grid>
          <draggable class="dragArea list-group w-full" :list="stackRef">
            <ion-row v-for="(item, index) in stackRef" :key="index">
              <ion-col v-html="item.getPrevisualizedHtmlElement()">
              </ion-col>
            </ion-row>
          </draggable>
          <ion-row>
            <ion-col>
              <ion-button color="primary" @click="askForFile">Primary</ion-button>
            </ion-col>
            <ion-col>
              <ion-button color="primary" @click="askForFile">Publish</ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              {{ filePath }}
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <input id="fileSelector" hidden type="file" name="myFile" @change="stackFile"/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from 'vue';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonRow, IonGrid, IonCol, IonButton } from '@ionic/vue';
import StackElement from '../wordpressstack/stackElement'
import StackElementFactory from '@/wordpressstack/stackElementFactory';
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  name: 'FolderPage',
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
    IonButton,
    draggable: VueDraggableNext,
  },
  setup() {
    const filePath = ref("")
    const stack : StackElement[] = []
    const stackRef = reactive(stack)
    function askForFile() {
      var fileSelector = document.getElementById("fileSelector")
      fileSelector?.click()
    }
    function stackFile(event: { target: { files: string|any[]; }; }){
      var fileSelector = document.getElementById("fileSelector") as HTMLInputElement
      filePath.value = fileSelector.value;
      if(event.target.files.length > 0){
        stackByPath(event.target.files[0])
      }
    }
    function stackByPath(file: File){
      const stackElement = StackElementFactory.getStackElement(file)
      stackRef.push(stackElement)
    }
    
    return {
      askForFile,
      filePath,
      stackFile,
      stackRef
    }
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
