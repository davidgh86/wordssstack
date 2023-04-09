'use strict';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { v4 as uuid } from 'uuid'

class FileSystemStoreManager {

    static async saveIntoDevice(filePath: string): Promise<string> {

        let savingPath = filePath;

        if (savingPath.startsWith("data:")) {
            savingPath = await this.saveBlob(filePath, uuid())
            return savingPath;
        } 

        const fileName = savingPath.substring(savingPath.lastIndexOf('/') + 1)
        
        if (savingPath.startsWith("blob:")) {
            return await this.saveBlob(savingPath, fileName)
        }

        if (savingPath.startsWith("content://")) {
            const data = await FileSystemStoreManager.getBase64BytesFromDisk(savingPath)
            const uriResult = await Filesystem.writeFile({
                path: fileName,
                data: data,
                directory: Directory.Cache
            })
            return uriResult.uri
        }

        await Filesystem.copy({
            from: savingPath,
            to: fileName.replace(/ /g, "_"),
            toDirectory: Directory.Cache
        });

        const uriResult = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Cache
        })
        
        return uriResult.uri
    }

    static async remove(filePath: string): Promise<void> {
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
        await Filesystem.deleteFile({
            path: fileName,
            directory: Directory.Cache
        });
    }

    static async getBase64BytesFromDisk(filePath: string) {
        const readResult = await Filesystem.readFile({
            path: filePath
        })

        return readResult.data
    }

    static async getBase64BytesFromCacheDisk(filePath: string) {
        const fileName = filePath.split("/").pop()
        const readResult = await Filesystem.readFile({
            path: fileName,
            directory: Directory.Cache
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


