type CacheEntry<T> = {
	createdAt: number;
	value: T;
};

export class Cache {
	#cache = new Map<string, CacheEntry<any>>();
	#reapIntervalId: NodeJS.Timeout | undefined = undefined;
	#interval: number;
	#getCurrentTime: () => number;

	constructor(interval = 360000, getCurrentTime = () => Date.now()) {
		this.#interval = interval;
		this.#getCurrentTime = getCurrentTime;
		this.#startReapLoop();
	}

	add<T>(key: string, value: T): T {
		this.#cache.set(key, { createdAt: this.#getCurrentTime(), value });
		return value;
	}

	get<T>(key: string): T | undefined {
		const entry = this.#cache.get(key);
		if (entry) {
			return entry.value;
		}
	}

	stopReapLoop(): void {
		if (this.#reapIntervalId) {
			clearInterval(this.#reapIntervalId);
		}
	}

	// Private reap logic
	#reap(): void {
		const now = this.#getCurrentTime();
		for (const [key, entry] of this.#cache.entries()) {
			if (now - entry.createdAt > this.#interval) {
				this.#cache.delete(key);
			}
		}
	}

	#startReapLoop(): void {
		this.#reapIntervalId = setInterval(() => this.#reap(), this.#interval);
	}

	// Test Hook: Force reap logic execution
	testReap(): void {
		this.#reap();
	}
}
