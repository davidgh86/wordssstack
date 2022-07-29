'use strict';
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

    abstract getHtmlString(src:string|null): string;
}

export default UploadableStackElement