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
  let result = {
    utc: null,
    unix: null,
  };
  console.log(`in date api, with param: ${date}`);

  let valiDated = valiDate(date);
  if (!valiDated) {
    res.json({
      error: "Invalid Date",
    });
    return;
  }

  result.utc = valiDated.toUTCString();
  result.unix = valiDated.valueOf();

  console.log(`result: ${JSON.stringify(result)}`);

  res.json(result);
});

function valiDate(dateString) {
  // check if we have a unix timestamp
  console.log(`check dateString: ${dateString} ${typeof dateString}`);
  //let date = new Date(parseInt(dateString));

  // timestamp received is the same when converted into a UTC timestamp
  /* 
  if (date.valueOf() == parseInt(dateString)) {
    return date;
  }
*/
  // check if we received a valid datestring format
  date = new Date(dateString);

  console.log(`in valiDate, checking date created: ${date}`);

  if (date === "Invalid Date") {
    return null;
  }

  console.log(`input was valid, returning date: ${JSON.stringify(date)}`);
  return date;
}

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
