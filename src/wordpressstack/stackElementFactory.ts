'use strict';
import StackElement from "./stackElement";
import ImageStackElement from "./imageStackElement";
import { FileTypes, getFileTypeByExtension } from "./fileTypes";

class StackElementFactory {
    public static getStackElement(file: File): StackElement {
        const extension = file.name.split('.').pop();
        const url = URL.createObjectURL(file)
        if (extension){
            const fileType = getFileTypeByExtension(extension)
            return this.getStackElementByUrl(fileType, url)
        } else {
            throw new Error("not valid filename")
        }
    }

    public static getStackElementByUrl(fileType: FileTypes, url: string): StackElement {
        switch(fileType) {
            case FileTypes.IMAGE: {
                return new ImageStackElement(url)
                break;
            }
            default: {
                throw new Error("Not implemented exception")
            }
        } 
    }
}

export default StackElementFactory 