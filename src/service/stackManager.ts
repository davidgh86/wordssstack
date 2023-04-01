import StackElementFactory from '@/wordpressstack/stackElementFactory';
import StackElementStorageManager from '@/wordpressstack/stackElementStorageManager';
import TwitterStackElement from '@/wordpressstack/twitterStackElement';
import UploadableStackElement from '@/wordpressstack/uploadableStackElement';
import {store} from '@/store'
import debug from './debug';
import { FileTypes, TypesConstantsConfig } from '@/constants/typesConstantsConfig';


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
        const savedUrl = decodeURI(url)
        store.commit("addElementFromSavedExternalPath", { savedUrl, mimeType })
    }

    public getUrlType(url: string) {
        const hostname = (new URL(url)).hostname
        alert("hostname "+ hostname)
        if (hostname === "www.youtube.com" || hostname === "youtu.be" || hostname === "youtube.com") {
            return FileTypes.YOUTUBE
        } else if (hostname === "twitter.com") {
            return FileTypes.TWITTER
        } else if (hostname === "strawpoll.com") {
            return FileTypes.STRAWPOLL
        }

        return FileTypes.LINK
    }

    public addLink(description: string, url: string) {
        const link = `<a href="${url.trim()}" rel="noopener noreferrer" target="_blank">${description.trim()}</a>`
        this.addTextToEditor(link)
    }

    public addTextToEditor(text: string) {
        let htmlContent = store.state.htmlEditorContent
        const htmlElement = document.createElement("div")
        htmlElement.innerHTML=htmlContent
        if (htmlElement.children.length == 1 && htmlElement.children[0].nodeName.toUpperCase() === "P") {
            htmlContent = htmlElement.children[0].innerHTML
        }
        
        if (store.state.caretPositionNodeName.toUpperCase() === "A" || store.state.caretPosition === -1) {
            store.state.htmlEditorContent = htmlContent + " " + text
        } else if(store.state.caretPosition == 0) {
            store.state.htmlEditorContent = text + " " + htmlContent
        } else {
            console.log("substring 2")
            store.state.htmlEditorContent = htmlContent.substring(0, store.state.caretPosition) + " " + text + " " + htmlContent.substring(store.state.caretPosition)
        }
    }

    async addHtmlContent(state, index){
        console.log("index...."+index)
        if (index || index === 0) {
            this.replaceHtmlContent(state, index)
        } else {
            this.appendHtmlContent(state)
        }
    }

    async replaceHtmlContent(state, index) {
        const elementToRemove = state.stack[index]
        await StackManager.stackElementStorageManager.removeElement(elementToRemove)
        const element = StackElementFactory.getStackElementByString(FileTypes.HTML, {html: state.htmlEditorContent})
        state.stack[index] = element
        await StackManager.stackElementStorageManager.saveStack(state.stack)
    }

    async appendHtmlContent(state){
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
        console.log("URL ........." + url)
        const element = StackElementFactory.getStackElementByString(FileTypes.YOUTUBE, {url: url})
        console.log("ELEMENT ..........."+ JSON.stringify(element))
        await StackManager.stackElementStorageManager.saveStackElement(element);
        state.stack.push(element)
    }

    async addUrlContent(url){
        await this.processTextUrl(url)
    }

    async removeElement(state, index){
        const element = state.stack[index]
        state.stack.splice(index, 1)
        StackManager.stackElementStorageManager.saveStack(state.stack)
        await StackManager.stackElementStorageManager.removeElement(element)
    }

    async stackByPath(state, file){
        const stackElement = StackElementFactory.getStackElement(file)
        if (stackElement instanceof UploadableStackElement){
          await StackManager.stackElementStorageManager.saveStackElement(stackElement);
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
        const extension = !mimeType?savedUrl.split(".").pop():mimeType.split("/").pop()
        const fileType = TypesConstantsConfig.getFileTypeByExtension(extension)
        const stackElement = StackElementFactory.getStackElementByString(fileType, {filePath: savedUrl, extension: extension})
        
        if (stackElement instanceof UploadableStackElement){
          await StackManager.stackElementStorageManager.saveStackElement(stackElement)
          await stackElement.calculateRawData()
        }
        state.stack.push(stackElement)
      }
   
}

export default StackManager.getInstance()