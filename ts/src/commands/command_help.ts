import { CLICommand } from "./command";

export function commandHelp(commands: Record<string, CLICommand>): void {
	process.stdout.write("Usage:\n\n");
	for (const commandName in commands) {
		const command = commands[commandName];
		process.stdout.write(`${command.name}: ${command.description}\n`);
	}
}