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
		if (typeof idname === "number" && idname < 0) { idname = 0; }
		if (back && this.locationIndex > 0) { this.locationIndex--; }

		const cacheKey = `${idname}_${this.locationIndex}`;
		const cachedData = this.cache.get(cacheKey) as Location[] | Location;
		if (cachedData) {
			if (!back) { this.locationIndex++; }
			return cachedData;
		}

		return this.axios.get(`${PokeAPI.baseURL}/location/${idname}${PokeAPI.paginationConstructor(this.locationIndex)}`)
			.then(response => {
				if (!back) { this.locationIndex++; }
				return this.cache.add(cacheKey, response.data.results);
			}).catch(error => {
				console.error("Error fetching data from API:", error);
				return [];
			});
	}

	private locationAreasIndex = 0;
	async getLocationAreas(idname: number | string = "", back = false): Promise<LocationArea[] | LocationArea> {
		if (typeof idname === "number" && idname < 0) { idname = 0; }
		if (back && this.locationAreasIndex > 0) { this.locationAreasIndex--; }
	
		const cacheKey = `${idname}_${this.locationAreasIndex}`;
		const cachedData = this.cache.get(cacheKey) as LocationArea[] | LocationArea;
		if (cachedData) {
			if (!back) { this.locationAreasIndex++; }
			return cachedData;
		}
	
		return this.axios.get(`${PokeAPI.baseURL}/location-area/${idname}${PokeAPI.paginationConstructor(this.locationAreasIndex)}`)
			.then(response => {
				if (!back) { this.locationAreasIndex++; }
				return this.cache.add(cacheKey, response.data.results);
			}).catch(error => {
				console.error("Error fetching data from API:", error);
				return [];
			});
	}
}