# Timestamp Microservice

## What is this?

This is my implementation of FreeCodeCamp's Timestamp Microservice project.
Information about the project can be found at [FreeCodeCamp](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/timestamp-microservice).

This project presents a simple server with a single API endpoint,
`/api/:date`.

---

### /api/:date

Accepts a single argument as a URL parameter in two possible forms:

**`@param date_string`** - unix timestamps (generally numbers) in milliseconds\
`(e.g. 1713571200000)`

or

**`@param date_string`** - conventional utc date-string formats
parsable by Javascript's Date(date_string) constructor\
`(e.g. 2024-04-20, April 20 2024)`

```JavaScript
"http://localhost:3000/api/2024-04-20"
  -> {"unix":1713571200000,"utc":"Sat, 20 Apr 2024 00:00:00 GMT"}
"http://localhost:3000/api/1713571200000"
  -> {"unix":1713571200000,"utc":"Sat, 20 Apr 2024 00:00:00 GMT"}
```

## Project requirements and validations

This endpoint has validation for most special characters and non-Date inputs.
I haven't extensively tested URL safety and / or all edge cases
but I think that's beyond the scope of this project, which currently satisfies
all baseline requirements, namely:

- [x] A request to /api/:date? with a valid date should return a JSON object
  - [x] with a unix key that is a
        Unix timestamp of the input date
        in milliseconds (as type Number)
  - [x] with a utc key that is a string
        of the input date in the format:
        Thu, 01 Jan 1970 00:00:00 GMT
- [x] Your project can handle dates that can be successfully parsed by new Date(date_string)
- [x] An empty date parameter should return the current time in a JSON object
  - [x] with a unix key \[timestamp\]
  - [x] with a utc key \[UTC datestring\]
