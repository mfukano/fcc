const REC_FILES_PATH = `./received_files`;
const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
    "Access-Control-Allow-Headers": "Content-Type",
  },
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
      return new Response(null, { status: 204, headers: CORS_HEADERS.headers });
    }

    if (path === "/") return new Response(Bun.file("index.html"), CORS_HEADERS);

    if (path === "/api/fileanalyse") {
      const formData = await req.formData();

      const uploadedFile = formData.get("upfile");
      const filename = formData.get("filename");

      if (!uploadedFile) throw new Error("Must upload a file");
      await Bun.write(`${REC_FILES_PATH}/${filename}`, uploadedFile);

      const writtenFile = Bun.file(`${REC_FILES_PATH}/${filename}`);
      const writtenFileBytes = await writtenFile.bytes();

      return Response.json(
        {
          name: filename,
          size: writtenFileBytes.length,
          type: writtenFile.type,
        },
        CORS_HEADERS,
      );
    }

    if (path === "/cleanup") {
      await Bun.$`rm -rf ${REC_FILES_PATH}/*`;
      console.log("done");
    }

    return new Response("Not Found", { status: 404 });
  },
});
