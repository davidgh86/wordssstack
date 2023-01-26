'use strict';
import StackElement from "./stackElement";
import ImageStackElement from "./imageStackElement";
import VideoStackElement from "./videoStackElement";
import HTMLStackElement from "./htmlStackElement";
import YoutubeStackElement from "./youtubeStackElement";
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
                return new ImageStackElement(element.filePath, undefined)
                break;
            }
            case FileTypes.HTML: {
                return new HTMLStackElement(element.html)
                break;
            }
            case FileTypes.VIDEO: {
                return new VideoStackElement(element.filePath, element.extension)
                break;
            }
            case FileTypes.YOUTUBE: {
                return new YoutubeStackElement(element.url)
                break;
            }
            default: {
                throw new Error("Not implemented exception")
            }
        } 
    }
}

export default StackElementFactory 