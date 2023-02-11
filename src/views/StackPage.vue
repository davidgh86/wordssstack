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
                <ion-input :value="store.state.title" @ionInput="setTitle($event.target.value)"
                ></ion-input>
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
        <ion-list>
          <ion-radio-group :value="plainShareType" @ionChange="radioGroupChange">
            <ion-item>
              <ion-label>Html</ion-label>
              <ion-radio slot="end" value="html"></ion-radio>
            </ion-item>
            <ion-item>
              <ion-label>Url</ion-label>
              <ion-radio slot="end" value="url"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>
        <!-- <ion-row>Here {{ store.state.caretPosition }} - Node name - {{ store.state.caretPositionNodeName }} - {{ store.state.htmlEditorContent }}</ion-row> -->
        <ion-row v-if="plainShareType==='html'">
          <ion-col>
            <quill-editor
                v-model:value="store.state.htmlEditorContent" 
                
                @focus="updateCaretPosition($event)"
                @ready="updateCaretPosition($event)"
                @change="updateCaretPosition($event)"
              />
          </ion-col>
        </ion-row>        
        <ion-row v-if="plainShareType==='url'">
          <ion-input :value="inputUrlContent" @ionInput="setInputUrl($event.target.value)"></ion-input>
        </ion-row>
        <ion-row v-if="plainShareType">
          <ion-button color="primary" @click="addHtmlContent">Add Content</ion-button>
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
          IonButton, IonInput, IonItem, IonLabel, IonIcon, 
          loadingController, IonRadioGroup, IonRadio, IonList } from '@ionic/vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { quillEditor } from 'vue3-quill'

import { closeCircle } from 'ionicons/icons';

import _ from 'lodash'
import stackManager from '@/service/stackManager';

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
    IonRadioGroup,
    IonRadio,
    IonList,
    draggable: VueDraggableNext,
    quillEditor
  },
  setup() {
    
    const store = useStore()

    const title = ref("")

    const inputUrlContent = ref("")

    const plainShareType = ref("html")

    //const position = ref(-1)
    //const nodeName = ref("")

    // caretPosition: -1, 
    //store.state.caretPositionNodeName
    // caretPositionNodeName: ""

    function setInputUrl(url) {
      inputUrlContent.value = url
    }

    function radioGroupChange(event) {
      plainShareType.value = event.target.value
    }
    
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

    function updateCaretPosition(event) {
      
      store.state.caretPosition = getCaretPosition()
    }

    function getCaretPosition() {
      if (window.getSelection && window.getSelection().getRangeAt) {

        if (window.getSelection().rangeCount == 0) {
          return -1
        }
        var range = window.getSelection().getRangeAt(0);
        var selectedObj = window.getSelection();
        var rangeCount = 0;
        var childNodes = selectedObj.anchorNode.parentNode.childNodes;
        store.state.caretPositionNodeName = selectedObj.anchorNode.parentNode.nodeName
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i] == selectedObj.anchorNode) {
                break;
            }
            if ((childNodes[i] as HTMLElement).outerHTML)
                rangeCount += (childNodes[i] as HTMLElement).outerHTML.length;
            else if (childNodes[i].nodeType == 3) {
                rangeCount += childNodes[i].textContent.length;                       
            }
        }
        return range.startOffset + rangeCount;
      }
      return -1;
    }

    function addHtmlContent(){
      if (plainShareType.value === "html") {
        store.commit('addHtmlContent')
      } else if (plainShareType.value === "url") {
        stackManager.processTextUrl(inputUrlContent.value)
        inputUrlContent.value = ""
      }
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
      plainShareType,
      setTitle,
      closeCircle,
      removeElement,
      radioGroupChange,
      store,
      setInputUrl,
      inputUrlContent,
      updateCaretPosition
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
