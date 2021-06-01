import { existsSync, readdir, statSync } from "fs";
import { blueBright, Chalk, cyanBright, redBright, yellowBright } from 'chalk'
import { cwd } from "process";
import { join } from "path";

class ListDirectories {
    private readonly directory:string;

    constructor(directory:string) {
        this.directory = directory;
        this.executeLsCommand(this.directory)
    }

    private executeLsCommand(directory:string):void {
        if(!this.directoryExists(directory)){
            console.log(redBright(`ERROR: ${directory} is not a directory`))
            process.exit()
        }

        readdir(directory, (err:any, content:Array<string>):void => {
            if(err) {
                console.log(redBright(`ERROR: ${err.msg}`))
                process.exit()
            }
            content.forEach((filename:string):void => {
                const size:number = statSync(filename).size
                const isDir:boolean = this.directoryExists(join(directory, filename))
                const color:Chalk = isDir ? blueBright : yellowBright
                const sizeString:string = `size:${size} bytes`
                console.log(`${color(filename)} -> [${cyanBright(sizeString)}]`)

            })
        })
    }

    private directoryExists(directory:string):boolean {
        try {
            const exists:boolean = existsSync(directory)
            const isDir:boolean = statSync(directory).isDirectory()
            return exists &&  isDir  
        } catch(exception) {
            return false
        }
    }
}

let args = process.argv;
args = args.slice(2)

console.log(args[1])

const ls = new ListDirectories(args[0] || cwd())