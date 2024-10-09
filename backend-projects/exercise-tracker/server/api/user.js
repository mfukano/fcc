import express from "express";

const router = express.Router();

router.get("/", (req, res, next) => {
  let t = handleTimeout(next);
  createPerson((err, data) => {
    clearTimeout(t);

    if (err) {
      return next(err);
    }
    if (!data) {
      console.log("Error handling API request");
      return next({ message: "Error handling API request" });
    }

    res.json(data);
  });
});

const handleTimeout = (callback) => {
  return setTimeout(() => {
    callback({ message: "timeout" });
  }, TIMEOUT);
};

export default router;
