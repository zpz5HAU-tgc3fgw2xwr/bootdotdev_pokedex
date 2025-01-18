import { State } from "../state.js";

export async function commandInspect(state: State, pokemonName: string): Promise<void> {
	const pokemon = state.pokedex[pokemonName];

	if (pokemon) {
		state.wl(`Name: ${pokemon.name}`);
		state.wl(`Height: ${pokemon.height}`);
		state.wl(`Weight: ${pokemon.weight}`);
		state.wl(`Stats:`);
		pokemon.stats.forEach((stat) => state.wl(` - ${stat.stat.name}: ${stat.base_stat}`));
		state.wl("Types:");
		pokemon.types.forEach((type) => state.wl(` - ${type.type.name}`));
	} else { state.wl(`you have not caught that pokemon`); }
}