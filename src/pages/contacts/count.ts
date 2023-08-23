import { db } from "~/contacts";

export async function get(): Promise<Response> {
    const count = await db.count();
    return new Response(
        "(" + count.toString() + " total contacts)",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}
