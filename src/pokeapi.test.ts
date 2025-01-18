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
			const mockResponse = { data: { results: [{ name: "location" }] } };
			const cacheKey = "locations_0";

			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockResolvedValueOnce(mockResponse);

			// Execution
			const result = await pokeAPI.getLocations();

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/location?limit=20&offset=0");
			expect(mockCache.add).toHaveBeenCalledWith(cacheKey, mockResponse.data.results);
			expect(result).toEqual(mockResponse.data.results);
		});

		test("should return cached data without calling the API", async () => {
			// Setup
			const cachedData = [{ name: "cachedLocation" }];
			const cacheKey = "locations_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocations();

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});

		test("should handle no value passed in and call the API with default index", async () => {
			// Setup
			const mockResponse = { data: { results: [{ name: "locationDefault" }] } };
			const cacheKey = "locations_0";

			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockResolvedValueOnce(mockResponse);

			// Execution
			const result = await pokeAPI.getLocations();

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/location?limit=20&offset=0");
			expect(mockCache.add).toHaveBeenCalledWith(cacheKey, mockResponse.data.results);
			expect(result).toEqual(mockResponse.data.results);
		});

		test("should handle API errors gracefully", async () => {
			// Setup
			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockRejectedValueOnce(new Error("API is down"));

			// Execution
			let error: Error | undefined;
			try { await pokeAPI.getLocations(); }
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
			const cacheKey = "locations_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocations(true);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});

		test("should not decrement index below zero when using back", async () => {
			// Setup
			const cachedData = [{ name: "firstPageLocation" }];
			const cacheKey = "locations_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocations(true);

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
			const cacheKey = "locationAreas_0";

			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockResolvedValueOnce(mockResponse);

			// Execution
			const result = await pokeAPI.getLocationAreas();

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/location-area?limit=20&offset=0");
			expect(mockCache.add).toHaveBeenCalledWith(cacheKey, mockResponse.data.results);
			expect(result).toEqual(mockResponse.data.results);
		});

		test("should return cached data without calling the API", async () => {
			// Setup
			const cachedData = [{ name: "cachedArea" }];
			const cacheKey = "locationAreas_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocationAreas();

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});

		test("should handle no value passed in and call the API with default index", async () => {
			// Setup
			const mockResponse = { data: { results: [{ name: "areaDefault" }] } };
			const cacheKey = "locationAreas_0";

			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockResolvedValueOnce(mockResponse);

			// Execution
			const result = await pokeAPI.getLocationAreas();

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/location-area?limit=20&offset=0");
			expect(mockCache.add).toHaveBeenCalledWith(cacheKey, mockResponse.data.results);
			expect(result).toEqual(mockResponse.data.results);
		});

		test("should handle API errors gracefully", async () => {
			// Setup
			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockRejectedValueOnce(new Error("API is down"));

			// Execution
			let error: Error | undefined;
			try { await pokeAPI.getLocations(); }
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
			const cacheKey = "locationAreas_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocationAreas(true);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});

		test("should not decrement index below zero when using back", async () => {
			// Setup
			const cachedData = [{ name: "firstPageArea" }];
			const cacheKey = "locationAreas_0";

			mockCache.get.mockReturnValueOnce(cachedData);

			// Execution
			const result = await pokeAPI.getLocationAreas(true);

			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});
	});

	describe("getPokemon", () => {
		test("should return cached Pokémon data if available", async () => {
			// Setup
			const cachedData = { name: "pikachu" };
			const cacheKey = "pokemon_pikachu";
	
			mockCache.get.mockReturnValueOnce(cachedData);
	
			// Execution
			const result = await pokeAPI.getPokemon("pikachu");
	
			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).not.toHaveBeenCalled();
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(result).toEqual(cachedData);
		});
	
		test("should fetch Pokémon data from API if not cached", async () => {
			// Setup
			const apiResponse = { name: "bulbasaur" };
			const cacheKey = "pokemon_bulbasaur";
	
			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockResolvedValueOnce({ data: apiResponse });
	
			// Execution
			const result = await pokeAPI.getPokemon("bulbasaur");
	
			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith(
				"https://pokeapi.co/api/v2/pokemon/bulbasaur?limit=20&offset=0"
			);
			expect(mockCache.add).toHaveBeenCalledWith(cacheKey, apiResponse);
			expect(result).toEqual(apiResponse);
		});
	
		test("should handle API errors gracefully", async () => {
			// Setup
			const cacheKey = "pokemon_invalidpokemon";
			mockCache.get.mockReturnValueOnce(null);
			mockAxios.get.mockRejectedValueOnce(new Error("API Error"));
	
			// Execution
			let error: Error | undefined;
			try {
				await pokeAPI.getPokemon("invalidPokemon");
			} catch (e) {
				if (e instanceof Error) {
					error = e;
				}
			}
	
			// Assertions
			expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
			expect(mockAxios.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/invalidpokemon?limit=20&offset=0");
			expect(mockCache.add).not.toHaveBeenCalled();
			expect(error).toBeInstanceOf(Error);
			expect(error?.message).toBe("API Error");
		});
	});
	
});