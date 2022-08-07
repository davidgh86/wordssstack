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
                <ion-input :value="title" @ionInput="title = $event.target.value;"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid>
          <ion-row>
            <ion-col size="2">
              <!-- left margin -->
            </ion-col>
            <ion-col size="6">
              
              <ion-grid>
                <draggable :list="stackRef" @change="log">
                  <ion-row v-for="(item, index) in stackRef" :key="index">
                    <ion-col class="element">
                      <ion-icon :src="closeCircle" class="x" @click="removeElement(index)"></ion-icon>
                      <!-- <button class="x" >
                        x
                      </button> -->
                      <div v-html="item.getPrevisualizedHtmlElement()">
                        
                      </div>
                    </ion-col>
                  </ion-row>
                </draggable>
              </ion-grid>
            </ion-col>
            <ion-col size="3">
              <!-- right margin -->
            </ion-col>
          </ion-row>
        </ion-grid>
      <input id="fileSelector" hidden type="file" name="myFile" @change="stackFile "/>
    </ion-content>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button color="primary" @click="askForFile">Primary</ion-button>
          </ion-col>
          <ion-col>
            <ion-button color="primary" @click="cleanCache">Clean cache</ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <quill-editor
                v-model:value="htmlEditorContent"
              />
            <ion-button color="primary" @click="addHtmlContent">Add Content</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex'
import { IonButtons, IonContent, IonHeader, IonMenuButton, 
          IonPage, IonTitle, IonToolbar, IonRow, IonGrid, IonCol, 
          IonButton, IonInput, IonItem, IonLabel, IonIcon } from '@ionic/vue'
import StackElement from '../wordpressstack/stackElement'
import StackElementFactory from '@/wordpressstack/stackElementFactory'
import { VueDraggableNext } from 'vue-draggable-next'
import { quillEditor } from 'vue3-quill'
import StackElementStorageManager from '@/wordpressstack/stackElementStorageManager'
import UploadableStackElement from '@/wordpressstack/uploadableStackElement'
import { FileTypes } from '@/wordpressstack/fileTypes'
import { closeCircle } from 'ionicons/icons';

const stackElementStorageManager = new StackElementStorageManager()

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
    const title = ref("")
    const htmlEditorContent = ref("<p></p>")
  
    const stack : StackElement[] = []
    const stackRef = reactive(stack)

    const store = useStore()

    //store.commit("increment")
    console.log(store.state.count)

    stackElementStorageManager.updateStackElementsFromLocalStorage().then(
      () => {
        Array.from(stackElementStorageManager.getStackIds().values()).forEach(element => {
          stackRef.push(element)
        });
      }
    )
    
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
      const stackElement = StackElementFactory.getStackElement(file)
      if (stackElement instanceof UploadableStackElement){
        stackElementStorageManager.saveStackElement(stackElement).then(() => stackRef.push(stackElement))
      }else {
        stackRef.push(stackElement)
      }
    }
    function addHtmlContent(){
      const element = StackElementFactory.getStackElementByString(FileTypes.HTML, {html: htmlEditorContent.value})
      stackElementStorageManager.saveStackElement(element).then(() => {
        stackRef.push(element)
        htmlEditorContent.value = ""
      })
    }

    function removeElement(index){
      stackElementStorageManager.removeElement(stackRef[index]).then(
        () => {
          stackRef.splice(index, 1)
          stackElementStorageManager.saveStack(stackRef)
        }
      );
    }

    function log() {
      stackElementStorageManager.saveStack(stackRef).then()
    }

    function cleanCache() {
      localStorage.clear()
      location.reload()
    }
    
    return {
      askForFile,
      stackFile,
      stackRef,
      title,
      htmlEditorContent,
      addHtmlContent,
      cleanCache,
      log,
      closeCircle,
      removeElement
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
