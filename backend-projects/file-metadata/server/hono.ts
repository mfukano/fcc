import { Hono, type Context } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";

interface SimpleError {
  message: String;
}

const app = new Hono();
const allowedOrigins = Bun.env.DOMAINS ? Bun.env.DOMAINS.split(",") : null;

app.use("/", cors(), serveStatic({ path: `./public/index.html` }));
app.use("/style.css", cors(), serveStatic({ path: `./public/style.css` }));

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

  const { name, size, type } = file;
  return { name, size, type };
}

export default {
  port: 4000,
  fetch: app.fetch,
};
