import { beforeEach, describe, expect, test, vi } from "vitest";
import { commandExplore } from "./command_explore";
import { State } from "../state";

describe("commandExplore", () => {
	let mockWriteLine: ReturnType<typeof vi.fn>;
	let mockPokeAPI: { getLocationArea: ReturnType<typeof vi.fn> };
	let mockState: State;

	// Setup
	beforeEach(() => {
		mockWriteLine = vi.fn();
		mockPokeAPI = { getLocationArea: vi.fn() };

		mockState = {
			commands: {},
			rl: vi.fn() as unknown as State["rl"],
			wl: mockWriteLine,
			pokeapi: mockPokeAPI as any,
			_cache: {} as any,
			_axios: {} as any
		};
	});

	test("should write the location name and encountered Pokémon if found", async () => {
		// Setup
		const locationArea = {
			name: "test-area",
			pokemon_encounters: [
				{ pokemon: { name: "pikachu" } },
				{ pokemon: { name: "bulbasaur" } },
				{ pokemon: { name: "charmander" } }
			]
		};
		mockPokeAPI.getLocationArea.mockResolvedValue(locationArea);
	
		// Execution
		await commandExplore(mockState, "test-area");
	
		// Assertions
		expect(mockPokeAPI.getLocationArea).toHaveBeenCalledWith("test-area");
		expect(mockWriteLine).toHaveBeenCalledWith("Exploring test-area...");
		expect(mockWriteLine).toHaveBeenCalledWith("Found Pokémon:");
		locationArea.pokemon_encounters.forEach(encounter => expect(mockWriteLine).toHaveBeenCalledWith(` - ${encounter.pokemon.name}`));
		expect(mockWriteLine).toHaveBeenCalledTimes(2 + locationArea.pokemon_encounters.length);
	});
	

	test("should write the location name and 'Nothing found.' if no Pokémon are present", async () => {
		// Setup
		const locationArea = {
			name: "empty-area",
			pokemon_encounters: [],
		};
		mockPokeAPI.getLocationArea.mockResolvedValue(locationArea);

		// Execution
		await commandExplore(mockState, "empty-area");

		// Assertions
		expect(mockPokeAPI.getLocationArea).toHaveBeenCalledWith("empty-area");
		expect(mockWriteLine).toHaveBeenCalledWith("Exploring empty-area...");
		expect(mockWriteLine).toHaveBeenCalledWith("Nothing found.");
		expect(mockWriteLine).toHaveBeenCalledTimes(2);
	});

	test("should handle API errors gracefully and write the error message", async () => {
		// Setup
		const errorMessage = "Location not found.";
		mockPokeAPI.getLocationArea.mockRejectedValue(new Error(errorMessage));

		// Execution
		await commandExplore(mockState, "invalid-area");

		// Assertions
		expect(mockPokeAPI.getLocationArea).toHaveBeenCalledWith("invalid-area");
		expect(mockWriteLine).toHaveBeenCalledWith(errorMessage);
		expect(mockWriteLine).toHaveBeenCalledTimes(1);
	});
});