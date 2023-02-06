'use strict';
import StackElement from "./stackElement";
import { TypesConstantsConfig, FileTypes } from "@/constants/typesConstantsConfig";

class StackElementFactory {
    public static getStackElement(file: File): StackElement {
        const extension = file.name.split('.').pop();
        const url = URL.createObjectURL(file)
        if (extension){
            const fileType = TypesConstantsConfig.getFileTypeByExtension(extension)
            return this.getStackElementByString(fileType, {filePath: url})
        } else {
            throw new Error("not valid filename")
        }
    }

    public static getStackElementByString(fileType: FileTypes, element: any): StackElement {
        return TypesConstantsConfig.getStackElementByString(fileType, element)
    }
}

export default StackElementFactory 