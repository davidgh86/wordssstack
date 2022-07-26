import { FileTypes } from "./fileTypes";
import UploadableStackElement from "./uploadableStackElement";

class ImageStackElement extends UploadableStackElement {
    

    constructor(filePath: string) {
        super(filePath);
        this.fileType = FileTypes.IMAGE
    }

    getHtmlString(src:string|null): string {
        return `<img src="${src}"/>`
    }

}

export default ImageStackElement