'use strict';
import { FileTypes } from "@/constants/typesConstantsConfig";
import templateManagerService from "@/service/templateManagerService";
import UploadableStackElement from "./uploadableStackElement";

class ImageStackElement extends UploadableStackElement {
    

    constructor(filePath: string, extension: string|undefined) {
        super(filePath, extension);
        this.fileType = FileTypes.IMAGE
    }

    getHtmlString(src:string|null): string {
        const variables = [
            { variableName: "src_image", variableValue: src }
        ]
        return templateManagerService.renderTemplate(variables, templateManagerService.getTemplate("image"))
    }

}

export default ImageStackElement