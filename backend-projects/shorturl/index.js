require("dotenv").config();
const express = require("express");
const app = express();
const dns = require("node:dns");
const cors = require("cors");

/* !SECTION middleware */
app.use(cors({ optionsSuccessStatus: 200 }));
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log(`-- ${req.method} ${req.path} - ${req.ip}`);
  next();
});

/** !SECTION in-memory variable declaration
 * I'm using pascalCase here even though the return params use snake_case to differentiate
 * between in-memory and returned variables, since I sometimes reference them with identical key/value paired parameters
 * i.e. { original_url } == { original_url: original_url }
 */
let shurlCounter = 1;
let shortUrlArray = [];
/**
 * shortUrlArray receives objects to form an array like this:
 * [{
 *    "original_url": "http://example.com",
 *    "short_url": 1
 * }]
 */

/* !SECTION handlers */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl", async (req, res) => {
  const original_url = req.body.url;
  let isUrlValid = await validateUrl(original_url);

  /* After receiving the url we need to perform validation */
  if (!isUrlValid) {
    console.error(`There was an error with the URL submitted.`);
    res.json({ error: "invalid url" });
    return;
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

  if (shortUrlArray.length < urlId) {
    throw new Error("Url ID does not exist").message;
  }

  let { original_url } = shortUrlArray.filter(
    (shortUrlObj) => shortUrlObj.short_url == urlId,
  )[0];

  console.log(
    `received url_id: ${urlId}; attempting redirect to ${original_url}`,
  );
  res.redirect(original_url);
});

/* !SECTION helper functions */

/**
 *  validateUrl is an async helper function that receives
 *  a URL string to test if it is valid via node:dns,
 *  and returns a boolean value with the result of the DNS lookup.
 *
 *  @param url - URL string to validate
 *  @returns true/false
 */
const validateUrl = async (url) => {
  try {
    const address = await new Promise((resolve, reject) => {
      dns.lookup(url, (err, addr) => {
        if (err) reject(err);
        resolve(addr);
      });
    });

    if (address) {
      return true;
    }
  } catch (err) {
    console.error(`Erred in doLookup: \n${err}\n`);
    return false;
  }
};

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Your app is listening on port ${listener.address().port} ✨`);
});
