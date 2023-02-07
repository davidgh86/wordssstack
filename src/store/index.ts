import { createStore } from 'vuex'

import StackElement from '@/wordpressstack/stackElement'
import stackManager from '@/service/stackManager'

const stack : Array<StackElement> = []


export const store = createStore({
  state: {
    title: localStorage.getItem("title")?localStorage.getItem("title"):"",
    htmlEditorContent: "",
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
      await stackManager.initialize(state)
    },
    setTitle(state, title){
      localStorage.setItem("title", title)
      state.title = title;
    },
    setHtmlContent(state, htmlEditorContent) {
      state.htmlEditorContent = htmlEditorContent
    },
    async stackByPath(state, file){
      await stackManager.stackByPath(state, file)
    },
    async addHtmlContent(state){
      await stackManager.addHtmlContent(state)
    },
    async addUrlContent(state, url){
      await stackManager.addUrlContent(url)
    },
    async removeElement(state, index){
      await stackManager.removeElement(state, index)
    },
    async saveStack(state){
      await stackManager.saveStack(state)
    },
    async addElementFromSavedExternalPath(state, { savedUrl, mimeType }){
      await stackManager.addElementFromSavedExternalPath(state, { savedUrl, mimeType })
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
    addUrlContent(context, url){
      context.commit('addUrlContent', url)
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
      await stackManager.publish(context)
    },
    async clear(context) {
      await stackManager.clear(context)
    },
    
  }
})


