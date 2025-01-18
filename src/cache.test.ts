import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { Cache } from "./cache";

describe("Cache", () => {
	let cache: Cache;
	let currentTime: number;
	const testKey = "testKey";
	const testValue = { data: "testValue" };
	const reapInterval = 100;

	// Mock time provider
	const mockGetTime = () => currentTime;

	// Setup
	beforeEach(() => {
		currentTime = 0;
		cache = new Cache(reapInterval, mockGetTime);
	});
	afterEach(() => {
		cache.stopReapLoop();
	});

	test("should add and retrieve an item", () => {
		cache.add(testKey, testValue);
		expect(cache.get(testKey)).toEqual(testValue);
	});

	test("should return undefined for non-existent keys", () => {
		expect(cache.get("nonExistentKey")).toBeUndefined();
	});

	test("should remove expired items after the reap interval", () => {
		// Setup
		cache.add(testKey, testValue);
		currentTime += reapInterval + 1;

		// Execution: Force reap
		cache.testReap();

		// Assertions
		expect(cache.get(testKey)).toBeUndefined();
	});

	test("should not remove items before the reap interval", () => {
		// Setup
		cache.add(testKey, testValue);
		currentTime += reapInterval - 1;

		// Execution: Force reap
		cache.testReap();

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
