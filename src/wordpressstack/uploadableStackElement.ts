'use strict';
import FileSystemStoreManager from "./fileSystemStoreManager";
import { FileTypes } from "./fileTypes";
import StackElement from "./stackElement";

abstract class UploadableStackElement implements StackElement {
    
    isUploaded: boolean;
    filePath: string;
    uploadedPath: string|null = null;
    fileType:FileTypes = FileTypes.UNKNOWN

    constructor(filePath: string) {
        this.isUploaded = false
        this.filePath = filePath
    }

    upload(): string {
        // Todo implement
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

    getPrevisualizedHtmlElement(): string {
        return this.getHtmlString(this.filePath)
    }

    async saveIntoDevice():Promise<string>{
        return await FileSystemStoreManager.saveIntoDevice(this.filePath);
    }

    abstract getHtmlString(src:string|null): string;
}

export default UploadableStackElement