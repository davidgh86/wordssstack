'use strict';
import templateManagerService from "@/service/templateManagerService";
import { FileTypes } from "./fileTypes";
import UploadableStackElement from "./uploadableStackElement";

class ImageStackElement extends UploadableStackElement {
    

    constructor(filePath: string) {
        super(filePath);
        this.fileType = FileTypes.IMAGE
    }

    getHtmlString(src:string|null): string {
        const variables = [
            { variableName: "src_image", variableValue: src }
        ]
        return templateManagerService.renderTemplate(variables, templateManagerService.getImageTemplate())
    }

}

export default ImageStackElement