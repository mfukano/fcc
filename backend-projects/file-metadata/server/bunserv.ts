import { serve } from "bun";

const LOCALHOST = "http://localhost:3000";
const JSON_CONTENT = { "Content-Type": "application/json" };
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": LOCALHOST,
  "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

const HOMEPAGE = `${import.meta.dir}/../public/index.html`;
const STYLE = `${import.meta.dir}/../public/style.css`;

serve({
  static: {
    "/": new Response(await Bun.file(HOMEPAGE).bytes(), {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/html",
      },
    }),
    "/style.css": new Response(await Bun.file(STYLE).bytes(), {
      headers: {
        "Content-Type": "text/css",
      },
    }),
  },

  fetch: async (req) => {
    const path = new URL(req.url).pathname;
    const origin = req.headers.get("origin");

    if (req.method === "POST" && path === "/api/fileanalyse") {
      try {
        if (
          origin &&
          Bun.env.DOMAINS &&
          Bun.env.DOMAINS.split(",").includes(origin)
        ) {
          CORS_HEADERS["Access-Control-Allow-Origin"] = origin;
        }

        const formData = await req.formData();
        const file = formData.get("upfile") as File;

        if (!file) {
          return new Response(JSON.stringify({ error: "No file uploaded" }), {
            status: 400,
            headers: JSON_CONTENT,
          });
        }

        const { name, type, size } = file;

        return new Response(JSON.stringify({ name, type, size }), {
          headers: { ...CORS_HEADERS, ...JSON_CONTENT },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Failed to process file upload" }),
          { status: 500, headers: JSON_CONTENT },
        );
      }
    }

    return new Response("Method Not Allowed", { status: 405 });
  },
  port: 3000,
});
console.log("Started server at http://localhost:3000");
