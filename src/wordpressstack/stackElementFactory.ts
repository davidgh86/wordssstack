import StackElement from "./stackElement";
import ImageStackElement from "./imageStackElement";
import { FileTypes, getFileTypeByExtension } from "./fileTypes";

class StackElementFactory {
    public static getStackElement(path: string): StackElement {
        const extension = path.split('.').pop();
        if (extension){
            const fileType = getFileTypeByExtension(extension)
            switch(fileType) {
                case FileTypes.IMAGE:
                    return new ImageStackElement(path)
                default:
                    throw new Error("Not implemented exception")
            } 
        } else {
            throw new Error("not valid filename")
        }
    }
}

export default StackElementFactory