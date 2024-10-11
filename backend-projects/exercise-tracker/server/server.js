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

// cors later hehe
// app.use(cors());

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
app.use("/api/users", user);

const listener = app.listen(process.env.PORT || PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
