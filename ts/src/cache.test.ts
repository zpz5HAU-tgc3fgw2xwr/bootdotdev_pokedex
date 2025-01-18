import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { Cache } from "./cache";

describe("Cache", () => {
	let cache: Cache;
	const testKey = "testKey";
	const testValue = { data: "testValue" };
	const reapInterval = 100;

	// Setup
	beforeEach(() => { cache = new Cache(reapInterval); });
	afterEach(() => { cache.stopReapLoop(); });

	test("should add and retrieve an item", () => {
		// Execution
		cache.add(testKey, testValue);
		const result = cache.get(testKey);

		// Assertions
		expect(result).toEqual(testValue);
	});

	test("should return undefined for non-existent keys", () => {
		// Assertions
		expect(cache.get("nonExistentKey")).toBeUndefined();
	});

	test("should remove expired items after the reap interval", async () => {
		// Setup
		cache.add(testKey, testValue);
	
		// Execution
		await new Promise((resolve) => setTimeout(resolve, reapInterval + 100));
	
		// Assertions
		expect(cache.get(testKey)).toBeUndefined();
	});

	test("should not remove items before the reap interval", async () => {
		// Setup
		cache.add(testKey, testValue);

		// Execution
		await new Promise((resolve) => setTimeout(resolve, reapInterval - 50));

		// Assertions
		expect(cache.get(testKey)).toEqual(testValue);
	});

	test("should stop the reaping loop when stopReapLoop is called", () => {
		// Setup
		const clearIntervalSpy = vi.spyOn(global, "clearInterval");

		// Execution
		cache.stopReapLoop();

		// Assertions
		expect(clearIntervalSpy).toHaveBeenCalled();
	});

	test("should not throw an error if stopReapLoop is called multiple times", () => {
		// Execution
		cache.stopReapLoop();
		expect(() => cache.stopReapLoop()).not.toThrow();
	});
});
