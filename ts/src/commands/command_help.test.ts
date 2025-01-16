import { describe, expect, test, vi } from "vitest";
import { commandHelp } from "./command_help";
import { State } from "../state";
import { writeLine } from "../repl";

describe("commandHelp", () => {
	test("should write the correct usage information", () => {
		// Setup
		vi.mock("../repl", () => ({
			writeLine: vi.fn(),
		}));

		const mockState: State = {
			commands: {
				help: {
					name: "help",
					description: "Displays a help message",
					callback: vi.fn(),
				},
				exit: {
					name: "exit",
					description: "Exit the Pokedex",
					callback: vi.fn(),
				},
			},
			rl: vi.fn() as unknown as State["rl"],
		};

		// Execution
		commandHelp(mockState);

		// Assertions
		expect(writeLine).toHaveBeenCalledWith("\nUsage:\n");
		expect(writeLine).toHaveBeenCalledWith("help: Displays a help message");
		expect(writeLine).toHaveBeenCalledWith("exit: Exit the Pokedex");
		expect(writeLine).toHaveBeenCalledTimes(4);
	});
});
