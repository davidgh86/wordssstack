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
            return this.getStackElementByString(fileType, url)
        } else {
            throw new Error("not valid filename")
        }
    }

    public static getStackElementByString(fileType: FileTypes, string: string): StackElement {
        switch(fileType) {
            case FileTypes.IMAGE: {
                return new ImageStackElement(string)
                break;
            }
            case FileTypes.HTML: {
                return new HTMLStackElement(string)
                break;
            }
            default: {
                throw new Error("Not implemented exception")
            }
        } 
    }
}

export default StackElementFactory 