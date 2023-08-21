export type Contact = {
    id: number;
    name: string;
}

class ContactsDb {
    #contacts: Array<Contact> = [];

    public constructor() {
        this.#contacts.push({ id: 1, name: "Alice" });
        this.#contacts.push({ id: 2, name: "Bob" });
    }

    public async all(): Promise<ReadonlyArray<Contact>> {
        return this.#contacts;
    }

    public async search(search: string): Promise<ReadonlyArray<Contact>> {
        return this.#contacts.filter(contact => contact.name.toLowerCase().includes(search.toLowerCase()));
    }

    public async create(name: string): Promise<Contact> {
        const id = this.#contacts.length + 1;
        const contact = { id, name };
        this.#contacts.push(contact);
        return contact;
    }
}

export const db = new ContactsDb();
