require("dotenv").config();
const express = require("express");
const app = express();
const dns = require("node:dns");

const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "Hello API!" });
});

/**
 * I'm using pascalCase here even though the return params use snake_case to differentiate
 * between in-memory and returned variables, since I sometimes reference them with identical key/value paired parameters
 * ({ original_url } == { original_url: original_url })
 */
let shurlCounter = 1;
let shortUrlArray =
  []; /* [ { "original_url": "http://example.com", "short_url": 1 } ]*/
app.post("/api/shorturl", (req, res) => {
  const original_url = req.body.url;

  /* After receiving the url we need to perform validation */
  if (!validateUrl(original_url)) {
    console.error(`There was an error with the URL submitted.`);
    res.json({ error: "invalid url" });
  }

  const shortUrlObj = {
    original_url,
    short_url: shurlCounter,
  };

  shortUrlArray.push(shortUrlObj);
  shurlCounter = shortUrlArray.length + 1;
  console.log(`push shortUrlObj: ${JSON.stringify(shortUrlObj)} 
to short_url array: ${JSON.stringify(shortUrlArray)}
and return ${JSON.stringify({ original_url, short_url: shortUrlObj.short_url })}`);

  res.json({ original_url, short_url: shortUrlObj.short_url });
});

app.get("/api/shorturl/:id", (req, res) => {
  let urlId = req.params.id;
  let { original_url } = shortUrlArray.filter(
    (shortUrlObj) => shortUrlObj.short_url == urlId,
  )[0];

  console.log(
    `received url_id: ${urlId}; attempting redirect to ${original_url}`,
  );
  res.redirect(original_url);
});

/**
 *  validateUrl is a helper function that receives a URL string to test if it is valid via node:dns,
 *  and returns a boolean value with the result of said DNS lookup.
 *
 *  @param url - URL string to validate
 *  @returns true/false
 */
const validateUrl = (url) => {
  const result = dns.lookup(url, (err, addr) => {
    if (err) {
      console.error(
        `[validateUrl()] dns.lookup(${url}) failed: ${JSON.stringify(err)}`,
      );
      return false;
    } else {
      console.log(`returned dns lookup address: ${JSON.stringify(addr)}`);
      return true;
    }
  });

  return result;
};

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Your app is listening on port ${listener.address().port} ✨`);
});
