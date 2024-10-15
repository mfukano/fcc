import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "node:path";
import user from "./api/user.js";

dotenv.config({ path: path.resolve(import.meta.dirname, ".env") });

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: "true" }));
app.use(express.json());

// this works for now but if I want to make the front-end stateful I should probably not make it static
app.use(express.static("public"));

const enableCORS = function (req, res, next) {
  if (!process.env.DISABLE_XORIGIN) {
    const allowedOrigins = ["https://www.freecodecamp.org"];
    const origin = req.headers.origin;
    if (!process.env.XORIGIN_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(req.method);
      res.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      });
    }
  }
  next();
};
/*
app.get("/", function (req, res) {
  res.sendFile(path.resolve(import.meta.dirname, "../public", "index.html"));
});
*/

// cors later hehe

/**
 *   I want to hide any requests to the .env file that the server itself isn't making
 */
app.get("/file/*?", function (req, res, next) {
  if (req.params[0] === ".env") {
    return next({ status: 401, message: "ACCESS DENIED" });
  }
  fs.readFile(path.join(__dirname, req.params[0]), function (err, data) {
    if (err) {
      return next(err);
    }
    res.type("txt").send(data.toString());
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/*  import route files  */
app.use("/api/users", enableCORS, user);

const listener = app.listen(process.env.PORT || PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
