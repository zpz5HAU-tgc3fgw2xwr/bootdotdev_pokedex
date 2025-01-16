import { describe, expect, test, vi } from "vitest";
import { commandExit } from "./command_exit";
import { initState, State } from "../state";
import { Writable } from "stream";
import { writeLine } from "../repl";

describe("commandExit", () => {
	test("should write the closing message, close readline, and exit process", () => {
		// Setup
		vi.mock("../repl", () => ({
			writeLine: vi.fn(),
		}));
		
		const mockStdout = new Writable({
			write(chunk, encoding, callback) {
				this.emit("data", chunk.toString());
				callback();
			},
		});

		const state: State = initState(undefined, mockStdout);

		const rlCloseSpy = vi.spyOn(state.rl, "close");
		const processExitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation(((code?: string | number | null) => {
				throw new Error(`process.exit was called with code: ${code}`);
			}) as typeof process.exit);

		// Execution
		expect(() => commandExit(state)).toThrow("process.exit was called with code: 0");

		// Assertions
		expect(writeLine).toHaveBeenCalledWith("\nClosing the Pokedex... Goodbye!");
		expect(rlCloseSpy).toHaveBeenCalledOnce();
		expect(processExitSpy).toHaveBeenCalledOnce();
		expect(processExitSpy).toHaveBeenCalledWith(0);

		// Cleanup
		processExitSpy.mockRestore();
	});
});