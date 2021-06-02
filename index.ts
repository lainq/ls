import { redBright } from "chalk";
import { existsSync, statSync } from "fs";
import { dirname } from "path";
import { argv, cwd } from "process";
import { ArgumentParser, ArgumentParserResult } from "./arguments";
import { ListDirectories } from "./list";

export const directoryExists = (
  directory: string,
  isDirectory: boolean
): boolean => {
  try {
    const exists: boolean = existsSync(directory);
    const isDir: boolean = isDirectory
      ? statSync(directory).isDirectory()
      : true;
    return exists && isDir;
  } catch (exception) {
    return false;
  }
};

const validateDirectory = (
  results: ArgumentParserResult
): ArgumentParserResult => {
  const directory = results.command;
  if (directory == null || directory == ".") {
    results.command = cwd();
    return results;
  } else if (directory == "..") {
    results.command = dirname(cwd());
  }

  const exists = directoryExists(results.command, true);
  if (!exists) {
    console.log(redBright(`${results.command} does not exist`));
    process.exit();
  }

  return results;
};

const argumentParser: ArgumentParserResult = new ArgumentParser(
  argv.slice(2)
).createParserResults();
const valid = validateDirectory(argumentParser);

const ls = new ListDirectories(valid.command);
