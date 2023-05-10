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
        console.log("**********> " + src)

        console.log("**********> " + JSON.stringify(super.isUploaded));
        console.log("**********> " + JSON.stringify(super.isSaved));
        console.log("**********> " + JSON.stringify(super.filePath));
        console.log("**********> " + JSON.stringify(super.uploadedPath));
        console.log("**********> " + JSON.stringify(super.fileType));
        console.log("**********> " + JSON.stringify(super.rawDataSrc));
        console.log("**********> " + JSON.stringify(super.extension));
        console.log("**********> " + JSON.stringify(super.uploadedInfo));


        const variables = [
            { variableName: "src_image", variableValue: src }
        ]
        return templateManagerService.renderTemplate(variables, templateManagerService.getTemplate("image"))
    }

}

export default ImageStackElement