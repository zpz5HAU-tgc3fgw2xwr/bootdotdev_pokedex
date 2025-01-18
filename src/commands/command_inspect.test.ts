import { describe, test, expect, vi, beforeEach } from "vitest";
import { Pokemon } from "pokenode-ts";
import { commandInspect } from "./command_inspect";
import { State } from "../state";

describe("commandInspect", () => {
	let mockState: State;

	beforeEach(() => {
		mockState = {
			pokedex: {},
			wl: vi.fn()
		} as unknown as State;
	});

	test("should notify if the Pokémon is not in the Pokédex", async () => {
		// Setup
		const pokemonName = "mewtwo";

		// Execution
		await commandInspect(mockState, pokemonName);

		// Assertions
		expect(mockState.wl).toHaveBeenCalledWith("you have not caught that pokemon");
		expect(mockState.wl).toHaveBeenCalledTimes(1);
	});

	test("should display all details for a Pokémon in the Pokédex", async () => {
		// Setup
		const pokemonName = "pikachu";
		mockState.pokedex = {
			[pokemonName]: {
				name: "Pikachu",
				height: 4,
				weight: 60,
				stats: [
					{ base_stat: 35, stat: { name: "hp" } },
					{ base_stat: 55, stat: { name: "attack" } },
					{ base_stat: 40, stat: { name: "defense" } }
				],
				types: [
					{ type: { name: "electric" } }
				]
			} as Pokemon
		};
		const pokemon = mockState.pokedex[pokemonName];

		// Execution
		await commandInspect(mockState, pokemonName);

		// Assertions
		expect(mockState.wl).toHaveBeenNthCalledWith(1, `Name: ${pokemon.name}`);
		expect(mockState.wl).toHaveBeenNthCalledWith(2, `Height: ${pokemon.height}`);
		expect(mockState.wl).toHaveBeenNthCalledWith(3, `Weight: ${pokemon.weight}`);
		expect(mockState.wl).toHaveBeenNthCalledWith(4, "Stats:");
		pokemon.stats.forEach((stat, index) => expect(mockState.wl).toHaveBeenNthCalledWith(5 + index, ` - ${stat.stat.name}: ${stat.base_stat}`));
		expect(mockState.wl).toHaveBeenNthCalledWith(8, "Types:");
		pokemon.types.forEach((type, index) => expect(mockState.wl).toHaveBeenNthCalledWith(9 + index, ` - ${type.type.name}`));
		expect(mockState.wl).toHaveBeenCalledTimes(9);
	});

	test("should handle a Pokémon with no stats or types gracefully", async () => {
		// Setup
		const pokemonName = "magikarp";
		mockState.pokedex = {
			[pokemonName]: {
				name: "Magikarp",
				height: 2,
				weight: 10,
				stats: [],
				types: []
			} as unknown as Pokemon
		};
		const pokemon = mockState.pokedex[pokemonName];

		// Execution
		await commandInspect(mockState, pokemonName);

		// Assertions
		expect(mockState.wl).toHaveBeenNthCalledWith(1, `Name: ${pokemon.name}`);
		expect(mockState.wl).toHaveBeenNthCalledWith(2, `Height: ${pokemon.height}`);
		expect(mockState.wl).toHaveBeenNthCalledWith(3, `Weight: ${pokemon.weight}`);
		expect(mockState.wl).toHaveBeenNthCalledWith(4, "Stats:");
		expect(mockState.wl).toHaveBeenNthCalledWith(5, "Types:");
		expect(mockState.wl).toHaveBeenCalledTimes(5);
	});
});