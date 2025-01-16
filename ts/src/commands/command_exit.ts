import { writeLine } from "../repl.js";

export function commandExit(): void {
	writeLine("\nClosing the Pokedex... Goodbye!");
	process.exit(0);
}