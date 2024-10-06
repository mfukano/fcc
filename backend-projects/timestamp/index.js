var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use(express.static("public"));
app.use((req, res, next) => {
  console.log(`-- ${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/", function (req, res) {
  // since request has no :date param, return current time
  const now = new Date();
  res.json({
    unix: now.valueOf(),
    utc: now.toUTCString(),
  });
});

app.get("/api/:date", function (req, res) {
  let date = req.params.date;
  console.log(`/api/:date received query param: ${date}`);

  let valiDated = valiDate(date);

  console.log(`res.json(${JSON.stringify(valiDated)})`);
  res.json(valiDated);
});

function valiDate(dateString) {
  const hasNums = dateString.match(/[0-9]+/g);
  const invalid = "Invalid Date";

  // dates have numbers because numbers mean things
  if (!hasNums) {
    return { error: invalid };
  }

  // timestamp validation
  const dateNum = parseInt(dateString);
  const dateNumAsDate = new Date(dateNum);
  if (
    !isNaN(dateNum) &&
    dateNumAsDate.valueOf().toString().length == dateString.length &&
    dateNum === dateNumAsDate.valueOf()
  ) {
    return { unix: dateNumAsDate.valueOf(), utc: dateNumAsDate.toUTCString() };
  }

  // timestamp validation failed, fall back to Date(dateString) coercion
  const date = new Date(dateString);

  // it's not a timestamp and it failed Date() coercion, so return an error
  if (date == invalid) {
    return { error: invalid };
  }

  // at this point, Date(dateString) coercion should have succeeded
  return { unix: date.valueOf(), utc: date.toUTCString() };
}

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
