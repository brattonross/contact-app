import type { APIContext } from "astro";
import { db } from "~/contacts";

export async function get(context: APIContext): Promise<Response> {
    const contactId = Number(context.url.searchParams.get("contactId"))
    const email = context.url.searchParams.get("email")
    if (!email) {
        return new Response("", {
            status: 200,
            headers: {
                "content-type": "text/plain",
            },
        });
    }

    const emailExists = await db.emailExists(email, contactId);
    return new Response(emailExists ? "Email already in use." : "", {
        status: 200,
        headers: {
            "content-type": "text/plain",
        },
    });
}
