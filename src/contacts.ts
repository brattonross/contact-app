import { faker } from "@faker-js/faker";
import { z } from "zod";

export const contactSchema = z.object({
	id: z.number(),
	firstName: z.string().min(1, "Required"),
	lastName: z.string().min(1, "Required"),
	email: z.string().email(),
	phone: z.string().min(10, "Required"),
});

export type Contact = z.infer<typeof contactSchema>;

function createFakeContact(): Omit<Contact, "id"> {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const email = faker.internet.email({
		firstName,
		lastName,
	});
	const phone = faker.phone.number();
	return { firstName, lastName, email, phone };
}

export type PaginatedContactsResult = {
	contacts: ReadonlyArray<Contact>;
	hasMore: boolean;
}

export type ContactSearchRequest = {
	query: string;
	page: number;
}

class ContactsDb {
	#contacts: Array<Contact> = [];

	public constructor() {
		for (let i = 0; i < 100; i++) {
			this.#contacts.push({
				id: i + 1,
				...createFakeContact(),
			});
		}
	}

	public async all(page: number): Promise<PaginatedContactsResult> {
		const contacts = this.#contacts.slice((page - 1) * 10, page * 10);
		return {
			contacts,
			hasMore: page * 10 < this.#contacts.length,
		};
	}

	public async search(request: ContactSearchRequest): Promise<PaginatedContactsResult> {
		const query = request.query.toLowerCase();
		const allResults = this.#contacts.filter((contact) => {
			return (
				contact.firstName.toLowerCase().includes(query) ||
				contact.lastName.toLowerCase().includes(query) ||
				contact.email.toLowerCase().includes(query) ||
				contact.phone.toLowerCase().includes(query)
			);
		})
		const contacts = allResults.slice((request.page - 1) * 10, request.page * 10);
		return {
			contacts,
			hasMore: request.page * 10 < allResults.length,
		};
	}

	public async getById(id: number): Promise<Contact | undefined> {
		return this.#contacts.find((contact) => contact.id === id);
	}

	public async create(props: Omit<Contact, "id">): Promise<Contact> {
		if (await this.emailExists(props.email)) {
			throw new Error(`Email ${props.email} already in use.`);
		}

		const id = this.#contacts.length + 1;
		const contact = { id, ...props };
		this.#contacts.push(contact);
		return contact;
	}

	public async update(id: number, props: Partial<Contact>): Promise<Contact> {
		const contact = await this.getById(id);
		if (!contact) {
			throw new Error(`Contact with id ${id} not found`);
		}
		Object.assign(contact, props);
		return contact;
	}

	public async delete(id: number): Promise<void> {
		const index = this.#contacts.findIndex((contact) => contact.id === id);
		if (index === -1) {
			return;
		}
		this.#contacts.splice(index, 1);
	}

	public async emailExists(
		email: string,
		ignoreId?: number,
	): Promise<boolean> {
		const contact = this.#contacts.find(
			(contact) =>
				contact.email.toLowerCase() === email.toLowerCase() &&
				contact.id !== ignoreId,
		);
		return Boolean(contact);
	}

	public async count(): Promise<number> {
		return this.#contacts.length;
	}
}

export const db = new ContactsDb();
