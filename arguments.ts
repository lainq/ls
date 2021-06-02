import { redBright } from 'chalk'

export interface ArgumentParserResult {
    command:string | null,
    flags:Array<string>
}

export class ArgumentParser {
    private readonly arguments:Array<string>
    
    constructor(args:Array<string>){
        this.arguments = args;
    }

    public createParserResults():ArgumentParserResult {
        let command:string | null = null;
        let parameters:Array<string> = new Array<string>()
        for(let index=0; index<this.arguments.length; index++){
            if(index == 0){
                command = this.arguments[index]
                continue
            }

            const isValidParameter = this.arguments[index].startsWith('--')
            if(!isValidParameter){
                console.log(redBright(`${this.arguments[index]}is not a valid flag`))
                process.exit(1)
            }
            parameters.push(this.arguments[index].slice(2))
        }
        return {command:command, flags:parameters}
    }
}