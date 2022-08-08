'use strict';
import StackElement from "./stackElement";
import { FileTypes } from "./fileTypes";
import StackElementFactory from "./stackElementFactory";
import UploadableStackElement from "./uploadableStackElement";

class StackElementStorageManager {

    readonly IDS_LOCAL_STORAGE_KEY = "documentIds"

    readonly TYPE_FIELD_NAME = "type"

    ids: Map<string, StackElement> = new Map();

    async updateStackElementsFromLocalStorage() {
        const items = localStorage.getItem(this.IDS_LOCAL_STORAGE_KEY)
        if (items !== null){
            this.ids = await this.parseElements(items)
        }else {
            this.ids = new Map()
        }
    }

    getStackIds():Map<string, StackElement> {
        return this.ids
    }

    uploadStack(elements: Array<StackElement>) {
        const localStorageMap = new Map<string, StackElement>()
        for (const element of elements){
            if (element instanceof UploadableStackElement) {
                if (!element.isUploaded){
                    element.upload()
                }
            }
            localStorageMap.set(element.getId(), element)
        }
        localStorage.removeItem(this.IDS_LOCAL_STORAGE_KEY)
        this.ids = new Map()
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
        localStorage.setItem(this.IDS_LOCAL_STORAGE_KEY, JSON.stringify(Array.from(localStorageMap.entries())))
        return elements
    }

    async saveStackElement( element: StackElement) {
        const saveMap = new Map(this.ids)
        if (element instanceof UploadableStackElement) {
            if (!element.isSaved) {
                await element.saveIntoDevice()
            }
            const copy = Object.assign({}, element)
            delete copy.rawDataSrc
            this.ids.set(element.getId(), element)
            saveMap.set(element.getId(), copy)
        } else {
            this.ids.set(element.getId(), element)
            saveMap.set(element.getId(), element)
        }
        localStorage.setItem(this.IDS_LOCAL_STORAGE_KEY, JSON.stringify(Array.from(saveMap.entries())))
        return element
    }

    private async parseElements(items: string): Promise<Map<string, StackElement>> {
        const result = new Map<string, StackElement>()
        const jsonMap = new Map(JSON.parse(items))
        for (const key of jsonMap.keys()){
            const keyString = key as string
            const element = await this.parseElement(jsonMap.get(keyString))
            result.set(keyString, element)
        }
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


