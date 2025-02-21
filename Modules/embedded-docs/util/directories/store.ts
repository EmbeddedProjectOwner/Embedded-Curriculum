

/**
 * @name Directory_Storage
 * @author @SomePogProgrammer
 */
import cacheStorage from "./storeCache.json"

export type dirType = "Course" | "Folders" | "All Folders"


export type scannedFolder = {
    name: string,
    value: string,
    order?: number
}

export type staticData = scannedFolder[]

export interface Scans {
    dirType: dirType,
    staticData: staticData

}

export type ScanCache = {
    Scans: {
        [index: string]: Scans
    }
}
const jsonCache: ScanCache = cacheStorage





class DirectoryStorage {
    private static instance : DirectoryStorage 
    readonly cache: ScanCache
   
    
    private constructor() {       

        this.cache = jsonCache
        metata
        JSON.stringify
    }

    // Static method to access the instance
    public static getInstance(): DirectoryStorage {
        if (!DirectoryStorage.instance) {
            DirectoryStorage.instance = new DirectoryStorage();
        }
        return DirectoryStorage.instance;
    }

}



