# exercise-tracker

## What is this?

This is an Exercise Tracker API server with a static front-end.

**It has a mercurial connection to a database, which means the paths are only valid
while the (very temporary) MongoDB instance has not been stopped or restarted.**

It has four endpoints:

- `POST /api/users/`
- `POST /api/users/:id/exercises`
- `GET /api/users/:id`
- `GET /api/users/:id/logs`

## POST /api/users/

This endpoint receives a request body arg containing a `username` string
and returns an object containing the `username` and an `id` string.

## POST /api/users/:id/exercises

This endpoint receives a request body containing three parameters,
two of them required:

- `description: String` - An alphanumeric description of the exercise.
- `duration: Number` - The duration in minutes of the performed exercise.
- `date?: Date` - (optional) The date the exercised was performed,
  in most valid Date formats

and returns an object containing the user information (`username` and `id`)
associated submitted with the `:id` key from the URL, along with the
associated exercise fields (`description`, `duration`, `date`,
which in the case that it is not provided is assigned
to the current date in the requestor's locale).

## GET /api/users/:id

This endpoint receives a URL parameter containing a user `id` string
and returns an object containing the associated `username` and `id`.

## GET /api/users/:id/logs

This endpoint receives a URL parameter containing a user `id` string
and returns an object containing the following:

- `username: String` - Username returned from User record
  with `id == :id` from URL param
- `_id: String` - ID returned from User record with `id == :id` from URL param
- `count: Number` - Number of records returned in the below `log` array
- `log: [Exercise]` - Array of Exercise records containing simplified data:
  - `description: String`
  - `duration: Number`
  - `date: Date`

## My Thoughts

I went hard on the API layer. More in **Server** below but I felt like the validations
and logging middlewares helped me out a ton once I made them more robust.

I still probably need to extract some of the repeated functionality out of the handlers
and also strategize with simple testing while in development. I ran into situations
where my code regressed that could easily have been solved with functional
tests ensuring the correct inputs and outputs.

The handler functions blew up in size and would probably have been hard
to test for internal logic, so simple tests would have
helped ensure those were stable as well.

### Front-End

The front-end has (what I think) is a pretty de-facto workaround for receiving
the user ID within the form but filtering it from the request to the server.

It also handles the server response with async/await to render the data
onto the page without reloading it. I had an idea to play with Vue on this,
and still might convert it with a simple import tag,
but I was hesitant to integrate a bigger framework into
a page with essentially one dynamic interaction when the other forms would still
handle the response by rendering only the JSON returned.

### Server

The backend is probably over-engineered, a little bit. I liked the error
handling from the `fcc-mongo` repo and adopted it here with some helper
functions handling logging at consistent points. It might not need request
logging for _everything_ but it was nice in working through some of the
edge cases and off-by-ones.

It was also useful implementing the pattern of writing simply for the database
and implementing the handlers in the exported database functions' callbacks,
though the handler logic is probably nicer to extract for readability as well.

```javascript

## More information

Further information about this project can be found on [FreeCodeCamp](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice).
```
