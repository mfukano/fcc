import { Hono, type Context } from "hono";
import { serveStatic } from "hono/bun";

interface SimpleError {
	message: String,
}

const app = new Hono();

app.use("/", serveStatic({ path: "./index.html" }));
app.use("/style.css", serveStatic({ path: "./style.css" }));

app.post("/api/fileanalyse", async (c) => {
	try {
		const fileMetadata = await parseMultipartForm(c.req);
		return c.json(fileMetadata);
	} catch (error: unknown) {
		const e = error as SimpleError;
		return c.json({ error: e.message }, 400);
	}
});

async function parseMultipartForm(req: Context["req"]) {
	const body = await req.parseBody();
	const file = body['upfile'] as File;
	if (!file) throw new Error("No file uploaded");

	try {
		console.log(`log file attrs:
			file.name: ${file.name} 
			file.size: ${file.size} 
			file.type: ${file.type}`
			.replace(/^[ \t]+/gm, "")
		);
		return { name: file.name, size: file.size, type: file.type }
	} catch (e) {
		console.error(`Error: ${e}`)
		return { message: e }
	}
}

export default {
	port: 4001,
	fetch: app.fetch,
}