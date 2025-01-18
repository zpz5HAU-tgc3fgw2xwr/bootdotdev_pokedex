type CacheEntry<T> = {
	createdAt: number;
	value: T;
}

export class Cache {
	#cache = new Map<string, CacheEntry<any>>();
	#reapIntervalId: NodeJS.Timeout | undefined = undefined;
	#interval: number;

	constructor(interval = 1000) {
		this.#interval = interval;
		this.#startReapLoop();
	}

	add<T>(key: string, value: T): T {
		this.#cache.set(key, { createdAt: Date.now(), value });
		return value;
	}

	get<T>(key: string): T | undefined {
		const entry = this.#cache.get(key);
		if (entry) {
			return entry.value;
		}
	}

	stopReapLoop(): void {
		if (this.#reapIntervalId) { clearInterval(this.#reapIntervalId); }
	}

	#reap(): void {
		const now = Date.now();
		for (const [key, entry] of this.#cache.entries()) {
			if (now - entry.createdAt > this.#interval) {
				this.#cache.delete(key);
			}
		}
	}

	#startReapLoop(): void {
		this.#reapIntervalId = setInterval(() => this.#reap(), this.#interval);
	}
}