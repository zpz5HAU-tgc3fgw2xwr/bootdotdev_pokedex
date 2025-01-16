import { commandHelp } from "./command_help.js";
import { commandExit } from "./command_exit.js";

export type CLICommand = {
	name: string;
	description: string;
	callback: (commands: Record<string, CLICommand>) => void;
};

export function getCommands(): Record<string, CLICommand> {
	return {
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
	};
}
