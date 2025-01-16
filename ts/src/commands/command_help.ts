import { writeLine } from "../repl.js";
import { State } from "../state.js";

export function commandHelp(state: State): void {
	writeLine("\nUsage:\n");
	for (const commandName in state.commands) {
		const command = state.commands[commandName];
		writeLine(`${command.name}: ${command.description}`);
	}
	writeLine();
}