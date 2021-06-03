import { readdir, statSync } from "fs";
import { blueBright, Chalk, cyanBright, redBright, yellowBright } from "chalk";
import { join } from "path";
import { directoryExists } from "./index";
import { gitignore, ignore } from "./gitignore";
import { DirectoryTree } from "./tree";

interface Options {
  onlyDir?:boolean
  onlyFiles?:boolean
  createDirectoryTree? : boolean
}

export class ListDirectories {
  private readonly directory: string;
  private ignores: Array<string> = [];
  private options:Options;

  constructor(directory: string, options:Options) {
    this.directory = directory;
    this.options = options;
    this.executeLsCommand(this.directory);
  }

  private executeLsCommand(directory: string): void | null {
    if (!directoryExists(directory, true)) {
      console.log(redBright(`ERROR: ${directory} is not a directory`));
      process.exit();
    }

    this.ignores = gitignore(this.directory);
    if(this.options.createDirectoryTree){
      const tree = new DirectoryTree(this.directory, this.options.onlyDir)
      return null
    }
    readdir(directory, (err: any, content: Array<string>): void => {
      if (err) {
        console.log(redBright(`ERROR: ${err.msg}`));
        process.exit();
      }
      content.filter((contentItem:string):boolean => {
        if(this.options.onlyDir){
          return directoryExists(join(directory, contentItem), true)
        } else if(this.options.onlyFiles){
          return directoryExists(join(directory,contentItem), false)
        }
        return true
      }).forEach((filename: string): void => {
        try {
          if (ignore(filename, directory, this.ignores)) {
            const size: number = statSync(filename).size;
            const isDir: boolean = directoryExists(
              join(directory, filename),
              true
            );
            const color: Chalk = isDir ? blueBright : yellowBright;
            const sizeString: string = `size:${size} bytes`;
            console.log(`${color(filename)} -> [${cyanBright(sizeString)}]`);
          }
        } catch (exception) {}
      });
    });
  }
}
