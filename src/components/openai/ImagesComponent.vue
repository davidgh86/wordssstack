<template>
  <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
            <ion-select aria-label="mode" placeholder="Select model" v-model="action" value="create" @ion-change="handleOptionChange">
                <ion-select-option v-for="item of actions" :value="item.value" :key="item.value">{{ item.value }}</ion-select-option>
            </ion-select>
        </ion-row>
        <ion-row>
          <router-view @wrong-credentials="emitWrongCredentials($event)"></router-view>
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
import { useRouter } from 'vue-router';

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
},
setup(props, { emit }) {

  const router = useRouter()

  const actions = ref([
    { value: "create" },
    //{ value: "edit" },
    { value: "variation" }
  ]);

  const action = ref("transform")

  function handleOptionChange() {
    router.push({ name: action.value })
  }

  function emitWrongCredentials(method) {
    emit("wrong-credentials", method)
  }

  return {
    action,
    actions,
    emitWrongCredentials,
    handleOptionChange
  }
}
});
</script>

<style scoped>
</style>
