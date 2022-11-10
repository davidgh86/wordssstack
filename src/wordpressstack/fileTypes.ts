'use strict';
export enum FileTypes {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    HTML = "HTML",
    UNKNOWN = "UNKNOWN"
}

const extensions = new Map<string, FileTypes>(
    [
        ["html", FileTypes.HTML],
        ["htm", FileTypes.HTML],
        ["jpg", FileTypes.IMAGE],
        ["jpeg", FileTypes.IMAGE],
        ["png", FileTypes.IMAGE],
        ["gif", FileTypes.IMAGE]
    ]
)

export function getFileTypeByExtension(extension: string): FileTypes|undefined {
    const standarizedExtension = extension.trim().toLowerCase()
    if (!extensions.has(standarizedExtension)) {
        return FileTypes.UNKNOWN
    }
    else {
        return extensions.get(standarizedExtension)
    }
}

export function getMimeTypeFromExtension(extension: string): string {
    const standarizedExtension = extension.trim().toLowerCase()
    const fileType: FileTypes = getFileTypeByExtension(standarizedExtension)
    if (fileType === FileTypes.IMAGE) {
        if (extension == "jpg"){
            return "image/jpeg"
        } else {
            return "image/"+extension
        }
    }
    return ""
}

//export default {FileTypes, getFileTypeByExtension};