'use strict';
export enum FileTypes {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    HTML = "HTML",
    YOUTUBE = "YOUTUBE",
    TWITTER = "TWITTER",
    UNKNOWN = "UNKNOWN"
}

const extensions = new Map<string, FileTypes>(
    [
        ["html", FileTypes.HTML],
        ["htm", FileTypes.HTML],
        
        ["jpg", FileTypes.IMAGE],
        ["jpeg", FileTypes.IMAGE],
        ["png", FileTypes.IMAGE],
        ["gif", FileTypes.IMAGE],
        
        ["mp4", FileTypes.VIDEO],
        ["youtube", FileTypes.YOUTUBE],
        ["twitter", FileTypes.TWITTER],
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
    } else if (fileType === FileTypes.VIDEO) {
        return "video/"+extension
    }
    return ""
}

//export default {FileTypes, getFileTypeByExtension};