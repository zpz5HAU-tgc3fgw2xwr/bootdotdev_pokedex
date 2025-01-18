import { State } from "../state.js";

export async function commandExplore(state: State, idname: string): Promise<void> {
	return state.pokeapi.getLocationArea(idname)
		.then((response) => {
			if (response.pokemon_encounters.length) {
				response.pokemon_encounters.forEach((pokemon) => state.wl(pokemon.pokemon.name));
			} else { state.wl("Nothing found."); }
		}).catch(error => state.wl(error.message));
}