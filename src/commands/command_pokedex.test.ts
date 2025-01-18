import { describe, test, expect, vi, beforeEach } from "vitest";
import { Pokemon } from "pokenode-ts"
import { commandPokedex } from "./command_pokedex";
import { State } from "../state";

describe("commandPokedex", () => {
	let mockState: State;

	// Setup
	beforeEach(() => {
		mockState = {
			pokedex: {},
			wl: vi.fn()
		} as unknown as State;
	});

	test("should notify when the Pokédex is empty", async () => {
		// Execution
		await commandPokedex(mockState);

		// Assertions
		expect(mockState.wl).toHaveBeenCalledWith("Your Pokédex is empty.");
		expect(mockState.wl).toHaveBeenCalledTimes(1);
	});

	test("should list all Pokémon in the Pokédex", async () => {
		// Setup
		const pokedexEntries = ["pikachu", "charmander", "bulbasaur"];
		mockState.pokedex = Object.fromEntries(pokedexEntries.map((name) => [name, { name: name} as Pokemon]));

		// Execution
		await commandPokedex(mockState);

		// Assertions
		expect(mockState.wl).toHaveBeenNthCalledWith(1, "Your Pokédex:");
		pokedexEntries.forEach((pokemonName, index) =>
			expect(mockState.wl).toHaveBeenNthCalledWith(index + 2, ` - ${pokemonName}`)
		);
		expect(mockState.wl).toHaveBeenCalledTimes(1 + pokedexEntries.length);
	});

	test("should handle an edge case with a single Pokémon in the Pokédex", async () => {
		// Setup
		mockState.pokedex = { eevee: { name: "eevee" } as Pokemon };

		// Execution
		await commandPokedex(mockState);

		// Assertions
		expect(mockState.wl).toHaveBeenNthCalledWith(1, "Your Pokédex:");
		expect(mockState.wl).toHaveBeenNthCalledWith(2, " - eevee");
		expect(mockState.wl).toHaveBeenCalledTimes(2);
	});
});