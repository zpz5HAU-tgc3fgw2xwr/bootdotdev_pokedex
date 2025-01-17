import { State } from "../state.js";

export async function commandHelp(state: State): Promise<void> {
	state.wl("\nUsage:\n");
	for (const commandName in state.commands) {
		const command = state.commands[commandName];
		state.wl(`${command.name}: ${command.description}`);
	}
	state.wl();
}