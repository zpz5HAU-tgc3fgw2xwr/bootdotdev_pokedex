import { AxiosCacheInstance } from "axios-cache-interceptor";
import { Location, LocationArea } from "pokenode-ts";
import { Cache } from "./cache";

export class PokeAPI {
	private static readonly baseURL = "https://pokeapi.co/api/v2";
	private static readonly limit = 20;

	private readonly axios: AxiosCacheInstance;
	private readonly cache: Cache;

	private static readonly paginationConstructor = (index: number) => `?limit=${PokeAPI.limit}&offset=${PokeAPI.limit * index}`;

	constructor(axios: AxiosCacheInstance, cache: Cache) {
		this.axios = axios;
		this.cache = cache;
	}

	private locationIndex = 0;
	async getLocations(idname: number | string = "", back = false): Promise<Location[] | Location> {
		let promise = new Promise<Location[]>(() => {});
		
		if (typeof idname === "number" && idname < 0) { idname = 0; }
		if (back && this.locationIndex > 0) { this.locationIndex--; }

		const cacheKey = `${idname}_${this.locationIndex}`;
		if (!this.cache.get(cacheKey)) {
			promise = this.axios
				.get(`${PokeAPI.baseURL}/location/${idname}${PokeAPI.paginationConstructor(this.locationIndex)}`)
				.then((response) => this.cache.add(cacheKey, response.data.results))
				.catch((err) => console.error("Error fetching data from API:", err));;
		}

		return promise.finally(() => {
			if (!back) { this.locationIndex++; }
			return this.cache.get(cacheKey);
		});
	}

	private locationAreasIndex = 0;
	async getLocationAreas(idname: number | string = "", back = false): Promise<LocationArea[] | LocationArea> {
		let promise = new Promise<LocationArea[]>(() => {});
	
		if (typeof idname === "number" && idname < 0) { idname = 0; }
		if (back && this.locationIndex > 0) { this.locationIndex--; }

		const cacheKey = `${idname}_${this.locationAreasIndex}`;	
		if (!this.cache.get(cacheKey)) {
			promise = this.axios
				.get(`${PokeAPI.baseURL}/location-area/${idname}${PokeAPI.paginationConstructor(this.locationAreasIndex)}`)
				.then((response) => this.cache.add(cacheKey, response.data.results))
				.catch((err) => console.error("Error fetching data from API:", err));
		}
	
		return promise.finally(() => {
			if (!back) { this.locationAreasIndex++; }
			return this.cache.get(cacheKey);
		});
	}
	
}