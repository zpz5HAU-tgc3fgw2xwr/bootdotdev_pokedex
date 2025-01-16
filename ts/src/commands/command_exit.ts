export function commandExit(): void {
	process.stdout.write("Closing the Pokedex... Goodbye!\n");
	process.exit(0);
}