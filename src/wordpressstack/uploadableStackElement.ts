'use strict';
import FileSystemStoreManager from "./fileSystemStoreManager";
import { FileTypes } from "./fileTypes";
import StackElement from "./stackElement";

abstract class UploadableStackElement implements StackElement {
    
    isUploaded: boolean;
    isSaved: boolean;
    filePath: string;
    uploadedPath: string|null = null;
    fileType:FileTypes = FileTypes.UNKNOWN;
    rawDataSrc:string|null;

    constructor(filePath: string) {
        this.isUploaded = false
        this.isSaved = false
        this.filePath = filePath
    }

    setUploaded(uploaded :boolean){
        this.isUploaded = uploaded
    }

    setSaved(saved: boolean){
        this.isSaved = saved
    }    

    upload(): string {
        this.uploadedPath = "Implement UploadableStackElement.upload()"
        return this.filePath;
    }

    getType(): FileTypes {
        return this.fileType
    }

    getFileName(): string {
        return this.filePath.substring(this.filePath.lastIndexOf('/') + 1)
    }

    getId(): string {
        return this.getFileName()
    }

    getUploadedPath() {
        return this.uploadedPath;
    }

    getHtmlElement(): string {
        if (this.isUploaded) {
            return this.getHtmlString(this.uploadedPath)
        } else {
            throw new Error("file not uploaded");
        }
    }

    async removeFromDevice(){
        if (this.isSaved){
            await FileSystemStoreManager.remove(this.filePath)
            this.rawDataSrc = null
            this.isSaved = false
            this.filePath = null
        }
    }

    async calculateRowData() {
        if (this.filePath.startsWith("file://")){
            const fileType = this.filePath.split('.').pop()
            const data = await FileSystemStoreManager.getBase64BytesFromDisk(this.filePath)
            const src = `data:${this.fileType.toLowerCase()}/${fileType};base64,${data}`;
            this.rawDataSrc = src
        } 
    }

    
    getPrevisualizedHtmlElement(): string {
        if (this.rawDataSrc){
            return this.getHtmlString(this.rawDataSrc)
        }
        return this.getHtmlString(this.filePath)
    }

    async saveIntoDevice(): Promise<string>{
        const path = await FileSystemStoreManager.saveIntoDevice(this.filePath);
        this.isSaved = true;
        this.filePath = path
        await this.calculateRowData()

        return path
    }

    abstract getHtmlString(src:string|null): string;
}

export default UploadableStackElement