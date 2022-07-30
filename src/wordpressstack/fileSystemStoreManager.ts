'use strict';

import { Filesystem, Directory } from '@capacitor/filesystem';

class FileSystemStoreManager {

    static async saveIntoDevice(filePath: string): Promise<string> {
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
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
    
}

export default FileSystemStoreManager


