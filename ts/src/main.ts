import { initState } from "./state.js";
import { startREPL } from "./repl.js";

function main() {
	startREPL(initState());
}
  
main();