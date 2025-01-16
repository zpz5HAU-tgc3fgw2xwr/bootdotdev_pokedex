import { writeLine } from "../repl.js";
import { CLICommand } from "./command";

export function commandHelp(commands: Record<string, CLICommand>): void {
	writeLine("\nUsage:\n");
	for (const commandName in commands) {
		const command = commands[commandName];
		writeLine(`${command.name}: ${command.description}`);
	}
	writeLine();
}