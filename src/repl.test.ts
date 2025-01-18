import { describe, expect, test, beforeEach, vi } from "vitest";
import { cleanInput, startREPL } from "./repl";

describe("cleanInput", () => {
	test.each([
		{ input: "  hello  world  ", expected: ["hello", "world"] },
		{ input: "singleword", expected: ["singleword"] },
		{ input: "  multiple   spaces  ", expected: ["multiple", "spaces"] },
		{ input: "", expected: [""] },
	])("should clean input \"$input\"", ({ input, expected }) => {
		// Execution
		const actual = cleanInput(input);

		// Assertions
		expect(actual).toEqual(expected);
	});
});

describe("startREPL", () => {
	let mockState: any;
	let mockPrompt: ReturnType<typeof vi.fn>;
	let mockOn: ReturnType<typeof vi.fn>;
	let mockCommands: any;
	let mockWriteLine: ReturnType<typeof vi.fn>;

	// Setup
	beforeEach(() => {
		mockPrompt = vi.fn();
		mockOn = vi.fn();
		mockWriteLine = vi.fn();

		mockCommands = {
			help: { callback: vi.fn() }
		};

		mockState = {
			rl: {
				prompt: mockPrompt,
				on: (event: string, callback: (line: string) => void) => {
					mockOn(event, callback);
					if (event === "line") callback("");
				}
			},
			commands: mockCommands,
			wl: mockWriteLine
		};
	});

	test("should execute a known command", () => {
		// Setup
		mockOn.mockImplementation((event, callback) => {
			if (event === "line") {
				callback("help");
				callback("");
			}
		});
	
		// Execution
		startREPL(mockState);
	
		// Assertions
		expect(mockState.wl).toHaveBeenCalledWith("Welcome to the Pokédex!");
		expect(mockState.wl).toHaveBeenCalledWith("Type \"help\" for a list of commands.\n");
		expect(mockOn).toHaveBeenCalledWith("line", expect.any(Function));
		expect(mockCommands.help.callback).toHaveBeenCalledWith(mockState);
		expect(mockPrompt).toHaveBeenCalledTimes(3);
	});
	

	test("should handle unknown commands gracefully", () => {
		// Setup
		mockOn.mockImplementationOnce((event, callback) => {
			if (event === "line") { callback("unknownCommand"); }
		});

		// Execution
		startREPL(mockState);

		// Assertions
		expect(mockState.wl).toHaveBeenCalledWith("Welcome to the Pokédex!");
		expect(mockState.wl).toHaveBeenCalledWith('Type "help" for a list of commands.\n');
		expect(mockOn).toHaveBeenCalledWith("line", expect.any(Function));
		expect(mockCommands.help.callback).not.toHaveBeenCalled();
		expect(mockPrompt).toHaveBeenCalledTimes(3);
	});
});