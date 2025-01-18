import { describe, expect, test, vi } from "vitest";
import { commandExit } from "./command_exit";
import { initState, State } from "../state";
import { Writable } from "stream";

describe("commandExit", () => {
	test("should write the closing message, close readline, and exit process", async () => {
		// Setup
		const mockWriteLine = vi.fn();

		const mockStdout = new Writable({
			write(chunk, encoding, callback) {
				this.emit("data", chunk.toString());
				callback();
			},
		});

		const state: State = {
			...initState(undefined, mockStdout),
			wl: mockWriteLine,
		};

		const rlCloseSpy = vi.spyOn(state.rl, "close");
		const processExitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation(((code?: string | number | null) => {
				throw new Error(`process.exit was called with code: ${code}`);
			}) as typeof process.exit);

		try {
			// Execution
			await expect(commandExit(state)).rejects.toThrow("process.exit was called with code: 0");

			// Assertions
			expect(mockWriteLine).toHaveBeenCalledWith("\nClosing the Pokédex... Goodbye!");
			expect(rlCloseSpy).toHaveBeenCalledOnce();
			expect(processExitSpy).toHaveBeenCalledOnce();
			expect(processExitSpy).toHaveBeenCalledWith(0);
		} finally {
			// Cleanup
			processExitSpy.mockRestore();
		}
	});
});
