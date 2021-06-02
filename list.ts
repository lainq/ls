import { readdir, statSync } from "fs";
import { blueBright, Chalk, cyanBright, redBright, yellowBright } from "chalk";
import { join } from "path";
import { directoryExists } from  './index'
import { gitignore, ignore } from './gitignore'

export class ListDirectories {
  private readonly directory: string;
  private ignores:Array<string> = [];

  constructor(directory: string) {
    this.directory = directory;
    this.executeLsCommand(this.directory);
  }

  private executeLsCommand(directory: string): void {
    if (!directoryExists(directory, true)) {
      console.log(redBright(`ERROR: ${directory} is not a directory`));
      process.exit();
    }

    this.ignores = gitignore(this.directory)
    readdir(directory, (err: any, content: Array<string>): void => {
      if (err) {
        console.log(redBright(`ERROR: ${err.msg}`));
        process.exit();
      }
      content.forEach((filename: string): void => {
        try {
            if (ignore(filename, directory, this.ignores)){
                const size: number = statSync(filename).size;
                const isDir: boolean = directoryExists(join(directory, filename),true);
                const color: Chalk = isDir ? blueBright : yellowBright;
                const sizeString: string = `size:${size} bytes`;
                console.log(`${color(filename)} -> [${cyanBright(sizeString)}]`);
            }
        } catch(exception){}
      });
    });
  }

}