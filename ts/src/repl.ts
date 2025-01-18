import { State } from "./state.js";

export function cleanInput(input: string): string[] {
	return input.trim().split(/\s+/);
}

export function startREPL(state: State): void {
	state.wl("Welcome to the Pokédex!");
	state.wl("Type \"help\" for a list of commands.\n");

	state.rl.prompt();

	state.rl.on("line", async (line: string) => {
		const input = cleanInput(line);
		try {
			await state.commands[input[0].toLowerCase()].callback(state, ...input.slice(1));
		} catch (err) {
			if (err instanceof TypeError) { state.wl(`Unknown command: ${input[0]}`); }
			else if (err instanceof Error) { state.wl(err.message); }
			else { state.wl("An unknown error occurred."); }
		}
		state.rl.prompt();
	});
}