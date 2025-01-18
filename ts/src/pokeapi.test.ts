import { describe, test, expect, beforeEach, vi } from "vitest";
import { PokeAPI } from "./pokeapi";
import { Cache } from "./cache";
import { AxiosCacheInstance } from "axios-cache-interceptor";

describe("PokeAPI", () => {
	let mockAxios: {
		get: ReturnType<typeof vi.fn>;
	};
	let mockCache: {
		get: ReturnType<typeof vi.fn>;
		add: ReturnType<typeof vi.fn>;
	};
	let pokeAPI: PokeAPI;

	// Setup
	beforeEach(() => {
		mockAxios = { get: vi.fn() };
		mockCache = { get: vi.fn(), add: vi.fn().mockImplementation((_, data) => data) };

		pokeAPI = new PokeAPI(
			mockAxios as unknown as AxiosCacheInstance,
			mockCache as unknown as Cache
		);
	});

	describe("getLocations", () => {
		test("should check the cache and call the API if not cached", async () => {
			// Setup
			const mockResponse = { data: { results: [{ name: "location1" }] } };
			const cacheKey = "1_0";

			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockResolvedValueOnce(mockResponse);

			// Execution
			const result = await pokeAPI.getLocations(1);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/location/1?limit=20&offset=0");
			expect(mockCache.add).toHaveBeenCalledWith(cacheKey, mockResponse.data.results);
			expect(result).toEqual(mockResponse.data.results);
		});

		test("should return cached data without calling the API", async () => {
			// Setup
			const cachedData = [{ name: "cachedLocation" }];
			const cacheKey = "1_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocations(1);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});

		test("should handle no value passed in and call the API with default index", async () => {
			// Setup
			const mockResponse = { data: { results: [{ name: "locationDefault" }] } };
			const cacheKey = "_0";

			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockResolvedValueOnce(mockResponse);

			// Execution
			const result = await pokeAPI.getLocations();

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/location/?limit=20&offset=0");
			expect(mockCache.add).toHaveBeenCalledWith(cacheKey, mockResponse.data.results);
			expect(result).toEqual(mockResponse.data.results);
		});

		test("should handle API errors gracefully", async () => {
			// Setup
			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockRejectedValueOnce(new Error("API is down"));

			// Execution
			let error: Error | undefined;
			try { await pokeAPI.getLocations(1); }
			catch (e) { if (e instanceof Error) { error = e; } }

			// Assertions
			expect(mockCache.get).toHaveBeenCalled();
			expect(mockAxios.get).toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(error).toBeInstanceOf(Error);
			expect(error?.message).toBe("API is down");
		});

		test("should handle back variable to pull from previous cached page", async () => {
			// Setup
			const cachedData = [{ name: "prevPageLocation" }];
			const cacheKey = "1_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocations(1, true);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});

		test("should not decrement index below zero when using back", async () => {
			// Setup
			const cachedData = [{ name: "firstPageLocation" }];
			const cacheKey = "1_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocations(1, true);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});
	});

	describe("getLocationAreas", () => {
		test("should check the cache and call the API if not cached", async () => {
			// Setup
			const mockResponse = { data: { results: [{ name: "area1" }] } };
			const cacheKey = "1_0";

			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockResolvedValueOnce(mockResponse);

			// Execution
			const result = await pokeAPI.getLocationAreas(1);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/location-area/1?limit=20&offset=0");
			expect(mockCache.add).toHaveBeenCalledWith(cacheKey, mockResponse.data.results);
			expect(result).toEqual(mockResponse.data.results);
		});

		test("should return cached data without calling the API", async () => {
			// Setup
			const cachedData = [{ name: "cachedArea" }];
			const cacheKey = "1_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocationAreas(1);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});

		test("should handle no value passed in and call the API with default index", async () => {
			// Setup
			const mockResponse = { data: { results: [{ name: "areaDefault" }] } };
			const cacheKey = "_0";

			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockResolvedValueOnce(mockResponse);

			// Execution
			const result = await pokeAPI.getLocationAreas();

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/location-area/?limit=20&offset=0");
			expect(mockCache.add).toHaveBeenCalledWith(cacheKey, mockResponse.data.results);
			expect(result).toEqual(mockResponse.data.results);
		});

		test("should handle API errors gracefully", async () => {
			// Setup
			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockRejectedValueOnce(new Error("API is down"));

			// Execution
			let error: Error | undefined;
			try { await pokeAPI.getLocations(1); }
			catch (e) { if (e instanceof Error) { error = e; } }

			// Assertions
			expect(mockCache.get).toHaveBeenCalled();
			expect(mockAxios.get).toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(error).toBeInstanceOf(Error);
			expect(error?.message).toBe("API is down");
		});

		test("should handle back variable to pull from previous cached page", async () => {
			// Setup
			const cachedData = [{ name: "prevPageArea" }];
			const cacheKey = "1_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocationAreas(1, true);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});

		test("should not decrement index below zero when using back", async () => {
			// Setup
			const cachedData = [{ name: "firstPageArea" }];
			const cacheKey = "1_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocationAreas(1, true);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});
	});
});