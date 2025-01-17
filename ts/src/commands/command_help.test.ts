import { describe, expect, test, vi } from "vitest";
import { commandHelp } from "./command_help";
import { initState, State } from "../state";
import { Writable } from "stream";

describe("commandHelp", () => {
	test("should write the correct usage information", () => {
		// Setup
		const mockWriteLine = vi.fn();

		const mockStdout = new Writable({
			write(chunk, encoding, callback) {
				this.emit("data", chunk.toString());
				callback();
			},
		});

		const fixedCommands = {
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
		};

		const state: State = {
			...initState(undefined, mockStdout),
			commands: fixedCommands,
			wl: mockWriteLine,
		};

		// Execution
		commandHelp(state);

		// Assertions
		expect(mockWriteLine).toHaveBeenCalledWith("\nUsage:\n");
		expect(mockWriteLine).toHaveBeenCalledWith(`${fixedCommands.help.name}: ${fixedCommands.help.description}`);
		expect(mockWriteLine).toHaveBeenCalledWith(`${fixedCommands.exit.name}: ${fixedCommands.exit.description}`);
		expect(mockWriteLine).toHaveBeenCalledWith();
		expect(mockWriteLine).toHaveBeenCalledTimes(4);
	});
});
