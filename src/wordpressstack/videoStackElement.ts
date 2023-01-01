'use strict';
import { FileTypes } from "./fileTypes";
import UploadableStackElement from "./uploadableStackElement";

class VideoStackElement extends UploadableStackElement {
    

    constructor(filePath: string) {
        super(filePath);
        this.fileType = FileTypes.VIDEO
    }

    getHtmlString(src:string|null): string {
        return `<div style="width: 100%;height: 100%;overflow: hidden;">
            <video controls style="width: 100%;height: 100%;object-fit: contain;display: inline-block;">
                <source src="${src}" type="video/${this.getExtension()}">
            </video>
        </div>`
    }

}

export default VideoStackElement