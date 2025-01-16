import { describe, expect, test, beforeEach, vi } from "vitest";
import { cleanInput, writeLine, startREPL } from "./repl";

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

describe("writeLine", () => {
	test.each([
		{ input: "Hello, world!", expected: "Hello, world!\n" },
		{ input: "  Leading spaces", expected: "  Leading spaces\n" },
		{ input: "\nNewline in input", expected: "\nNewline in input\n" },
		{ input: "\tTabs in input", expected: "\tTabs in input\n" },
		{ input: "", expected: "\n" },
		{ input: "   ", expected: "   \n" },
	])("should write \"$input\" to stdout", ({ input, expected }) => {
		// Setup
		const mockWrite = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		// Execution
		writeLine(input);

		// Assertions
		expect(mockWrite).toHaveBeenCalledWith(expected);

		// Cleanup
		mockWrite.mockRestore();
	});
});

describe("startREPL", () => {
	let mockState: any;
	let mockPrompt: ReturnType<typeof vi.fn>;
	let mockOn: ReturnType<typeof vi.fn>;
	let mockCommands: any;

	// Setup
	beforeEach(() => {
		mockPrompt = vi.fn();
		mockOn = vi.fn();

		mockCommands = {
			help: { callback: vi.fn() }
		};

		mockState = {
			rl: {
				prompt: mockPrompt,
				on: (event: string, callback: (line: string) => void) => {
					mockOn(event, callback);
					if (event === "line") callback("");
				},
			},
			commands: mockCommands
		};
	});

	test("should execute a known command", () => {
		// Setup
		mockOn.mockImplementationOnce((event, callback) => {
			if (event === "line") { callback("help"); }
		});

		// Execution
		startREPL(mockState);

		// Assertions
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
		expect(mockOn).toHaveBeenCalledWith("line", expect.any(Function));
		expect(mockCommands.help.callback).not.toHaveBeenCalled();
		expect(mockPrompt).toHaveBeenCalledTimes(3);
	});
});