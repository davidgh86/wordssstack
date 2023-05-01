<template>
  <ion-page>
    <ion-content>
      <ion-row v-if="!loaded">
        <ion-col>
          <ion-button @click="loadPreviousPage()" v-if="currentPageNumber > 1">
            Previous
          </ion-button>
        </ion-col>
        <ion-col>
          {{ currentPageNumber }}
        </ion-col>
        <ion-col>
          <ion-button @click="loadNextPage()" v-if="limitPage === -1 || currentPageNumber < limitPage">
            Next
          </ion-button>
        </ion-col>
      </ion-row>
      <ion-row v-for="post in posts" :key="post.id">
        <ion-col>
          <ion-row>
            <ion-col size="6">
              {{ post.title }}
            </ion-col>
            <ion-col sze="3">
              <ion-button @click="obtainTemplates(post.id)">
                Load
              </ion-button>
            </ion-col>
            <ion-col sze="3">
              <ion-button @click="toggleInfo(post.id)">
                prvw
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row v-if="!!post.link && selectedId === post.id">
            <a :href="post.link">link</a>
          </ion-row>
          <ion-row v-if="!!post.link && selectedId === post.id">
            <iframe  :src="post.link" ></iframe>
          </ion-row>
        </ion-col>
      </ion-row>

      <ion-row v-if="loaded">
        <ion-col>
          <ion-row>
            <ion-col>
              <ion-button @click="selectPost()">
                Select another post
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <h3>Image</h3>
            </ion-col>
          </ion-row>
          <ion-row v-for="(template, index) in imageTemplates" :key="index">
            <ion-col col="6">
              <ion-textarea :readonly="true">{{ template }}</ion-textarea>
            </ion-col>
            <ion-col col="6">
              <ion-button @click="persistTemplate(template, 'image')">save</ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <h3>Audio</h3>
            </ion-col>
          </ion-row>
          <ion-row v-for="(template, index) in audioTemplates" :key="index">
            <ion-col col="6">
              <ion-textarea :readonly="true">{{ template }}</ion-textarea>
            </ion-col>
            <ion-col col="6">
              <ion-button @click="persistTemplate(template, 'audio')">save</ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <h3>Video</h3>
            </ion-col>
          </ion-row>
          <ion-row v-for="(template, index) in videoTemplates" :key="index">
            <ion-col col="6">
              <ion-textarea :readonly="true">{{ template }}</ion-textarea>
            </ion-col>
            <ion-col col="6">
              <ion-button @click="persistTemplate(template, 'video')">save</ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <h3>Youtube</h3>          
            </ion-col>
          </ion-row>
          <ion-row v-for="(template, index) in youtubeTemplates" :key="index">
            <ion-col col="6">
              <ion-textarea :readonly="true">{{ template }}</ion-textarea>
            </ion-col>
            <ion-col col="6">
              <ion-button @click="persistTemplate(template, 'youtube')">save</ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <h3>Twitter</h3>          
            </ion-col>
          </ion-row>
          <ion-row v-for="(template, index) in twitterTemplates" :key="index">
            <ion-col col="6">
              <ion-textarea :readonly="true">{{ template }}</ion-textarea>
            </ion-col>
            <ion-col col="6">
              <ion-button @click="persistTemplate(template, 'twitter')">save</ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <h3>Strawpoll</h3>          
            </ion-col>
          </ion-row>
          <ion-row v-for="(template, index) in strawpollTemplates" :key="index">
            <ion-col col="6">
              <ion-textarea :readonly="true">{{ template }}</ion-textarea>
            </ion-col>
            <ion-col col="6">
              <ion-button @click="persistTemplate(template, 'strawpoll')">save</ion-button>
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>

      
    </ion-content>
  </ion-page>
  
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonContent,
          IonPage, IonRow, IonCol,
          IonButton, IonTextarea,
        } from '@ionic/vue'
import templateLoaderService from "@/service/template/templateLoaderService"
import templateRepository from "@/service/database/templateRepository"

import wordpressApi from '@/service/wordpressApi';

export default defineComponent({
  name: 'TemplateLoader',
  components: {
    IonContent,
    // IonButtons,
    // IonHeader,
    // IonMenuButton,
    // IonPage,
    // IonTitle,
    // IonToolbar,
    // IonGrid,
    IonRow,
    IonCol,
    IonPage,
    IonButton,
    IonTextarea,
    // IonList,
    // IonSelect,
    // IonSelectOption,
    // SingleTemplateManager
},
  setup() {

    const selectedId = ref(-1)

    const limitPage = ref(-1)

    const posts = ref([])

    const loaded = ref(false)

    const imageTemplates = ref([])
    const videoTemplates = ref([])
    const audioTemplates = ref([])
    const youtubeTemplates = ref([])
    const strawpollTemplates = ref([])
    const twitterTemplates = ref([])
    const htmlTemplates = ref([])

    const currentPageNumber = ref(1);

    loadPage(currentPageNumber.value, () => { return })

    function loadNextPage() {
      currentPageNumber.value += 1
      loadPage(currentPageNumber, () => {
        currentPageNumber.value -= 1
        limitPage.value = currentPageNumber.value
      })
    }

    function loadPreviousPage() {
      if (currentPageNumber.value === 1) {
        return;
      }
      currentPageNumber.value -= 1
      loadPage(currentPageNumber, () => {
        currentPageNumber.value += 1
      })
    }

    function loadPage(pag, doOnError) {
      wordpressApi.getPaginatedPosts(10, pag).then(pagePost => {
        const nextPagePosts = pagePost.map(post => {
          return {
            id: post.id,
            link: post.link,
            title: post.title?.rendered
          }
        })

        posts.value = nextPagePosts
      }).catch((e) => {
        doOnError()
        console.error(JSON.stringify(e))
      })
    }

    async function obtainTemplates(id) {

      const postContent = await wordpressApi.getPostById(id)

      console.log("=======> " + JSON.stringify(postContent))

      if (!postContent.content || !postContent.content.rendered) {
        alert("Not content in post")
        return;
      }

      const templates = templateLoaderService.inferTemplates(postContent.content.rendered)
      
      imageTemplates.value = templates.image?templates.image:[]
      videoTemplates.value = templates.video?templates.video:[]
      audioTemplates.value = templates.audio?templates.audio:[]
      youtubeTemplates.value = templates.youtube?templates.youtube:[]
      strawpollTemplates.value = templates.strawpoll?templates.strawpoll:[]
      twitterTemplates.value = templates.twitter?templates.twitter:[]
      htmlTemplates.value = templates.html?templates.html:[]

      loaded.value = true

    }

    async function persistTemplate(template, type) {
      await templateRepository.saveTemplate(template,type)
    }

    function toggleInfo(selId) {
      if (selId === selectedId.value) {
        selectedId.value = -1
      } else {
        selectedId.value = selId
      }
    }

    function selectPost() {
      loaded.value = false;
    }

    return {
      imageTemplates,
      videoTemplates,
      audioTemplates,
      youtubeTemplates,
      strawpollTemplates,
      twitterTemplates,
      htmlTemplates,
      obtainTemplates,
      persistTemplate,
      selectedId,
      posts,
      loadNextPage,
      loadPreviousPage,
      toggleInfo,
      loaded,
      selectPost,
      currentPageNumber,
      limitPage
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


