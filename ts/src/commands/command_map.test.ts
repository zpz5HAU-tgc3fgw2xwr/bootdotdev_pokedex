import { beforeEach, describe, expect, test, vi } from "vitest";
import { commandMap } from "./command_map";
import { State } from "../state";

describe("commandMap", () => {
	let mockWriteLine: ReturnType<typeof vi.fn>;
	let mockPokeAPI: { getLocationAreas: ReturnType<typeof vi.fn> };
	let mockState: State;

	// Setup
	beforeEach(() => {
		mockWriteLine = vi.fn();
		mockPokeAPI = {
			getLocationAreas: vi.fn(),
		};

		mockState = {
			commands: {},
			rl: vi.fn() as unknown as State["rl"],
			wl: mockWriteLine,
			pokeapi: mockPokeAPI as any,
			_cache: {} as any,
			_axios: {} as any,
		};
	});

	test("should write 'No locations found.' if location areas array is empty", async () => {
		// Setup
		mockPokeAPI.getLocationAreas.mockResolvedValue([]);

		// Execution
		await commandMap(mockState);

		// Assertions
		expect(mockPokeAPI.getLocationAreas).toHaveBeenCalledWith(false);
		expect(mockWriteLine).toHaveBeenCalledWith("No locations found.");
		expect(mockWriteLine).toHaveBeenCalledTimes(1);
	});

	test("should write each location area name if array is non-empty", async () => {
		// Setup
		const locationAreas = [{ name: "area1" }, { name: "area2" }];
		mockPokeAPI.getLocationAreas.mockResolvedValue(locationAreas);

		// Execution
		await commandMap(mockState);

		// Assertions
		expect(mockPokeAPI.getLocationAreas).toHaveBeenCalledWith(false);
		expect(mockWriteLine).toHaveBeenCalledWith("area1");
		expect(mockWriteLine).toHaveBeenCalledWith("area2");
		expect(mockWriteLine).toHaveBeenCalledTimes(2);
	});

	test("should write a single location area name if not an array", async () => {
		// Setup
		const locationArea = { name: "singleArea" };
		mockPokeAPI.getLocationAreas.mockResolvedValue([locationArea]);
	
		// Execution
		await commandMap(mockState);
	
		// Assertions
		expect(mockPokeAPI.getLocationAreas).toHaveBeenCalledWith(false);
		expect(mockWriteLine).toHaveBeenCalledWith("singleArea");
		expect(mockWriteLine).toHaveBeenCalledTimes(1);
	});
	

	test("should handle backward navigation when back is true", async () => {
		// Setup
		const locationAreas = [{ name: "area3" }, { name: "area4" }];
		mockPokeAPI.getLocationAreas.mockResolvedValue(locationAreas);

		// Execution
		await commandMap(mockState, true);

		// Assertions
		expect(mockPokeAPI.getLocationAreas).toHaveBeenCalledWith(true);
		expect(mockWriteLine).toHaveBeenCalledWith("area3");
		expect(mockWriteLine).toHaveBeenCalledWith("area4");
		expect(mockWriteLine).toHaveBeenCalledTimes(2);
	});
});
