export type Contact = {
    id: number;
    name: string;
    email: string;
    phone: string;
}

class ContactsDb {
    #contacts: Array<Contact> = [];

    public constructor() {
        this.#contacts.push({ id: 1, name: "Alice", email: "alice@example.com", phone: "123-456-7890" });
        this.#contacts.push({ id: 2, name: "Bob", email: "bob@example.com", phone: "123-456-7890" });
    }

    public async all(): Promise<ReadonlyArray<Contact>> {
        return this.#contacts;
    }

    public async search(search: string): Promise<ReadonlyArray<Contact>> {
        return this.#contacts.filter(contact => contact.name.toLowerCase().includes(search.toLowerCase()));
    }

    public async create(props: Omit<Contact, "id">): Promise<Contact> {
        const id = this.#contacts.length + 1;
        const contact = { id, ...props };
        this.#contacts.push(contact);
        return contact;
    }
}

export const db = new ContactsDb();
