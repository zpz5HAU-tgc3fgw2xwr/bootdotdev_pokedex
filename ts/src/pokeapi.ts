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

	private locationIndex = -1;
	async getLocations(idname: number | string = "", back = false): Promise<Location[] | Location> {
		const trueIndex = Math.max(0, this.locationIndex + (back ? -1 : 1));
		if (typeof idname === "number" && idname < 0) { idname = 0; }

		const cacheKey = `${idname}_${trueIndex}`;
		const cachedData = this.cache.get(cacheKey) as Location[] | Location;
		if (cachedData) {
			this.locationIndex = trueIndex;
			return cachedData;
		}

		return this.axios.get(`${PokeAPI.baseURL}/location/${idname}${PokeAPI.paginationConstructor(trueIndex)}`)
			.then(response => {
				this.locationAreasIndex = trueIndex;
				return this.cache.add(cacheKey, response.data.results);
			}).catch(error => Promise.reject(error));
	}

	private locationAreasIndex = -1;
	async getLocationAreas(idname: number | string = "", back = false): Promise<LocationArea[] | LocationArea> {
		const trueIndex = Math.max(0, this.locationAreasIndex + (back ? -1 : 1));
		if (typeof idname === "number" && idname < 0) { idname = 0; }
	
		const cacheKey = `${idname}_${trueIndex}`;
		const cachedData = this.cache.get(cacheKey) as LocationArea[] | LocationArea;
		if (cachedData) {
			this.locationAreasIndex = trueIndex;
			return cachedData;
		}
	
		return this.axios.get(`${PokeAPI.baseURL}/location-area/${idname}${PokeAPI.paginationConstructor(trueIndex)}`)
			.then(response => {
				this.locationAreasIndex = trueIndex;
				return this.cache.add(cacheKey, response.data.results);
			}).catch(error => Promise.reject(error));
	}
}