import { createStore } from 'vuex'

import StackElementStorageManager from '@/wordpressstack/stackElementStorageManager'
import UploadableStackElement from '@/wordpressstack/uploadableStackElement'
import StackElement from '@/wordpressstack/stackElement'
import StackElementFactory from '@/wordpressstack/stackElementFactory'
import { FileTypes, getFileTypeByExtension } from '@/wordpressstack/fileTypes'

import wordpressApi from '../service/wordpressApi';

wordpressApi.init()

const stackElementStorageManager = new StackElementStorageManager()


const stack : Array<StackElement> = []


export const store = createStore({
  state: {
    title: "",
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
      await stackElementStorageManager.updateStackElementsFromLocalStorage();
      Array.from(await stackElementStorageManager.getStackIds().values()).forEach(el =>{
        state.stack.push(el)
      });
    },
    setTitle(state, title){
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
    async removeElement(state, index){
      await stackElementStorageManager.removeElement(state.stack[index])
      state.stack.splice(index, 1)
      stackElementStorageManager.saveStack(state.stack)
    },
    async saveStack(state){
      await stackElementStorageManager.saveStack(state.stack)
    },
    async addElementFromSavedExternalPath(state, savedUrl){
      const extension = savedUrl.split(".").pop()
      const fileType = getFileTypeByExtension(extension)
      const stackElement = StackElementFactory.getStackElementByString(fileType, {filePath: savedUrl})
      if (stackElement instanceof UploadableStackElement){
        await stackElementStorageManager.saveStackElement(stackElement)
        await stackElement.calculateRawData()
      }
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
    saveStack(context) {
      context.commit('saveStack')
    },
    initialize(context) {
      context.commit('initialize')
    },
    addElementFromSavedExternalPath(context, savedUrl){
      context.commit("addElementFromSavedExternalPath", savedUrl)
    },
    publish(context, title) {
      stackElementStorageManager.publishStack(context.state.stack, title).then()
    }
  }
})


