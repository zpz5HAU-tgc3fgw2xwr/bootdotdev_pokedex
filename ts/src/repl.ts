import * as readline from "readline";
import { getCommands } from "./commands/command.js";

export function cleanInput(input: string): string[] {
	return input.trim().split(/\s+/);
}

export function writeLine(line = ""): void {
	process.stdout.write(`${line}\n`);
}

export function startREPL(stdin: NodeJS.ReadableStream = process.stdin, stout: NodeJS.WritableStream = process.stdout): readline.Interface {
	writeLine("Welcome to the Pokedex!");
	writeLine("Type \"help\" for a list of commands.\n");

	const rl = readline.createInterface({
		input: stdin,
		output: stout,
		prompt: "Pokedex > ",
	});

	rl.prompt();

	rl.on("line", (line: string) => {
		const input = cleanInput(line);
		getCommands()[input[0].toLowerCase()]?.callback(getCommands());
		rl.prompt();
	});

	return rl;
}