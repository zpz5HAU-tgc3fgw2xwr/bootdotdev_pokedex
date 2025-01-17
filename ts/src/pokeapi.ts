import { AxiosCacheInstance } from "axios-cache-interceptor";
import { Location, LocationArea } from "pokenode-ts"

export class PokeAPI {
	private static readonly baseURL = "https://pokeapi.co/api/v2";
	private static readonly limit = 20;

	private readonly axios: AxiosCacheInstance;

	private static readonly paginationConstructor = (index: number) => `?limit=${PokeAPI.limit}&offset=${PokeAPI.limit * index}`;

	constructor(axios: AxiosCacheInstance) { this.axios = axios; }

	private locationIndex = -1;
	private locationCache: Record<string, Location[]> = {};
	async getLocations(idname: number | string = "", back = false): Promise<Location[] | Location> {
		let promise = new Promise<Location[]>(() => {});
		
		if (typeof idname === "number" && idname < 0) { idname = 0; }
		if (back) {
			if (this.locationIndex > 0) { this.locationIndex--; }
		} else { this.locationIndex++; }

		if (!this.locationCache[`${idname}_${this.locationIndex}`]) {
			promise = this.axios.get(`${PokeAPI.baseURL}/location/${idname}${PokeAPI.paginationConstructor(this.locationIndex)}`).then((response) => {
				this.locationCache[this.locationIndex] = response.data.results;
				return response.data.results;
			});
		}

		return promise.finally(() => {
			if (!back) { this.locationIndex++; }
			return this.locationCache[this.locationIndex - 1];
		});
	}

	private locationAreasIndex = -1;
	private locationAreasCache: Record<string, LocationArea[]> = {};
	async getLocationAreas(idname: number | string = "", back = false): Promise<LocationArea[] | LocationArea> {
		let promise = new Promise<LocationArea[]>(() => {});

		if (typeof idname === "number" && idname < 0) { idname = 0; }
		if (back) {
			if (this.locationAreasIndex > 0) { this.locationAreasIndex--; }
		} else { this.locationAreasIndex++; }

		if (!this.locationAreasCache[`${idname}_${this.locationAreasIndex}`]) {
			promise = this.axios.get(`${PokeAPI.baseURL}/location-area/${idname}${PokeAPI.paginationConstructor(this.locationAreasIndex)}`).then((response) => {
				this.locationAreasCache[this.locationAreasIndex] = response.data.results;
				return response.data.results;
			});
		}

		return promise.finally(() => {
			return this.locationAreasCache[this.locationAreasIndex - 1];
		});
	}
}