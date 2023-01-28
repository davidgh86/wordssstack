import { createStore } from 'vuex'

import StackElementStorageManager from '@/wordpressstack/stackElementStorageManager'
import UploadableStackElement from '@/wordpressstack/uploadableStackElement'
import StackElement from '@/wordpressstack/stackElement'
import StackElementFactory from '@/wordpressstack/stackElementFactory'
import { FileTypes, getFileTypeByExtension } from '@/wordpressstack/fileTypes'

const stackElementStorageManager = new StackElementStorageManager()


const stack : Array<StackElement> = []


export const store = createStore({
  state: {
    title: localStorage.getItem("title")?localStorage.getItem("title"):"",
    htmlEditorContent: "",
    youtubeContentUrl: "",
    twitterContentUrl: "",
    stack: stack
  },
  getters: {
    getTitle(state) {
      return state.title
    },
    getHtmlContent(state) {
      return state.htmlEditorContent
    }
  },
  // sincorno
  mutations: {
    async initialize(state){
      await stackElementStorageManager.updateStackElementsFromLocalStorage();
      Array.from(await stackElementStorageManager.getStackIds().values()).forEach(el =>{
        state.stack.push(el)
      });
    },
    setTitle(state, title){
      localStorage.setItem("title", title)
      state.title = title;
    },
    setHtmlContent(state, htmlEditorContent) {
      state.htmlEditorContent = htmlEditorContent
    },
    async stackByPath(state, file){
      const stackElement = StackElementFactory.getStackElement(file)
      if (stackElement instanceof UploadableStackElement){
        await stackElementStorageManager.saveStackElement(stackElement);
        state.stack.push(stackElement)
      }else {
        state.stack.push(stackElement)
      }
    },
    async addHtmlContent(state){
      const element = StackElementFactory.getStackElementByString(FileTypes.HTML, {html: state.htmlEditorContent})
      await stackElementStorageManager.saveStackElement(element);
      state.stack.push(element)
      state.htmlEditorContent = ""
    },
    async addTwitterContent(state) {
      const element = StackElementFactory.getStackElementByString(FileTypes.TWITTER, {url: state.twitterContentUrl})
      await stackElementStorageManager.saveStackElement(element);
      state.stack.push(element)
      state.twitterContentUrl = ""
    }, 
    async addYoutubeContent(state){
      const element = StackElementFactory.getStackElementByString(FileTypes.YOUTUBE, {url: state.youtubeContentUrl})
      await stackElementStorageManager.saveStackElement(element);
      state.stack.push(element)
      state.youtubeContentUrl = ""
    },
    async removeElement(state, index){
      await stackElementStorageManager.removeElement(state.stack[index])
      state.stack.splice(index, 1)
      stackElementStorageManager.saveStack(state.stack)
    },
    async saveStack(state){
      await stackElementStorageManager.saveStack(state.stack)
    },
    async addElementFromSavedExternalPath(state, { savedUrl, mimeType }){
      alert("store index addElementFromSavedExternalPath 1 "+ savedUrl)
      const extension = !mimeType?savedUrl.split(".").pop():mimeType.split("/").pop()
      const fileType = getFileTypeByExtension(extension)
      alert("store index addElementFromSavedExternalPath 2 extension: "+ JSON.stringify(extension) + " filetype: " + JSON.stringify(fileType) )
      const stackElement = StackElementFactory.getStackElementByString(fileType, {filePath: savedUrl, extension: extension})
      alert("store index addElementFromSavedExternalPath 3 stakElement: "+ JSON.stringify(stackElement) )
      if (stackElement instanceof UploadableStackElement){
        await stackElementStorageManager.saveStackElement(stackElement)
        await stackElement.calculateRawData()
      }
      alert("add stack " + JSON.stringify(stackElement))
      state.stack.push(stackElement)
    }
  },
  // asincrono
  actions: {
    setTitle (context, title) {
      context.commit('setTitle', title)
    },
    setHtmlContent(context, htmlEditorContent) {
      context.commit('setHtmlContent', htmlEditorContent)
    },
    stackByPath(context, file) {
      context.commit('stackByPath', file)
    },
    addHtmlContent(context) {
      context.commit('addHtmlContent')
    },
    addYoutubeContent(context){
      context.commit('addYoutubeContent')
    },
    addTwitterContent(context){
      context.commit('addTwitterContent')
    },
    saveStack(context) {
      context.commit('saveStack')
    },
    initialize(context) {
      context.commit('initialize')
    },
    addElementFromSavedExternalPath(context, { savedUrl, mimeType }){
      context.commit("addElementFromSavedExternalPath", { savedUrl, mimeType })
    },
    async publish(context) {
      await stackElementStorageManager.publishStack(context.state.stack, context.state.title)
    },
    async clear(context) {
      for(let i=0; i<context.state.stack.length; i++){
        await context.commit("removeElement", i);
      }
      context.commit('setTitle', "")
    },
    
  }
})


