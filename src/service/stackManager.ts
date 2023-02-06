import StackElementFactory from '@/wordpressstack/stackElementFactory';
import StackElementStorageManager from '@/wordpressstack/stackElementStorageManager';
import TwitterStackElement from '@/wordpressstack/twitterStackElement';
import UploadableStackElement from '@/wordpressstack/uploadableStackElement';
import {store} from '@/store'
import debug from './debug';
import { FileTypes, TypesConstantsConfig } from '@/constants/typesConstantsConfig';


class StackManager {

    stackElementStorageManager = new StackElementStorageManager()

    private static instance: StackManager;

    public static getInstance(): StackManager {
        if (!StackManager.instance) {
            StackManager.instance = new StackManager()
        }
        
        return StackManager.instance
    }
    
    async initialize(state){
        await this.stackElementStorageManager.updateStackElementsFromLocalStorage();
        Array.from(await this.stackElementStorageManager.getStackIds().values()).forEach(el =>{
          state.stack.push(el)
        });
    }

    public processTextUrl(url: string){
        const type = this.getUrlType(url)
      
        if (FileTypes.YOUTUBE === type) {
          store.state.youtubeContentUrl = url
          store.commit('addYoutubeContent')
        } else if (FileTypes.TWITTER === type) {
          store.state.twitterContentUrl = url
          store.commit('addTwitterContent')
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
        }

        return FileTypes.YOUTUBE
    }

    async addHtmlContent(state){
        const element = StackElementFactory.getStackElementByString(FileTypes.HTML, {html: state.htmlEditorContent})
        await this.stackElementStorageManager.saveStackElement(element);
        state.stack.push(element)
        state.htmlEditorContent = ""
    }

    async addTwitterContent(state) {
        const element = StackElementFactory.getStackElementByString(FileTypes.TWITTER, {url: state.twitterContentUrl}) as TwitterStackElement 
        await element.initialize()
        await this.stackElementStorageManager.saveStackElement(element);
        state.stack.push(element)
        state.twitterContentUrl = ""
    }

    async addYoutubeContent(state){
        const element = StackElementFactory.getStackElementByString(FileTypes.YOUTUBE, {url: state.youtubeContentUrl})
        await this.stackElementStorageManager.saveStackElement(element);
        state.stack.push(element)
        state.youtubeContentUrl = ""
    }

    async removeElement(state, index){
        await this.stackElementStorageManager.removeElement(state.stack[index])
        state.stack.splice(index, 1)
        this.stackElementStorageManager.saveStack(state.stack)
    }

    async stackByPath(state, file){
        const stackElement = StackElementFactory.getStackElement(file)
        if (stackElement instanceof UploadableStackElement){
          await this.stackElementStorageManager.saveStackElement(stackElement);
          state.stack.push(stackElement)
        }else {
          state.stack.push(stackElement)
        }
    }

    async saveStack(state){
        await this.stackElementStorageManager.saveStack(state.stack)
    }

    async publish(context) {
        await this.stackElementStorageManager.publishStack(context.state.stack, context.state.title)
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
          await this.stackElementStorageManager.saveStackElement(stackElement)
          await stackElement.calculateRawData()
        }
        debug.debugAlert("add stack " + JSON.stringify(stackElement))
        state.stack.push(stackElement)
      }
   
}

export default StackManager.getInstance()