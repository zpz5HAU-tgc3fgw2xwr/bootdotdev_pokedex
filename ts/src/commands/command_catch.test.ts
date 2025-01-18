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
		mockPokeAPI = {
			getPokemon: vi.fn(),
		};

		mockState = {
			wl: mockWriteLine,
			pokeapi: mockPokeAPI as any,
			rl: vi.fn() as any,
			_cache: {} as any,
			_axios: {} as any,
			commands: {} as any,
		};
	});

	test("should write success message when Pokémon is caught", async () => {
		// Setup
		const mockPokemon = { name: "Pikachu" };
		mockPokeAPI.getPokemon.mockResolvedValue(mockPokemon);
		vi.spyOn(Math, "random").mockReturnValue(0.6);

		// Execution
		await commandCatch(mockState, "Pikachu");

		// Assertions
		expect(mockPokeAPI.getPokemon).toHaveBeenCalledWith("pikachu");
		expect(mockWriteLine).toHaveBeenCalledWith("Throwing a Pokéball at Pikachu...");
		expect(mockWriteLine).toHaveBeenCalledWith("Pikachu was caught!");
	});

	test("should write escape message when Pokémon escapes", async () => {
		// Setup
		const mockPokemon = { name: "Bulbasaur" };
		mockPokeAPI.getPokemon.mockResolvedValue(mockPokemon);
		vi.spyOn(Math, "random").mockReturnValue(0.4);

		// Execution
		await commandCatch(mockState, "Bulbasaur");

		// Assertions
		expect(mockPokeAPI.getPokemon).toHaveBeenCalledWith("bulbasaur");
		expect(mockWriteLine).toHaveBeenCalledWith("Throwing a Pokéball at Bulbasaur...");
		expect(mockWriteLine).toHaveBeenCalledWith("Bulbasaur escaped!");
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
		const mockPokemon = { name: "Charmander" };
		mockPokeAPI.getPokemon.mockResolvedValue(mockPokemon);

		// Execution
		await commandCatch(mockState, "cHaRmAnDeR");

		// Assertions
		expect(mockPokeAPI.getPokemon).toHaveBeenCalledWith("charmander");
		expect(mockWriteLine).toHaveBeenCalledWith("Throwing a Pokéball at Charmander...");
	});

	test("should write success or escape message randomly for repeated calls", async () => {
		// Setup
		const mockPokemon = { name: "Squirtle" };
		mockPokeAPI.getPokemon.mockResolvedValue(mockPokemon);

		// Execution
		await commandCatch(mockState, "Squirtle");

		// Assertions
		expect(mockPokeAPI.getPokemon).toHaveBeenCalledWith("squirtle");
		expect(mockWriteLine).toHaveBeenCalledWith("Throwing a Pokéball at Squirtle...");
		expect(
			mockWriteLine.mock.calls.some(
				(call) => call[0] === "Squirtle was caught!" || call[0] === "Squirtle escaped!"
			)
		).toBeTruthy();
	});
});
