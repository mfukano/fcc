# whoami

## What is this?

This is a simple express server to present information about a client accessor.
It has one endpoint, `/api/whoami`:

## /api/whoami/

This endpoint checks the request headers of a GET request to the endpoint
and returns the IPv4 address, User-Agent, and Accept-Language
(or locale lang) parameters in the form of

```javascript
{
  // req.ip value
  "ipaddress": ":ffff:127.0.0.1",
  // req.headers["accept-language"] value
  "language": "en-US,en;q=0.5",
  // req.headers["user-agent"] value
  "software": "Mozilla/5.0 ([...agent-details]) ...Firefox/131.0"
}
```

## More information

Further information about this project can be found on [FreeCodeCamp](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/request-header-parser-microservice).
