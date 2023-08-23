import { archiver } from "~/archive";

export async function get(): Promise<Response> {
    return new Response(Bun.file(archiver.downloadUrl), {
        headers: {
            "content-disposition": "attachment; filename=archive.json",
        },
    });
}
