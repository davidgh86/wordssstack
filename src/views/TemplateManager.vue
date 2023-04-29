<template>
  <ion-page>
    <ion-content>
      <ion-row>
        <ion-select aria-label="mode" placeholder="Select mode" v-model="templateMode" @ion-change="handleOptionChange">
          <ion-select-option value="templateEditor">Editor</ion-select-option>
          <ion-select-option value="templateLoader">Loader</ion-select-option>
          <ion-select-option value="templateLibrary">Library</ion-select-option>
        </ion-select>
        <router-view></router-view>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonContent, 
          IonPage, IonRow, 
          IonSelect,
          IonSelectOption
        } from '@ionic/vue'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'TemplateManager',
  components: {
    IonContent,
    IonPage,
    IonRow,
    IonSelect,
    IonSelectOption,
},
  setup() {

    const router = useRouter()

    const templateMode = ref("templateLoader")

    function handleOptionChange() {
      router.push({ name: templateMode.value })
    }
    

    return {
      templateMode,
      handleOptionChange
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


