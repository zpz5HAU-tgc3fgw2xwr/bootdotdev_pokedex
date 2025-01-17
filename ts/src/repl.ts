import { State } from "./state.js";

export function cleanInput(input: string): string[] {
	return input.trim().split(/\s+/);
}

export function startREPL(state: State): void {
	state.wl("Welcome to the Pokedex!");
	state.wl("Type \"help\" for a list of commands.\n");

	state.rl.prompt();

	state.rl.on("line", async (line: string) => {
		const input = cleanInput(line);
		try {
			await state.commands[input[0].toLowerCase()].callback(state);
		} catch (err) {
			if (err instanceof TypeError) {
				state.wl(`Unknown command: ${input[0]}`);
				state.wl(err.message);
			} else if (err instanceof Error) {
				state.wl(err.message);
			}
		}
		state.rl.prompt();
	});
}