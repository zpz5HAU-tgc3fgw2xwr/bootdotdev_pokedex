import { AxiosCacheInstance } from "axios-cache-interceptor";
import { Location, LocationArea, Pokemon } from "pokenode-ts";
import { Cache } from "./cache";

export class PokeAPI {
	private static readonly baseURL = "https://pokeapi.co/api/v2";
	private static readonly limit = 20;

	private readonly axios: AxiosCacheInstance;
	private readonly cache: Cache;

	private static readonly paginationConstructor = (index = 0) => `?limit=${PokeAPI.limit}&offset=${PokeAPI.limit * index}`;

	constructor(axios: AxiosCacheInstance, cache: Cache) {
		this.axios = axios;
		this.cache = cache;
	}

	private locationIndex = -1;
	async getLocations(back = false): Promise<Location[]> {
		const trueIndex = Math.max(0, this.locationIndex + (back ? -1 : 1));
		const cacheKey = `locations_${trueIndex}`;
		const cachedData = this.cache.get(cacheKey) as Location[];
		if (cachedData) {
			this.locationIndex = trueIndex;
			return cachedData;
		}

		return this.axios.get(`${PokeAPI.baseURL}/location${PokeAPI.paginationConstructor(trueIndex)}`)
			.then(response => {
				this.locationAreasIndex = trueIndex;
				return this.cache.add(cacheKey, response.data.results);
			}).catch(error => Promise.reject(error));
	}

	private locationAreasIndex = -1;
	async getLocationAreas(back = false): Promise<LocationArea[]> {
		const trueIndex = Math.max(0, this.locationAreasIndex + (back ? -1 : 1));
		const cacheKey = `locationAreas_${trueIndex}`;
		const cachedData = this.cache.get(cacheKey) as LocationArea[];
		if (cachedData) {
			this.locationAreasIndex = trueIndex;
			return cachedData;
		}

		return this.axios.get(`${PokeAPI.baseURL}/location-area${PokeAPI.paginationConstructor(trueIndex)}`)
			.then(response => {
				this.locationAreasIndex = trueIndex;
				return this.cache.add(cacheKey, response.data.results);
			}).catch(error => Promise.reject(error));
	}

	async getLocationArea(idname: number | string = ""): Promise<LocationArea> {
		if (typeof idname === "number" && idname < 0) { idname = 0; }

		const id = idname.toString().replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
		const cacheKey = `locationArea_${id}`;
		const cachedData = this.cache.get(cacheKey) as LocationArea;
		if (cachedData) { return cachedData; }

		return this.axios.get(`${PokeAPI.baseURL}/location-area/${id}${PokeAPI.paginationConstructor()}`)
			.then(response => this.cache.add(cacheKey, response.data))
			.catch(error => Promise.reject(error));
	}

	async getPokemon(idname: string | number): Promise<Pokemon> {
		const id = idname.toString().replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
		const cacheKey = `pokemon_${id}`;
		const cachedData = this.cache.get(cacheKey) as Pokemon;
		if (cachedData) { return cachedData; }

		return this.axios.get(`${PokeAPI.baseURL}/pokemon/${id}${PokeAPI.paginationConstructor()}`)
			.then(response => this.cache.add(cacheKey, response.data))
			.catch(error => Promise.reject(error));
	}
}