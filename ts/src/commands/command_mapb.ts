import { State } from "../state.js";

export async function commandMapB(state: State): Promise<void> {
	return state.pokeapi.getLocationAreas("", true).then((locations) => {
		if (locations instanceof Array) {
			if (locations.length === 0) { state.wl("No locations found."); }
			else { locations.forEach((location) => state.wl(location.name)); }
		} else { state.wl(locations.name); }
	});
}