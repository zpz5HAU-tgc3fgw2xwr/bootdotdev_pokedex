import { State } from "../state.js";

export async function commandPokedex(state: State): Promise<void> {
	if (Object.keys(state.pokedex).length) {
		state.wl("Your Pokédex:");
		for (const pokemonName in state.pokedex) { state.wl(` - ${pokemonName}`); }
	} else { state.wl("Your Pokédex is empty."); }
}