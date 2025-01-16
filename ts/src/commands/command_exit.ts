import { State } from "../state.js";
import { writeLine } from "../repl.js";

export function commandExit(state: State): void {
	writeLine("\nClosing the Pokedex... Goodbye!");
	state.rl.close();
	process.exit(0);
}