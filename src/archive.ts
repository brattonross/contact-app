export type ArchiveStatus = "Waiting" | "Running" | "Complete";

const WORKER_URL = new URL("./archive-worker.ts", import.meta.url).href;

export class Archiver {
	#status: ArchiveStatus = "Waiting";
	#progress = 0;
	#worker: Worker | undefined;

	public get status(): ArchiveStatus {
		return this.#status;
	}

	public get progress(): number {
		return this.#progress;
	}

	public get downloadUrl(): string {
		return "data/contacts.json";
	}

	public start(): void {
		if (this.#status !== "Waiting") {
			console.warn("Cannot start archiver: already started");
			return;
		}

		this.#status = "Running";
		this.#progress = 0;

		const worker = new Worker(WORKER_URL);
		worker.addEventListener("message", this.#handleMessage);
		worker.addEventListener("open", () => {
			worker.postMessage({ type: "start" });
		})
		this.#worker = worker;
	}

	public reset(): void {
		this.#status = "Waiting";
	}

	#handleMessage = (event: MessageEvent): void => {
		if (event.data.type === "started") {
			this.#status = "Running";
			this.#progress = 0;
		} else if (event.data.type === "progress") {
			this.#progress = event.data.progress;
		} else if (event.data.type === "complete") {
			this.#status = "Complete";
			this.#worker?.terminate();
			this.#worker = undefined;
		}	
	}
}

export const archiver = new Archiver();
