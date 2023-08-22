export type FlashMessage = {
	type: "success" | "error";
	message: string;
};

class Flasher {
	#messages: Array<FlashMessage> = [];

	public get messages(): ReadonlyArray<FlashMessage> {
		const messages = this.#messages;
		this.#messages = [];
		return messages;
	}

	public success(message: string): void {
		this.flash(message, "success");
	}

	public error(message: string): void {
		this.flash(message, "error");
	}

	public flash(message: string, type: "success" | "error"): void {
		this.#messages.push({
			type,
			message,
		});
	}
}

export const flash = new Flasher();
