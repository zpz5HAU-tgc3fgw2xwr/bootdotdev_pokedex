import { State } from "../state.js";
import { Pokemon } from "pokenode-ts";

export async function commandCatch(state: State, pokemonName: string): Promise<void> {
	return state.pokeapi.getPokemon(pokemonName.toLowerCase())
		.then((response: Pokemon) => {
			state.wl(`Throwing a Pokéball at ${response.name}...`);
			Math.random() > 0.5
				? state.wl(`${response.name} was caught!`)
				: state.wl(`${response.name} escaped!`);
		})
		.catch((error: Error) => state.wl(`Failed to catch Pokémon: ${error.message}`));
}