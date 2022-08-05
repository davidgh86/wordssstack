'use strict';
import StackElement from "./stackElement";
import ImageStackElement from "./imageStackElement";
import HTMLStackElement from "./htmlStackElement";
import { FileTypes, getFileTypeByExtension } from "./fileTypes";

class StackElementFactory {
    public static getStackElement(file: File): StackElement {
        const extension = file.name.split('.').pop();
        const url = URL.createObjectURL(file)
        if (extension){
            const fileType = getFileTypeByExtension(extension)
            return this.getStackElementByString(fileType, {filePath: url})
        } else {
            throw new Error("not valid filename")
        }
    }

    public static getStackElementByString(fileType: FileTypes, element: any): StackElement {
        switch(fileType) {
            case FileTypes.IMAGE: {
                return new ImageStackElement(element.filePath)
                break;
            }
            case FileTypes.HTML: {
                return new HTMLStackElement(element.html)
                break;
            }
            default: {
                throw new Error("Not implemented exception")
            }
        } 
    }
}

export default StackElementFactory 