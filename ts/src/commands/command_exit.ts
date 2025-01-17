import { State } from "../state.js";

export async function commandExit(state: State): Promise<void> {
	state.wl("\nClosing the Pokedex... Goodbye!");
	state.rl.close();
	process.exit(0);
}