import { Hono, type Context } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";

interface SimpleError {
  message: String;
}

const app = new Hono();
const allowedOrigins = Bun.env.DOMAINS ? Bun.env.DOMAINS.split(",") : null;

app.use("/", cors(), serveStatic({ path: "./index.html" }));
app.use("/style.css", cors(), serveStatic({ path: "./style.css" }));
app.use(
  "/api/*",
  cors({
    origin: allowedOrigins || "http://localhost:4000",
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
  }),
);

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
  const file = body["upfile"] as File;
  if (!file) throw new Error("No file uploaded");

  try {
    console.log(
      `log file attrs:
			file.name: ${file.name} 
			file.size: ${file.size} 
			file.type: ${file.type}`.replace(/^[ \t]+/gm, ""),
    );
    return { name: file.name, size: file.size, type: file.type };
  } catch (e) {
    console.error(`Error: ${e}`);
    return { message: e };
  }
}

export default {
  port: 4000,
  fetch: app.fetch,
};
