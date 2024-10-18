const REC_FILES_PATH = `./received_files`;
console.log("Hello via Bun!");
const server = Bun.serve({
  port: 4000,
  async fetch(req) {
    const path = new URL(req.url).pathname;

    if (path === "/")
      return new Response(Bun.file("index.html"), {
        headers: {
          "Content-Type": "text/html",
        },
      });

    if (path === "/api/upload") {
      const formData = await req.formData();

      const uploadedFile = formData.get("file");
      const filename = formData.get("filename");

      if (!uploadedFile) throw new Error("Must upload a file");
      await Bun.write(`${REC_FILES_PATH}/${filename}`, uploadedFile);

      const writtenFile = Bun.file(`${REC_FILES_PATH}/${filename}`);
      const writtenFileBytes = await writtenFile.bytes();

      return Response.json({
        name: writtenFile.name,
        size: writtenFileBytes.length,
        type: writtenFile.type,
      });
    }

    if (path === "/cleanup") {
      await Bun.$`rm -rf ${REC_FILES_PATH}/*`;
      console.log("done");
    }

    return new Response("Not Found", { status: 404 });
  },
});
