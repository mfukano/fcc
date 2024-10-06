// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:date", function (req, res) {
  let date = req.params.date;
  console.log(`/api/:date received query param: ${date}`);

  let valiDated = valiDate(date);
  if (valiDated.error) {
    res.json({
      error: valiDated.error,
    });
    return;
  }

  console.log(`res.json(${JSON.stringify(valiDated)})`);
  res.json(valiDated);
});

function valiDate(dateString) {
  // timestamp validation
  const dateNum = parseInt(dateString);
  const dateNumAsDate = new Date(dateNum);
  if (dateNum === dateNumAsDate.valueOf()) {
    return { unix: dateNumAsDate.valueOf(), utc: dateNumAsDate.toUTCString() };
  }

  // timestamp validation failed, fall back to Date(dateString) coercion
  const date = new Date(dateString);
  if (date === "Invalid Date") {
    return { error: date };
  }

  return { unix: date.valueOf(), utc: date.toUTCString() };
}

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
