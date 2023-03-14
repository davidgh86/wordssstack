'use strict';
import StackElement from "./stackElement";
import StackElementFactory from "./stackElementFactory";
import UploadableStackElement from "./uploadableStackElement";
import wordpressApi from "../service/wordpressApi"
import debug from "@/service/debug";
import { FileTypes } from "@/constants/typesConstantsConfig";

class StackElementStorageManager {

    readonly IDS_LOCAL_STORAGE_KEY = "documentIds"

    readonly TYPE_FIELD_NAME = "type"

    ids: Map<string, StackElement> = new Map();

    async updateStackElementsFromLocalStorage() {
        const items = localStorage.getItem(this.IDS_LOCAL_STORAGE_KEY)
        if (items !== null){
            this.ids = await this.parseElements(items)
        }else {
            this.ids = new Map<string, StackElement>()
        }
    }

    getStackIds():Map<string, StackElement> {
        return this.ids
    }

    async publishStack(elements: Array<StackElement>, title: string): Promise<void> {
        await this.uploadStack(elements);
        
        let content = ""
        for (const element of elements) {
            content += element.getHtmlElement()
        }

        content = `<!-- wp:image {"id":12,"sizeSlug":"full","linkDestination":"none"} -->
        <figure class="wp-block-image size-full">${content}</figure>
        <!-- /wp:image -->`

        await wordpressApi.uploadPost(title, content)
    }

    uploadStack(elements: Array<StackElement>): Promise<void> {
        return new Promise((resolve, reject) => {
            alert("7¨¨¨¨¨ uploading stack>"+JSON.stringify(Object.fromEntries(this.ids)))
        
            const elementSize = elements.length
            let elementCount = 0
            const localStorageMap = new Map<string, StackElement>()
            for (const element of elements){
                if (element instanceof UploadableStackElement) {
                    if (!element.isUploaded){
                        element.upload().then(() => {
                            elementCount += 1
                            localStorageMap.set(element.getId(), element)
                            if (elementCount === elementSize){
                                localStorage.removeItem(this.IDS_LOCAL_STORAGE_KEY)
                                this.ids = new Map<string, StackElement>()
                                resolve()
                            }
                        }).catch(error => {
                            reject(error)
                        })
                    } else {
                        elementCount += 1
                        localStorageMap.set(element.getId(), element)
                    }
                } else {
                    elementCount += 1
                    localStorageMap.set(element.getId(), element)
                } 
            }
            if (elementCount === elementSize){
                localStorage.removeItem(this.IDS_LOCAL_STORAGE_KEY)
                this.ids = new Map<string, StackElement>()
                resolve()
            }
            alert("5¨¨¨¨¨ el mapa con los items>"+JSON.stringify(Object.fromEntries(this.ids)))
        
        });  
    }

    async removeElement(element: StackElement){
        if (element instanceof UploadableStackElement) {
            if (element.isSaved) {
                await element.removeFromDevice()
            }
        }
    }

    async saveStack( elements: Array<StackElement>) {
        const localStorageMap = new Map<string, StackElement>()
        for (const element of elements){
            if (element instanceof UploadableStackElement) {
                if (!element.isSaved) {
                    await element.saveIntoDevice()     
                }
                const copy = Object.assign({}, element)
                delete copy.rawDataSrc
                localStorageMap.set(element.getId(), copy)
            } else {
                localStorageMap.set(element.getId(), element)
            }
        }
        console.info("here2")
        debug.debugAlert("here2")
        const valueToLocalStorage = Array.from(localStorageMap.values()).map(el => {
            const cp = Object.assign({}, el)
            delete cp["data"]
            return cp
        })
        alert("8¨¨¨¨¨ i think this should be a map>"+JSON.stringify(Object.fromEntries(this.ids)))
        localStorage.setItem(this.IDS_LOCAL_STORAGE_KEY, JSON.stringify(valueToLocalStorage))
        return elements
    }

    async saveStackElement( element: StackElement) {
        debug.debugAlert("stackElementStorageManager saveStackElement 1 " + JSON.stringify(element))
        const saveMap = new Map(this.ids)
        if (element instanceof UploadableStackElement) {
            if (!element.isSaved) {
                await element.saveIntoDevice()
                debug.debugAlert("stackElementStorageManager saveStackElement 2 Element saved")
            }
            const copy = Object.assign({}, element)
            delete copy.rawDataSrc
            this.ids.set(element.getId(), element)
            saveMap.set(element.getId(), copy)
            
        } else {
            this.ids.set(element.getId(), element)
            saveMap.set(element.getId(), element)
        }
        const valuesSave = Array.from(saveMap.values())
        .map(el => {
            const cp = Object.assign({}, el)
            delete cp["data"]
            delete cp["rawDataSrc"]
            // delete el["filePath"]
            return cp
        })
        alert("9¨¨¨¨¨ i think this should be a map>"+JSON.stringify(valuesSave))
        
        localStorage.setItem(this.IDS_LOCAL_STORAGE_KEY, JSON.stringify(valuesSave))
        
        return element
    }

    private async parseElements(items: string): Promise<Map<string, StackElement>> {
        const result = new Map<string, StackElement>()
        const jsonArray = JSON.parse(items)
        alert("1¨¨¨¨¨ el mapa con los items>"+JSON.stringify(items))
        for (const item of jsonArray){
            const element = await this.parseElement(item)
            result.set(element.getId(), element)
        }
        alert("2¨¨¨¨¨ el mapa con los items>"+JSON.stringify(Object.fromEntries(result)))
        return result
    }

    private async parseElement(element: any): Promise<StackElement> {
        const fileType: FileTypes = FileTypes[element.fileType]
        const stackElement = StackElementFactory.getStackElementByString(fileType, element);
        if (stackElement instanceof UploadableStackElement){
            stackElement.setSaved(element.isSaved)
            stackElement.setUploaded(element.isUploaded)
            await stackElement.calculateRawData()
        }
        return stackElement
    }
}

export default StackElementStorageManager


