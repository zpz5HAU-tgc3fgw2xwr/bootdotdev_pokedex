import * as readline from "readline";
import { getCommands } from "./commands/command.js";

export function cleanInput(input: string): string[] {
	return input.trim().split(/\s+/);
}

export function startREPL(stdin: NodeJS.ReadableStream = process.stdin, stout: NodeJS.WritableStream = process.stdout): readline.Interface {
	const rl = readline.createInterface({
		input: stdin,
		output: stout,
		prompt: "Pokedex > ",
	});

	rl.prompt();

	rl.on("line", (line: string) => {
		const input = cleanInput(line);
		stout.write(`Your command was: ${input[0].toLowerCase()}\n`);
		getCommands()[input[0].toLowerCase()]?.callback(getCommands());
		rl.prompt();
	});

	return rl;
}