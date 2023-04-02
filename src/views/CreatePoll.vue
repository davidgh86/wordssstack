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
                <ion-input :value="pollTitle" @ionInput="setPollTitle($event.target.value)"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row v-for="(option, index) in options" :key="index">
            <ion-col size="11">
              <ion-item>
                <ion-label position="floating">Option {{ index + 1 }}</ion-label>
                <ion-input :value="options[index]" @ionInput="setOption($event.target.value, index)"></ion-input>
              </ion-item>
            </ion-col>
            
            <ion-col size="1">
                <ion-icon :src="trashOutline" @click="removeOption(index)"></ion-icon>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="5">
            </ion-col>
            <ion-col size="2">
              <ion-icon :src="addCircleOutline" @click="addOption()" ></ion-icon>
            </ion-col>
            <ion-col size="5">
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-button color="primary" @click="createPoll()">Create</ion-button>
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
          IonInput, IonItem, IonLabel, IonIcon, IonButton } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { addCircleOutline, trashOutline } from 'ionicons/icons';
import strawpollApi from '@/service/strawpollApi';
import stackManager from '@/service/stackManager';

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
    IonButton
  },
  setup() {
    
    const router = useRouter()
    
    const pollTitle = ref("")

    const options = ref([""])

    function setPollTitle(title) {
      pollTitle.value = title
    }

    function setOption(option, position){
      options.value[position] = option
    }

    function removeOption(index) {
      options.value.splice(index, 1)
    }

    function addOption() {
      options.value.push("")
    }

    function createPoll() {
      const title = pollTitle.value.trim()
      const survey = options.value.map(el=> el.trim()).filter(el => !!el.trim())
      if (!title || survey.length == 0) {
        alert ("check title and options")
        return
      }
      strawpollApi.createPoll(title, survey)
        .then(resp => stackManager.addUrlContent(resp.embed_url).then(() => {
          options.value = [""]
          pollTitle.value = ""
          router.push("/inbox")
        }))
        .catch((e) => alert("failed cerating poll "+ JSON.stringify(e)))
    }

    return {
      pollTitle,
      setPollTitle,
      addCircleOutline,
      trashOutline,
      options,
      addOption,
      setOption,
      removeOption,
      createPoll
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
