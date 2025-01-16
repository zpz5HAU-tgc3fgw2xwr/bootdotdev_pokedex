import { createInterface, type Interface } from "readline";
import { commandHelp } from "./commands/command_help.js";
import { commandExit } from "./commands/command_exit.js";

export type CLICommand = {
	name: string;
	description: string;
	callback: (state: State) => void;
};

export type State = {
	commands: Record<string, CLICommand>;
	rl: Interface;
}

export function initState(stdin: NodeJS.ReadableStream = process.stdin, stout: NodeJS.WritableStream = process.stdout): State {
	return {
		commands: {
			help: {
				name: "help",
				description: "Displays a help message",
				callback: commandHelp
			},
			exit: {
				name: "exit",
				description: "Exit the Pokedex",
				callback: commandExit
			}
		},
		rl: createInterface({
			input: stdin,
			output: stout,
			prompt: "Pokedex > "
		})
	};
}