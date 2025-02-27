import Axios from "axios";
import { AxiosCacheInstance, setupCache } from "axios-cache-interceptor";
import { createInterface, type Interface } from "readline";
import { Pokemon } from "pokenode-ts";

import { Cache } from "./cache.js";
import { PokeAPI } from "./pokeapi.js";

// Import commands
import { commandHelp } from "./commands/command_help.js";
import { commandMap } from "./commands/command_map.js";
import { commandExplore } from "./commands/command_explore.js";
import { commandCatch } from "./commands/command_catch.js";
import { commandInspect } from "./commands/command_inspect.js";
import { commandPokedex } from "./commands/command_pokedex.js";
import { commandExit } from "./commands/command_exit.js";

export type CLICommand = {
	name: string;
	description: string;
	callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
	commands: Record<string, CLICommand>;
	pokedex: Record<string, Pokemon>;
	pokeapi: PokeAPI;
	rl: Interface;
	wl: (line?: string) => void;
	_cache: Cache;
	_axios: AxiosCacheInstance;
}

export function initState(stdin: NodeJS.ReadableStream = process.stdin, stout: NodeJS.WritableStream = process.stdout): State {
	const axios = setupCache(Axios.create());
	const cache = new Cache();
	return {
		pokedex: {},
		commands: {
			help: {
				name: "help",
				description: "Displays a help message",
				callback: commandHelp
			},
			map: {
				name: "map",
				description: "Displays the next page of location areas",
				callback: (state) => commandMap(state)
			},
			mapb: {
				name: "mapb",
				description: "Displays the previous page of location areas",
				callback: (state) => commandMap(state, true)
			},
			explore: {
				name: "explore",
				description: "Explore a location area",
				callback: commandExplore
			},
			catch: {
				name: "catch",
				description: "Catch a Pokémon",
				callback: commandCatch
			},
			inspect: {
				name: "inspect",
				description: "Inspect a Pokémon",
				callback: commandInspect
			},
			pokedex: {
				name: "pokedex",
				description: "Display the Pokédex",
				callback: commandPokedex
			},
			exit: {
				name: "exit",
				description: "Exit the Pokédex",
				callback: commandExit
			}
		},
		rl: createInterface({
			input: stdin,
			output: stout,
			prompt: "Pokédex > "
		}),
		wl: (line = "") => process.stdout.write(`${line}\n`),
		pokeapi: new PokeAPI(axios, cache),
		_cache: cache,
		_axios: axios
	};
}