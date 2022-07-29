'use strict';
export enum FileTypes {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    UNKNOWN = "UNKNOWN"
}

const extensions = new Map<string, FileTypes>(
    [
        ["jpg", FileTypes.IMAGE],
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

//export default {FileTypes, getFileTypeByExtension};