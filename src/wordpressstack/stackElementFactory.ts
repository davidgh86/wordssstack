import StackElement from "./stackElement";
import ImageStackElement from "./imageStackElement";
import { FileTypes, getFileTypeByExtension } from "./fileTypes";

class StackElementFactory {
    public static getStackElement(file: File): StackElement {
        const extension = file.name.split('.').pop();
        if (extension){
            const fileType = getFileTypeByExtension(extension)
            switch(fileType) {
                case FileTypes.IMAGE: {
                    const url = URL.createObjectURL(file)
                    return new ImageStackElement(url)
                    break;
                }
                default: {
                    throw new Error("Not implemented exception")
                }
            } 
        } else {
            throw new Error("not valid filename")
        }
    }
}

export default StackElementFactory