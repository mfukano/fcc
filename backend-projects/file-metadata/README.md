# file-metadata

## Installing

To install the content of just this project,
since I have a top-level repository with all of my freeCodeCamp projects,
I have included instructions to checkout just the contents
of the file-metadata project space.

```bash
git clone --no-checkout https://github.com/mfukano/fcc.git
cd fcc/
git sparse-checkout init
git sparse-checkout set backend-projects/file-metadata
git checkout main
mv sample.env .env
bun i
bun run [hono / bunserv]
```

## What is this?

This is a server that exposes the metadata of files uploaded to it.
Sort of like a file echo server.

There are two server implementations that do the same thing, `hono.ts` and `bunserv.ts`.
They both expose `index.html`, which uploads a file by accessing the server's
single endpoint: `api/fileanalyse`.

## POST /api/fileanalyse

This endpoint receives a request body containing a file and returns an object containing
information about that file, namely:

- name: name of the file uploaded, as seen in the
  `input[type="file"]` element on `index.html`
- size: size of the file uploaded, in bytes
- type: mimeType of the file uploaded ("image/png", "application/json", "audio/x-wav")

## My thoughts

This server is built in two ways, with both Bun alone and using Hono.
I wanted to try implementing the server first with solely Bun, which
turned out challenging because I overindexed into learning about the
`Content-Disposition` header and didn't realize I could use the built-in
[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
object APIs to extract the FormData and cast the uploaded file
as a [File](https://developer.mozilla.org/en-US/docs/Web/API/File).

I eventually came back around to this approach to finish it out and add
it as a second implementation. I was able to finish this with a simple set of
CORS rules and the error handling I'd want in an endpoint like this.
It was pretty manual in comparison to Hono, but I feel like my understanding of
how Bun exposes these APIs is much higher, especially after working through the
request body misunderstanding and reading up on `Request` and `File`.

My stop-gap implementation was using Hono, though.
This was the implementation I finished first,
and it was very straightforward, coming from my last project in Express.
Hono abstracts a number of things for us:

- Middleware handling
- Static file serving
- Handler separation by verb and path
- Simplifying request handling into a Context

I love the way it wires up by exporting its config, and connecting the fetch
to Hono's `app.fetch()`. I could see myself using Hono for a lot more because of
its conveniences.

## More information

Further information about this project can be found on [FreeCodeCamp](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/file-metadata-microservice).
