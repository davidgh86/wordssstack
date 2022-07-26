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
          <ion-row v-for="(item, index) in htmlStack" :key="index">
            <ion-col v-html="item">
            </ion-col>
          </ion-row>
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
import { defineComponent, ref, computed } from 'vue';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonRow, IonGrid, IonCol, IonButton } from '@ionic/vue';
//import { FileTypes, getFileTypeByExtension } from '../wordpressstack/fileTypes'
import StackElement from '../wordpressstack/stackElement'
import UploadableStackElement from '../wordpressstack/uploadableStackElement'
import StackElementFactory from '@/wordpressstack/stackElementFactory';

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
    IonButton
  },
  setup() {
    const filePath = ref("")
    const stack : StackElement[] = []
    const stackRef = ref(stack)
    const htmlStack = computed(() => {
      const result = []
      for (let element of stackRef.value) {
        if (element instanceof UploadableStackElement){
          result.push(element.getPrevisualizedHtmlElement())
        }
      }
      return result;
    })
    function askForFile() {
      var fileSelector = document.getElementById("fileSelector")
      fileSelector?.click()
    }
    function stackFile(event: { target: { files: string|any[]; }; }){
      var fileSelector = document.getElementById("fileSelector") as HTMLInputElement
      filePath.value = fileSelector.value;
      if(event.target.files.length > 0){
        var src = URL.createObjectURL(event.target.files[0]);
        stackByPath(src)
      }
    }
    // function stackFile(){
    //   var fileSelector = document.getElementById("fileSelector") as HTMLInputElement
    //   
    //   stackByPath(filePath.value)
    // }
    function stackByPath(fileUrl: string){
      const stackElement = StackElementFactory.getStackElement(fileUrl)
      stackRef.value.push(stackElement)
    }
    
    return {
      askForFile,
      filePath,
      stackFile,
      htmlStack
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
