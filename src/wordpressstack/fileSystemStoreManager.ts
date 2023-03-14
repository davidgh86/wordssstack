'use strict';

import { Filesystem, Directory } from '@capacitor/filesystem';
//import { render } from 'vue';

class FileSystemStoreManager {

    static async saveIntoDevice(filePath: string): Promise<string> {
        console.log("substring 3")
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
        
        if (filePath.startsWith("blob:")) {
            return await this.saveBlob(filePath, fileName)
        }

        if (filePath.startsWith("content://")) {
            const data = await FileSystemStoreManager.getBase64BytesFromDisk(filePath)
            console.log("bbbbbbbb1")
            const uriResult = await Filesystem.writeFile({
                path: fileName,
                data: data,
                directory: Directory.Cache
            })
            return uriResult.uri
        }
        console.log("bbbbbbbb2")
        await Filesystem.copy({
            from: filePath,
            to: fileName,
            toDirectory: Directory.Cache
        });
        console.log("aaa1")
        const uriResult = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Cache
        })
        
        return uriResult.uri
    }

    static async remove(filePath: string): Promise<void> {
        console.log("******->4 removeElement")
        console.log("substring 4")
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
        console.log("bbbbbbbb3")
        await Filesystem.deleteFile({
            path: fileName,
            directory: Directory.Cache
        });
    }

    static async getBase64BytesFromDisk(filePath: string) {
        console.log("aaa2")
        const readResult = await Filesystem.readFile({
            path: filePath
        })

        return readResult.data
    }

    static async getBase64BytesFromCacheDisk(filePath: string) {
        console.log("aaa3")
        const fileName = filePath.split("/").pop()
        console.log("filename "+ filePath)
        const readResult = await Filesystem.readFile({
            path: fileName,
            directory: Directory.Cache
        })

        return readResult.data
    }

    static async saveBlob(filePath: string, fileName: string) {
        const response = await fetch(filePath)
        const blob: Blob = await response.blob()
        console.log("substring 5")
        const fileNameWithExtension = fileName + "." + blob.type.substring(blob.type.lastIndexOf('/') + 1)

        const base64Data = await this.convertBlobToBase64(blob) as string
        console.log("bbbbbbbb4")
        const uriResult = await Filesystem.writeFile({
            path: fileNameWithExtension,
            data: base64Data,
            directory: Directory.Cache
        })

        return uriResult.uri
    }

    static convertBlobToBase64(blob: Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject
            reader.onload = () => {
                resolve(reader.result)
            };
            console.log("aaa4")
            reader.readAsDataURL(blob)
        })

    }
    
}

export default FileSystemStoreManager


