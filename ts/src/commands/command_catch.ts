import { State } from "../state.js";
import { Pokemon } from "pokenode-ts";

export async function commandCatch(state: State, pokemonName: string): Promise<void> {
	return state.pokeapi.getPokemon(pokemonName.toLowerCase())
		.then((pokemon: Pokemon) => {
			state.wl(`Throwing a Pokéball at ${pokemon.name}...`);
			if (Math.random() > 0.5) {
				state.pokedex[pokemon.name] = pokemon;
				state.wl(`${pokemon.name} was caught!`);
			} else {
				state.wl(`${pokemon.name} escaped!`);
			}
		}).catch((error: Error) => state.wl(`Failed to catch Pokémon: ${error.message}`));
}