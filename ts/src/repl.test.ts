import { cleanInput, startREPL } from "./repl";
import { describe, expect, test, vi } from "vitest";
import { Readable, Writable } from "stream";

describe.each([
	{
		input: "  hello  world  ",
		expected: ["hello", "world"]
	},
	{
		input: "singleword",
		expected: ["singleword"]
	},
	{
		input: "  multiple   spaces  ",
		expected: ["multiple", "spaces"]
	},
	{
		input: "",
		expected: [""]
	}
])("cleanInput($input)", ({ input, expected }) => {
	test(`Expected: ${expected}`, () => {
		const actual = cleanInput(input);

		expect(actual).toHaveLength(expected.length);
		for (const i in expected) {
			expect(actual[i]).toBe(expected[i]);
		}
	});
});

describe("startREPL", () => {
	test("should output the correct command", async () => {
		const input = "testcommand\n";
		const expectedOutput = "Your command was: testcommand\n";

		const mockStdout = new Writable({
			write(chunk, encoding, callback) {
				this.emit("data", chunk.toString());
				callback();
			}
		});

		const mockStdin = new Readable({
			read() {
				this.push(input);
				this.push(null);
			}
		});

		const rl = startREPL(mockStdin, mockStdout);

		await new Promise<void>((resolve, reject) => {
			const timeout = setTimeout(() => {
				rl.close();
				reject(new Error("Test timed out waiting for expected output."));
			}, 2000);

			const capturedOutput: string[] = [];
			mockStdout.on("data", (data) => {
				capturedOutput.push(data);

				if (capturedOutput.some((output) => output.includes(expectedOutput))) {
					clearTimeout(timeout);
					rl.close();
					try {
						expect(capturedOutput.find((output) => output.includes(expectedOutput)))
							.toContain(expectedOutput);
						resolve();
					} catch (err) {
						reject(err);
					}
				}
			});

			rl.on("close", () => {
				clearTimeout(timeout);
				if (!capturedOutput.some((output) => output.includes(expectedOutput))) {
					reject(new Error("REPL closed before expected output was validated."));
				}
			});
		});
	});
});