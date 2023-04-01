'use strict';
import FileSystemStoreManager from "./fileSystemStoreManager";
import StackElement from "./stackElement";
import wordpressApi from "../service/wordpressApi"
import debug from "@/service/debug";
import { FileTypes, TypesConstantsConfig } from "@/constants/typesConstantsConfig";

abstract class UploadableStackElement implements StackElement {
    
    isUploaded: boolean;
    isSaved: boolean;
    filePath: string;
    uploadedPath: string|null = null;
    fileType:FileTypes = FileTypes.UNKNOWN;
    rawDataSrc:string|null;
    extension:string|undefined;

    constructor(filePath: string, extension:string|undefined) {
        this.isUploaded = false
        this.isSaved = false
        this.filePath = filePath
        this.extension = extension
    }

    setUploaded(uploaded :boolean){
        this.isUploaded = uploaded
    }

    setSaved(saved: boolean){
        this.isSaved = saved
    }

    getExtension() {
        console.log("----->getExtension")
        return !this.extension?this.getFileName().split('.').pop():this.extension;
    }

    upload(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log("----->upload")
            const filename = this.getFileName()

            const mimetype = TypesConstantsConfig.getMimeTypeFromExtension(filename.split('.').pop())

            wordpressApi.uploadFile(mimetype, filename, this.rawDataSrc).then(response => {
                this.uploadedPath = response["source_url"]
                this.isUploaded = true
                resolve()
            }).catch(error => {
                reject (error)
            })
        })        
    }

    getType(): FileTypes {
        return this.fileType
    }

    getFileName(): string {
        console.log("----->getFileName")
        console.log("substring 6")
        console.log(JSON.stringify(this))
        console.log(JSON.stringify(this.filePath))
        return this.filePath.substring(this.filePath.lastIndexOf('/') + 1)
    }

    getId(): string {
        console.log("----->getId")
        return this.getFileName()
    }

    getUploadedPath() {
        return this.uploadedPath;
    }

    getHtmlElement(): string {
        console.log("------> getHtmlElement")
        if (this.isUploaded) {
            return this.getHtmlString(this.uploadedPath)
        } else {
            throw new Error("file not uploaded");
        }
    }

    async removeFromDevice(){
        if (this.isSaved){
            console.log("******->3 removeElement")
            await FileSystemStoreManager.remove(this.filePath)
            this.rawDataSrc = null
            this.isSaved = false
        }
    }

    async calculateRawData() {
        if (this.filePath.startsWith("file://")){
            const fileType = this.getExtension()
            const data = await FileSystemStoreManager.getBase64BytesFromCacheDisk(this.filePath)
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
        await this.calculateRawData()

        return path
    }

    abstract getHtmlString(src:string|null): string;
}

export default UploadableStackElement