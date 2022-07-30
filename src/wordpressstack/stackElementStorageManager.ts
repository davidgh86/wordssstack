'use strict';
import StackElement from "./stackElement";
import ImageStackElement from "./imageStackElement";
import { FileTypes, getFileTypeByExtension } from "./fileTypes";
import FileSystemStoreManager from "./fileSystemStoreManager";
import StackElementFactory from "./stackElementFactory";
import UploadableStackElement from "./uploadableStackElement";

class StackElementStorageManager {

    readonly IDS_LOCAL_STORAGE_KEY = "documentIds"

    readonly TYPE_FIELD_NAME = "type"

    ids: Map<string, StackElement>;

    constructor(){
        this.updateStackElementsFromLocalStorage()
    }

    updateStackElementsFromLocalStorage() {
        let items = localStorage.getItem(this.IDS_LOCAL_STORAGE_KEY)
        if (items !== null){
            this.ids = this.parseElements(items)
        }else {
            this.ids = new Map()
        }
    }

    getStackIds():Map<string, StackElement> {
        return this.ids
    }

    getUpdatedStackIds():Map<string, StackElement> {
        this.updateStackElementsFromLocalStorage()
        return this.ids
    }

    saveStack( elements: Array<StackElement>) {
        const localStorageMap = new Map<string, StackElement>()
        for (const element of elements){
            if (element instanceof UploadableStackElement) {
                element.saveIntoDevice()
            }
            // TODO check if other behaviour must be done
            localStorageMap.set(element.getId(), element)
        }
        localStorage.setItem(this.IDS_LOCAL_STORAGE_KEY, JSON.stringify(localStorageMap))
    }

    private parseElements(items: string): Map<string, StackElement> {
        const result = new Map<string, StackElement>()
        const jsonMap = JSON.parse(items)
        for (const key of Object.keys(jsonMap)){
            const element = this.parseElement(jsonMap[key])
            result.set(key, element)
        }
        return result
    }

    private parseElement(element: any): StackElement {
        const fileType = FileTypes[element.fileType]
        return StackElementFactory.getStackElementByUrl(fileType, element.filePath);
    }
}

export default StackElementStorageManager


