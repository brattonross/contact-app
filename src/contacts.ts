import { z } from "zod";

export const contactSchema = z.object({
	id: z.number(),
	firstName: z.string().min(1, "Required"),
	lastName: z.string().min(1, "Required"),
	email: z.string().email(),
	phone: z.string().min(10, "Required"),
});

export type Contact = z.infer<typeof contactSchema>;

class ContactsDb {
	#contacts: Array<Contact> = [];

	public constructor() {
		this.#contacts.push({
			id: 1,
			firstName: "John",
			lastName: "Smith",
			email: "john@example.com",
			phone: "123-456-7890",
		});
		this.#contacts.push({
			id: 2,
			firstName: "Dana",
			lastName: "Crandith",
			email: "dcran@example.com",
			phone: "123-456-7890",
		});
		this.#contacts.push({
			id: 3,
			firstName: "Edith",
			lastName: "Neutvaar",
			email: "en@example.com",
			phone: "123-456-7890",
		});
	}

	public async all(): Promise<ReadonlyArray<Contact>> {
		return this.#contacts;
	}

	public async search(search: string): Promise<ReadonlyArray<Contact>> {
		return this.#contacts.filter((contact) => {
			return (
				contact.firstName.includes(search) ||
				contact.lastName.includes(search)
			);
		});
	}

	public async getById(id: number): Promise<Contact | undefined> {
		return this.#contacts.find((contact) => contact.id === id);
	}

	public async create(props: Omit<Contact, "id">): Promise<Contact> {
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
}

export const db = new ContactsDb();
