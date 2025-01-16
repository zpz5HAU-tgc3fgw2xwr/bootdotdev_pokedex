import { describe, expect, test, vi } from "vitest";
import { initState, type CLICommand, type State } from "./state";
import { createInterface, type Interface } from "readline";
import { commandHelp } from "./commands/command_help";
import { commandExit } from "./commands/command_exit";

vi.mock("readline", () => ({
	createInterface: vi.fn(() => ({
		prompt: vi.fn(),
		on: vi.fn(),
		close: vi.fn(),
	})),
}));

describe("initState", () => {
	test("should call createInterface with the correct arguments", () => {
		// Setup
		const mockStdin = {};
		const mockStdout = {};
		const mockCreateInterface = vi.mocked(createInterface);

		// Execution
		initState(mockStdin as any, mockStdout as any);

		// Assertions
		expect(mockCreateInterface).toHaveBeenCalledWith({
			input: mockStdin,
			output: mockStdout,
			prompt: "Pokedex > "
		});
	});

	test("should return a valid state object", () => {
		// Execution
		const state = initState();

		// Assertions
		expect(state).toBeDefined();
		expect(state.commands).toBeDefined();
		expect(state.commands.help).toEqual({
			name: "help",
			description: "Displays a help message",
			callback: commandHelp
		});
		expect(state.commands.exit).toEqual({
			name: "exit",
			description: "Exit the Pokedex",
			callback: commandExit
		});
		expect(state.rl).toBeDefined();
		expect((state.rl as Interface).prompt).toBeDefined();
	});
});
