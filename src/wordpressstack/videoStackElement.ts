'use strict';
import { FileTypes } from "@/constants/typesConstantsConfig";
import templateManagerService from "@/service/templateManagerService";
import UploadableStackElement from "./uploadableStackElement";

class VideoStackElement extends UploadableStackElement {
    

    constructor(filePath: string, extension: string|undefined) {
        super(filePath, extension);
        this.fileType = FileTypes.VIDEO
    }

    getHtmlString(src:string|null): string {
        const variables = [
            { variableName: "src_video", variableValue: src },
            { variableName: "video_extension", variableValue: this.getExtension() }
        ]
        return templateManagerService.renderTemplate(variables, templateManagerService.getTemplate("video"))
    }

}

export default VideoStackElement