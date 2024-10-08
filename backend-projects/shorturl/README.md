# whoami

## What is this?

This is a URL shortener service that maps a valid URL to an API
path tracked by a counter on the server.
It does _not_ connect to a database, which means the paths are only valid
while that server instance has not been stopped or restarted.

It has two endpoints, `/api/shorturl/` and `/api/shorturl/:id`:

## POST /api/shorturl/

This endpoint receives a request body arg containing a URL string
and returns an object containing the original url string submitted
and the short url identifier to pass to the endpoint.

```javascript
@param url_path = "https://example.com"   // should be (protocol:// [e.g. https://])? (prefix or subdomain [e.g. www., api.])? (hostname [e.g. github])! (TLD [e.g. .com, .horse, .])

POST /api/shorturl/ HTTP/1.1
Host: localhost:3000
Content-Type: application/json
{ "url": "http://www.example.com" }

-> { "original_url": "http://www.example.com", "short_url": 1 }
```

## GET /api/shorturl/:id

This endpoint receives a request param `:id` containing the short_url
lookup id from the prior **POST** request.
It performs a lookup on an in-memory array of URL objects by `short_url`
and performs a redirect to that URL instead of returning data from the server.

```javascript
GET /api/shorturl/1 HTTP/1.1
Host: localhost:3000

-> HTTP 302 "http://www.example.com"
```

## More information

Further information about this project can be found on [FreeCodeCamp](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice).
