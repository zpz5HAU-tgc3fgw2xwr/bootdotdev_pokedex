import { describe, test, expect, vi, beforeEach } from "vitest";
import { commandCatch } from "./command_catch";
import { State } from "../state";

describe("commandCatch", () => {
	let mockWriteLine: ReturnType<typeof vi.fn>;
	let mockPokeAPI: { getPokemon: ReturnType<typeof vi.fn> };
	let mockState: State;

	// Setup
	beforeEach(() => {
		mockWriteLine = vi.fn();
		mockPokeAPI = { getPokemon: vi.fn() };

		mockState = {
			wl: mockWriteLine,
			pokedex: {} as any,
			pokeapi: mockPokeAPI as any,
			rl: vi.fn() as any,
			_cache: {} as any,
			_axios: {} as any,
			commands: {} as any
		};
	});

	test("should write success message when Pokémon is caught", async () => {
		// Setup
		const mockPokemon = { name: "pikachu" };
		mockPokeAPI.getPokemon.mockResolvedValue(mockPokemon);
		vi.spyOn(Math, "random").mockReturnValue(0.6);

		// Execution
		await commandCatch(mockState, mockPokemon.name);

		// Assertions
		expect(mockPokeAPI.getPokemon).toHaveBeenCalledWith(mockPokemon.name);
		expect(mockWriteLine).toHaveBeenCalledWith(`Throwing a Pokéball at ${mockPokemon.name}...`);
		expect(mockWriteLine).toHaveBeenCalledWith(`${mockPokemon.name} was caught!`);
	});

	test("should write escape message when Pokémon escapes", async () => {
		// Setup
		const mockPokemon = { name: "bulbasaur" };
		mockPokeAPI.getPokemon.mockResolvedValue(mockPokemon);
		vi.spyOn(Math, "random").mockReturnValue(0.4);

		// Execution
		await commandCatch(mockState, mockPokemon.name);

		// Assertions
		expect(mockPokeAPI.getPokemon).toHaveBeenCalledWith(mockPokemon.name);
		expect(mockWriteLine).toHaveBeenCalledWith(`Throwing a Pokéball at ${mockPokemon.name}...`);
		expect(mockWriteLine).toHaveBeenCalledWith(`${mockPokemon.name} escaped!`);
	});

	test("should handle invalid Pokémon name gracefully", async () => {
		// Setup
		const mockError = new Error("Pokémon not found");
		mockPokeAPI.getPokemon.mockRejectedValue(mockError);

		// Execution
		await commandCatch(mockState, "InvalidPokemon");

		// Assertions
		expect(mockPokeAPI.getPokemon).toHaveBeenCalledWith("invalidpokemon");
		expect(mockWriteLine).toHaveBeenCalledWith("Failed to catch Pokémon: Pokémon not found");
	});

	test("should handle mixed case Pokémon names correctly", async () => {
		// Setup
		const mockPokemon = { name: "charmander" };
		mockPokeAPI.getPokemon.mockResolvedValue(mockPokemon);

		// Execution
		await commandCatch(mockState, "cHaRmAnDeR");

		// Assertions
		expect(mockPokeAPI.getPokemon).toHaveBeenCalledWith(mockPokemon.name);
		expect(mockWriteLine).toHaveBeenCalledWith(`Throwing a Pokéball at ${mockPokemon.name}...`);
	});

	test("should write success or escape message randomly for repeated calls", async () => {
		// Setup
		const mockPokemon = { name: "squirtle" };
		mockPokeAPI.getPokemon.mockResolvedValue(mockPokemon);

		// Execution
		await commandCatch(mockState, mockPokemon.name);

		// Assertions
		expect(mockPokeAPI.getPokemon).toHaveBeenCalledWith(mockPokemon.name);
		expect(mockWriteLine).toHaveBeenCalledWith(`Throwing a Pokéball at ${mockPokemon.name}...`);
		expect(
			mockWriteLine.mock.calls.some(
				(call) => call[0] === `${mockPokemon.name} was caught!` || call[0] === `${mockPokemon.name} escaped!`
			)
		).toBeTruthy();
	});

	test("should save Pokémon to Pokédex when caught", async () => {
		// Setup
		const mockPokemon = { name: "pikachu" };
		mockPokeAPI.getPokemon.mockResolvedValue(mockPokemon);
		vi.spyOn(Math, "random").mockReturnValue(0.6);

		// Execution
		await commandCatch(mockState, mockPokemon.name);

		// Assertions
		expect(mockState.pokedex[mockPokemon.name]).toEqual(mockPokemon);
	});
});