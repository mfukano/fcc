require("dotenv").config();
const express = require("express");
const app = express();
const dns = require("node:dns");
const os = require("node:os");

const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "Hello API!" });
});

app.get("/api/whoami", (req, res) => {
  const ipaddress = req.ip;
  const language = req.headers["accept-language"];
  const software = req.headers["user-agent"];

  const ret = {
    ipaddress,
    language,
    software,
  };

  console.log(`retval: ${JSON.stringify(ret)}`);
  res.json(ret);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Your app is listening on port ${listener.address().port} ✨`);
});
