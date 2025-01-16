import { State } from "./state.js";

export function cleanInput(input: string): string[] {
	return input.trim().split(/\s+/);
}

export function writeLine(line = ""): void {
	process.stdout.write(`${line}\n`);
}

export function startREPL(state: State): void {
	writeLine("Welcome to the Pokedex!");
	writeLine("Type \"help\" for a list of commands.\n");

	state.rl.prompt();

	state.rl.on("line", (line: string) => {
		const input = cleanInput(line);
		state.commands[input[0].toLowerCase()]?.callback(state);
		state.rl.prompt();
	});
}