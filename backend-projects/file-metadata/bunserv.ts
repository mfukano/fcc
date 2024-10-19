import { serve } from "bun";

const LOCALHOST = "http://localhost:3000";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": LOCALHOST,
  "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

serve({
  static: {
    "/": new Response(await Bun.file("./index.html").bytes(), {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/html",
      },
    }),
    "/style.css": new Response(await Bun.file("./style.css").bytes(), {
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
            headers: { "Content-Type": "application/json" },
          });
        }

        const { name, type, size } = file;

        return new Response(JSON.stringify({ name, type, size }), {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Failed to process file upload" }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    return new Response("Method Not Allowed", { status: 405 });
  },
  port: 3000,
});
