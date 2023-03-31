'use strict';
import { FileTypes } from "@/constants/typesConstantsConfig";
import templateManagerService from "@/service/templateManagerService";
import UploadableStackElement from "./uploadableStackElement";

class AudioStackElement extends UploadableStackElement {
    
    constructor(filePath: string, extension: string|undefined) {
        super(filePath, extension);
        this.fileType = FileTypes.AUDIO
    }

    getHtmlString(src:string|null): string {
        const variables = [
            { variableName: "src_audio", variableValue: src },
        ]
        const htmlSting = templateManagerService.renderTemplate(variables, templateManagerService.getTemplate("audio"))
        alert(htmlSting)
        return htmlSting;
    }

}

export default AudioStackElement