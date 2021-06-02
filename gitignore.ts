import { readFileSync } from "fs";
import { join } from "path";
import { directoryExists } from "./index";

export const ignore = (file: string, path: string, ignores: Array<string>) => {
  const ignored: Array<string> = ignores.filter(
    (ignoreFile: string): boolean => {
      return file.endsWith(ignoreFile.slice(0, -1));
    }
  );
  return ignored.length == 0;
};

const parseGitignore = (content: string): Array<string> => {
  return content.split("\n").filter((element: string) => {
    return element.length != 0 && element.charAt(0) != "#";
  });
};

export const gitignore = (path: string): Array<string> => {
  const file: string = join(path, ".gitignore");
  const exists: boolean = directoryExists(file, false);
  if (!exists) {
    return [];
  }
  const files: Array<string> = parseGitignore(readFileSync(file).toString());
  return files;
};
