import { argv } from "process";
import { ArgumentParser, ArgumentParserResult } from "./arguments";

const argumentParser:ArgumentParserResult = new ArgumentParser(argv.slice(2)).createParserResults()
console.log(argumentParser)
