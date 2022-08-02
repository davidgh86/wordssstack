'use strict';
import StackElement from "./stackElement";
import { FileTypes } from "./fileTypes";
import StackElementFactory from "./stackElementFactory";
import UploadableStackElement from "./uploadableStackElement";

class StackElementStorageManager {

    readonly IDS_LOCAL_STORAGE_KEY = "documentIds"

    readonly TYPE_FIELD_NAME = "type"

    ids: Map<string, StackElement>;

    constructor(){
        //await this.updateStackElementsFromLocalStorage()
    }

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

    // getUpdatedStackIds():Map<string, StackElement> {
    //     this.updateStackElementsFromLocalStorage()
    //     return this.ids
    // }

    uploadStack(elements: Array<StackElement>) {
        const localStorageMap = new Map<string, StackElement>()
        for (const element of elements){
            if (element instanceof UploadableStackElement) {
                if (!element.isUploaded){
                    element.upload()
                }
            }
            // TODO remove items in cache
            // TODO check if other behaviour must be done
            localStorageMap.set(element.getId(), element)
        }
        localStorage.removeItem(this.IDS_LOCAL_STORAGE_KEY)
        this.ids = new Map()
    }

    async saveStack( elements: Array<StackElement>) {
        const localStorageMap = new Map<string, StackElement>()
        for (const element of elements){
            if (element instanceof UploadableStackElement) {
                if (!element.isSaved) {
                    await element.saveIntoDevice()
                    const copy = Object.assign({}, element)
                    delete copy.rawDataSrc
                    localStorageMap.set(element.getId(), copy)
                }
            } else {
                localStorageMap.set(element.getId(), element)
            }
        }
        localStorage.setItem(this.IDS_LOCAL_STORAGE_KEY, JSON.stringify(Array.from(localStorageMap.entries())))
        return elements
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
        const stackElement = StackElementFactory.getStackElementByUrl(fileType, element.filePath);
        if (stackElement instanceof UploadableStackElement){
            stackElement.setSaved(element.isSaved)
            stackElement.setUploaded(element.isUploaded)
        }
        return stackElement
    }
}

export default StackElementStorageManager


