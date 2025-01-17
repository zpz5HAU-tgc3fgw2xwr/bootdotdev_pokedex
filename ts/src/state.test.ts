import { describe, expect, test, vi } from "vitest";
import { setupCache } from "axios-cache-interceptor";
import { createInterface, type Interface } from "readline";
import { initState, type CLICommand, type State } from "./state";
import { commandHelp } from "./commands/command_help";
import { commandExit } from "./commands/command_exit";

describe("wl", () => {
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
		const state = initState();

		// Execution
		state.wl(input);

		// Assertions
		expect(mockWrite).toHaveBeenCalledWith(expected);

		// Cleanup
		mockWrite.mockRestore();
	});
});

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

	test("should create a cached axios instance", () => {
		// Setup
		vi.mock("axios-cache-interceptor", () => ({
			setupCache: vi.fn((axiosInstance) => axiosInstance),
		}));
		const mockAxios = vi.mocked(setupCache);
	
		// Execution
		const state = initState();
	
		// Assertions
		expect(mockAxios).toHaveBeenCalled();
		expect(state._axios).toBeDefined();
		expect(state._axios.get).toBeInstanceOf(Function);
		expect(state._axios.post).toBeInstanceOf(Function);
	
		// Validate that setupCache was called with an Axios instance
		const axiosInstance = mockAxios.mock.calls[0][0];
		expect(axiosInstance).toHaveProperty("get");
		expect(axiosInstance).toHaveProperty("post");
	});
	

	test("should return a valid state object", () => {
		// Setup
		vi.mock("readline", () => ({
			createInterface: vi.fn(() => ({
				prompt: vi.fn(),
				on: vi.fn(),
				close: vi.fn()
			}))
		}));

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
		expect(state.wl).toBeInstanceOf(Function);
	});
});
