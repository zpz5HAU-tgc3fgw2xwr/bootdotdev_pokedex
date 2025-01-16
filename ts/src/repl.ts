import { createInterface } from "readline";
import * as readline from "readline";

export function cleanInput(input: string): string[] {
	return input.trim().split(/\s+/);
}

export function startREPL(stdin: NodeJS.ReadableStream = process.stdin, stout: NodeJS.WritableStream = process.stdout): readline.Interface {
	const rl = createInterface({
		input: stdin,
		output: stout,
		prompt: "Pokedex > ",
	});

	rl.prompt();

	rl.on("line", (line: string) => {
		const input = cleanInput(line);
		stout.write(`Your command was: ${input[0].toLowerCase()}\n`);
		rl.prompt();
	});

	return rl;
}