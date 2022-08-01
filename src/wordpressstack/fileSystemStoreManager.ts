'use strict';

import { Filesystem, Directory } from '@capacitor/filesystem';
//import { render } from 'vue';

class FileSystemStoreManager {

    static async saveIntoDevice(filePath: string): Promise<string> {

        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
        
        if (filePath.startsWith("blob:")) {
            return await this.saveBlob(filePath, fileName)
        }
        
        await Filesystem.copy({
            from: filePath,
            to: fileName,
            toDirectory: Directory.Cache
        });

        const uriResult = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Cache
        })
        
        return uriResult.uri
    }

    static async getBase64BytesFromDisk(filePath: string) {
        const readResult = await Filesystem.readFile({
            path: filePath
        })

        return readResult.data
    }

    static async saveBlob(filePath: string, fileName: string) {
        const response = await fetch(filePath)
        const blob: Blob = await response.blob()

        const fileNameWithExtension = fileName + "." + blob.type.substring(blob.type.lastIndexOf('/') + 1)

        const base64Data = await this.convertBlobToBase64(blob) as string

        const uriResult = await Filesystem.writeFile({
            path: fileNameWithExtension,
            data: base64Data,
            directory: Directory.Cache
        })

        //alert(uriResult.uri)
        return uriResult.uri
    }

    static convertBlobToBase64(blob: Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject
            reader.onload = () => {
                resolve(reader.result)
            };
            reader.readAsDataURL(blob)
        })

    }
    
}

export default FileSystemStoreManager


