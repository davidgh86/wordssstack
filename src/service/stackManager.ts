import StackElementFactory from '@/wordpressstack/stackElementFactory';
import StackElementStorageManager from '@/wordpressstack/stackElementStorageManager';
import TwitterStackElement from '@/wordpressstack/twitterStackElement';
import UploadableStackElement from '@/wordpressstack/uploadableStackElement';
import {store} from '@/store'
import debug from './debug';
import { FileTypes, TypesConstantsConfig } from '@/constants/typesConstantsConfig';
import StrawpollStackElement from '@/wordpressstack/strawpollStackElement';


class StackManager {

    private static instance: StackManager;
    private static stackElementStorageManager: StackElementStorageManager;

    public static getInstance(): StackManager {
        if (!StackManager.instance) {
            this.stackElementStorageManager = new StackElementStorageManager()
            StackManager.instance = new StackManager()
        }
        
        return StackManager.instance
    }
    
    async initialize(state){
        await StackManager.stackElementStorageManager.updateStackElementsFromLocalStorage();
        Array.from(await StackManager.stackElementStorageManager.getStackIds().values()).forEach(el =>{
          state.stack.push(el)
        });
    }

    public processTextUrl(url: string){
        const type = this.getUrlType(url)
      
        if (FileTypes.YOUTUBE === type) {
          this.addYoutubeContent(store.state, url)
        } else if (FileTypes.TWITTER === type) {
          this.addTwitterContent(store.state, url)
        } else if (FileTypes.STRAWPOLL === type) {
            this.addStrawpollContent(store.state, url)
        } else if (FileTypes.LINK === type) {
            const description = prompt("Enter a description for link "+ url)
            this.addLink(description, url)
        }
    }

    public processFileUrl(url: string, mimeType: string) {
        const savedUrl = url
        store.commit("addElementFromSavedExternalPath", { savedUrl, mimeType })
    }

    public getUrlType(url: string) {
        const hostname = (new URL(url)).hostname
        
        if (hostname === "www.youtube.com" || hostname === "youtu.be") {
            return FileTypes.YOUTUBE
        } else if (hostname === "twitter.com") {
            return FileTypes.TWITTER
        } else if (hostname === "strawpoll.com") {
            return FileTypes.STRAWPOLL
        }

        return FileTypes.LINK
    }

    public addLink(description: string, url: string) {
        let htmlContent = store.state.htmlEditorContent
        const htmlElement = document.createElement("div")
        htmlElement.innerHTML=htmlContent
        if (htmlElement.children.length == 1 && htmlElement.children[0].nodeName.toUpperCase() === "P") {
            htmlContent = htmlElement.children[0].innerHTML
        }
        const link = `<a href="${url.trim()}" rel="noopener noreferrer" target="_blank">${description.trim()}</a>`
        if (store.state.caretPositionNodeName.toUpperCase() === "A" || store.state.caretPosition === -1) {
            store.state.htmlEditorContent = htmlContent + " " + link
        } else if(store.state.caretPosition == 0) {
            store.state.htmlEditorContent = link + " " + htmlContent
        } else {
            console.log("substring 2")
            store.state.htmlEditorContent = htmlContent.substring(0, store.state.caretPosition) + " " + link + " " + htmlContent.substring(store.state.caretPosition)
        }
    }

    async addHtmlContent(state){
        const element = StackElementFactory.getStackElementByString(FileTypes.HTML, {html: state.htmlEditorContent})
        await StackManager.stackElementStorageManager.saveStackElement(element);
        state.stack.push(element)
        state.htmlEditorContent = ""
    }

    async addTwitterContent(state, url) {
        const element = StackElementFactory.getStackElementByString(FileTypes.TWITTER, {url: url}) as TwitterStackElement 
        await element.initialize()
        await StackManager.stackElementStorageManager.saveStackElement(element);
        state.stack.push(element)
    }

    async addStrawpollContent(state, url) {
        const element = StackElementFactory.getStackElementByString(FileTypes.STRAWPOLL, {url: url})
        await StackManager.stackElementStorageManager.saveStackElement(element);
        state.stack.push(element)
    }

    async addYoutubeContent(state, url){
        const element = StackElementFactory.getStackElementByString(FileTypes.YOUTUBE, {url: url})
        await StackManager.stackElementStorageManager.saveStackElement(element);
        state.stack.push(element)
    }

    async addUrlContent(url){
        await this.processTextUrl(url)
    }

    async removeElement(state, index){
        console.log("******->1 removeElement")
        const element = state.stack[index]
        state.stack.splice(index, 1)
        StackManager.stackElementStorageManager.saveStack(state.stack)
        await StackManager.stackElementStorageManager.removeElement(element)
    }

    async stackByPath(state, file){
        console.info("1.-----> stacking by path")
        const stackElement = StackElementFactory.getStackElement(file)
        console.log("2.-----> " +JSON.stringify(stackElement))
        if (stackElement instanceof UploadableStackElement){
          await StackManager.stackElementStorageManager.saveStackElement(stackElement);
          console.log("8.-----> Elemento apilado: "+ JSON.stringify(stackElement))
          state.stack.push(stackElement)
        }else {
          state.stack.push(stackElement)
        }
    }

    async saveStack(state){
        await StackManager.stackElementStorageManager.saveStack(state.stack)
    }

    async publish(context) {
        await StackManager.stackElementStorageManager.publishStack(context.state.stack, context.state.title)
    }
    
    async clear(context) {
        for(let i=0; i<context.state.stack.length; i++){
          await context.commit("removeElement", i);
        }
        context.commit('setTitle', "")
    }

    async addElementFromSavedExternalPath(state, { savedUrl, mimeType }){
        debug.debugAlert("store index addElementFromSavedExternalPath 1 "+ savedUrl)
        const extension = !mimeType?savedUrl.split(".").pop():mimeType.split("/").pop()
        const fileType = TypesConstantsConfig.getFileTypeByExtension(extension)
        debug.debugAlert("store index addElementFromSavedExternalPath 2 extension: "+ JSON.stringify(extension) + " filetype: " + JSON.stringify(fileType) )
        const stackElement = StackElementFactory.getStackElementByString(fileType, {filePath: savedUrl, extension: extension})
        debug.debugAlert("store index addElementFromSavedExternalPath 3 stakElement: "+ JSON.stringify(stackElement) )
        if (stackElement instanceof UploadableStackElement){
          await StackManager.stackElementStorageManager.saveStackElement(stackElement)
          await stackElement.calculateRawData()
        }
        debug.debugAlert("add stack " + JSON.stringify(stackElement))
        state.stack.push(stackElement)
      }
   
}

export default StackManager.getInstance()