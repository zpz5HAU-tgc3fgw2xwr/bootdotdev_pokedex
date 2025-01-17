import { State } from "../state.js";

export async function commandMap(state: State, back = false): Promise<void> {
	return state.pokeapi.getLocationAreas("", back).then((locations) => {
		if (locations instanceof Array) {
			if (locations.length) {
				locations.forEach((location) => state.wl(location.name));
			} else { state.wl("No locations found."); }
		} else { state.wl(locations.name); }
	});
}