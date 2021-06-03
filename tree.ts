import directoryTree from "directory-tree";

type FileType = 'directory' | 'file'

interface File {
    path:string
    name:string
    children?:Array<File>
    size:number,
    type:FileType,
    extension?:string
}

export class DirectoryTree {
    private readonly path:string;
    
    constructor(path:string, onlyDir?:boolean){
        this.path = path
        const data = this.createTreeData()
        console.log(data)
    }

    private createTreeData():File {
        return directoryTree(this.path) as File
    }
}