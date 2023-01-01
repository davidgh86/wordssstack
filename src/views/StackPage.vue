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
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="floating">Title</ion-label>
                <!-- workaround because not working -->
                <ion-input :value="store.state.title" @ionInput="setTitle($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid>
          <ion-row>
            <ion-col size="2" style="background-color: grey;">
              <!-- left margin -->
            </ion-col>
            <ion-col size="6">
              
              <ion-grid>
                <draggable :list="store.state.stack" @change="saveOrder">
                  <ion-row v-for="(item, index) in store.state.stack" :key="index">
                    <ion-col class="element">
                      <ion-icon :src="closeCircle" class="x" @click="removeElement(index)"></ion-icon>
                      <div v-html="item.getPrevisualizedHtmlElement()">
                      </div>
                    </ion-col>
                  </ion-row>
                </draggable>
              </ion-grid>
            </ion-col>
            <ion-col size="3" style="background-color: grey;">
              <!-- right margin -->
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-button color="primary" @click="askForFile">Add File</ion-button>
            </ion-col>
            <ion-col>
              <ion-button color="primary" @click="publish">Publish</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      <input id="fileSelector" hidden type="file" name="myFile" @change="stackFile "/>
    </ion-content>
    <ion-content>
      <ion-grid>
        
        <ion-row>
          <ion-col>
            <quill-editor
                v-model:value="store.state.htmlEditorContent"
              />
            <ion-button color="primary" @click="addHtmlContent">Add Content</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex'
import { IonButtons, IonContent, IonHeader, IonMenuButton, 
          IonPage, IonTitle, IonToolbar, IonRow, IonGrid, IonCol, 
          IonButton, IonInput, IonItem, IonLabel, IonIcon, loadingController } from '@ionic/vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { quillEditor } from 'vue3-quill'

import { closeCircle } from 'ionicons/icons';

import _ from 'lodash'

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
    IonInput,
    IonItem,
    IonLabel,
    IonIcon,
    draggable: VueDraggableNext,
    quillEditor
  },
  setup() {
    
    const store = useStore()

    const title = ref("")
    
    function askForFile() {
      var fileSelector = document.getElementById("fileSelector")
      fileSelector?.click()
    }
    function stackFile(event){
      if(event.target.files.length > 0){
        stackByPath(event.target.files[0])
      }
    }
    function stackByPath(file: File){
      store.commit('stackByPath', file)
    }
    function addHtmlContent(){
      store.commit('addHtmlContent')
    }
    function removeElement(index){
      store.commit('removeElement', index)
    }
    function saveOrder() {
      store.commit('saveStack')
    }

    const setTitle = _.debounce((postTitle) => {
        store.commit('setTitle', postTitle)
      }, 1000);

    function publish(){
      if (!store.state.title){
        alert("title is mandatory")
        return
      }
      loadingController.create({
        message: "uploading"
      }).then(l => {
        l.present()
        store.dispatch("publish").then(
          () => {
            l.dismiss()
            alert("Published")
            store.dispatch("clear").then()
          }
        ).catch(
          (error) => {
            l.dismiss()
            alert("Failed")
            alert(JSON.stringify(error))
          }
        )
      })
    }
    
    return {
      title,
      askForFile,
      stackFile,
      addHtmlContent,
      saveOrder,
      publish,
      setTitle,
      closeCircle,
      removeElement,
      store
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
