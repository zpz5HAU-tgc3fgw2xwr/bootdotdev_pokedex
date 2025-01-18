import Axios from "axios";
import { AxiosCacheInstance, setupCache } from "axios-cache-interceptor";
import { createInterface, type Interface } from "readline";
import { Cache } from "./cache.js";
import { PokeAPI } from "./pokeapi.js";
import { commandHelp } from "./commands/command_help.js";
import { commandMap } from "./commands/command_map.js";
import { commandExit } from "./commands/command_exit.js";

export type CLICommand = {
	name: string;
	description: string;
	callback: (state: State) => Promise<void>;
};

export type State = {
	commands: Record<string, CLICommand>;
	rl: Interface;
	wl: (line?: string) => void;
	pokeapi: PokeAPI;
	_cache: Cache;
	_axios: AxiosCacheInstance;
}

export function initState(stdin: NodeJS.ReadableStream = process.stdin, stout: NodeJS.WritableStream = process.stdout): State {
	const axios = setupCache(Axios.create());
	const cache = new Cache();
	return {
		commands: {
			help: {
				name: "help",
				description: "Displays a help message",
				callback: commandHelp
			},
			map: {
				name: "map",
				description: "Displays the next page of location areas",
				callback: commandMap
			},
			mapb: {
				name: "mapb",
				description: "Displays the previous page of location areas",
				callback: (state) => commandMap(state, true)
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
		wl: (line = "") => { process.stdout.write(`${line}\n`); },
		pokeapi: new PokeAPI(axios, cache),
		_cache: cache,
		_axios: axios
	};
}