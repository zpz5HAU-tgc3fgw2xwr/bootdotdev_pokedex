import { describe, expect, test, vi } from "vitest";
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
	const createMockState = (lineInput: string) => {
		const mockPrompt = vi.fn();
		const mockOn = vi.fn((event, callback) => {
			if (event === "line") callback(lineInput);
		});

		const mockCommands = {
			help: { callback: vi.fn() },
		};

		const mockState = {
			rl: { prompt: mockPrompt, on: mockOn },
			commands: mockCommands,
		};

		return { mockState, mockPrompt, mockOn, mockCommands };
	};

	test("should execute a known command", () => {
		// Setup
		const { mockState, mockPrompt, mockOn, mockCommands } = createMockState("help");

		// Execution
		startREPL(mockState as any);

		// Assertions
		expect(mockOn).toHaveBeenCalledWith("line", expect.any(Function));
		expect(mockCommands.help.callback).toHaveBeenCalledWith(mockState);
		expect(mockPrompt).toHaveBeenCalledTimes(2);
	});

	test("should handle unknown commands gracefully", () => {
		// Setup
		const { mockState, mockPrompt, mockOn, mockCommands } = createMockState("unknownCommand");

		// Execution
		startREPL(mockState as any);

		// Assertions
		expect(mockOn).toHaveBeenCalledWith("line", expect.any(Function));
		expect(mockCommands.help.callback).not.toHaveBeenCalled();
		expect(mockPrompt).toHaveBeenCalledTimes(2);
	});
});
