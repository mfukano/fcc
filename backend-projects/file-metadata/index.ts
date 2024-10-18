const REC_FILES_PATH = `./received_files`;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

console.log("Hello via Bun!");
const server = Bun.serve({
  port: 4000,
  async fetch(req) {
    const path = new URL(req.url).pathname;

    console.log(`
RECEIVED ${req.method.toUpperCase()} REQUEST:
path: ${path}
`);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (path === "/") return new Response(Bun.file("index.html"));

    if (path === "/api/upload") {
      const formData = await req.formData();

      const uploadedFile = formData.get("file");
      const filename = formData.get("filename");

      if (!uploadedFile) throw new Error("Must upload a file");
      await Bun.write(`${REC_FILES_PATH}/${filename}`, uploadedFile);

      const writtenFile = Bun.file(`${REC_FILES_PATH}/${filename}`);
      const writtenFileBytes = await writtenFile.bytes();

      return new Response(
        JSON.stringify({
          name: writtenFile.name,
          size: writtenFileBytes.length,
          type: writtenFile.type,
        }),
        {
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (path === "/cleanup") {
      await Bun.$`rm -rf ${REC_FILES_PATH}/*`;
      console.log("done");
    }

    return new Response("Not Found", { status: 404 });
  },
});
