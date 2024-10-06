# Timestamp Microservice

This is my implementation of the Timestamp Microservice project.

It presents a simple server backend with a single API endpoint, `/api/:date`.
This endpoint supports unix timestamps and/or date-strings that are parsable via JavaScript's Date(date_string) constructor, in the format of

```http
http://localhost:3000/api/2024-04-20
  -> {"unix":1713571200000,"utc":"Sat, 20 Apr 2024 00:00:00 GMT"}
http://localhost:3000/api/1713571200000
  -> {"unix":1713571200000,"utc":"Sat, 20 Apr 2024 00:00:00 GMT"}
```

This endpoint has validation for most special characters and non-Date inputs.
I haven't extensively tested URL safety and / or all edge cases
but I think that's beyond the scope of this project, which currently satisfies
all baseline requirements, namely:

- [x] A request to /api/:date? with a valid date should return a JSON object
  - [x] with a unix key that is a Unix timestamp of the input date in milliseconds (as type Number)
  - [x] with a utc key that is a string of the input date in the format: Thu, 01 Jan 1970 00:00:00 GMT
- [x] Your project can handle dates that can be successfully parsed by new Date(date_string)
- [x] An empty date parameter should return the current time in a JSON object
  - [x] with a unix key \[timestamp\]
  - [x] with a utc key \[UTC datestring\]

Information about the project can be found at [FreeCodeCamp](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/timestamp-microservice).
