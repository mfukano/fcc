import express from "express";
import {
  createAndSaveUser,
  createAndSaveExercise,
  findAllUsers,
  findUserById,
  findExercisesById,
} from "../db.js";

const router = express.Router();
const ERROR_MSG = "There was an error in the API request.";

// should return list of users
router.get("/", (req, res, next) => {
  let t = handleTimeout(next);
  findAllUsers((err, users) => {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!users) {
      console.log(`GET /api/users/ :: ${ERROR_MSG}`);
      return next({ message: ERROR_MSG });
    }
    res.json(users);
  });
});

router.get("/:_id", (req, res, next) => {
  let t = handleTimeout(next);
  findUserById(req.params._id, (err, user) => {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log(`GET /:id :: ${ERROR_MSG}`);
      return next({ message: ERROR_MSG });
    }
    res.json(user);
  });
});

router.post("/", (req, res, next) => {
  console.log(`check post request body: ${JSON.stringify(req.body)}`);
  const username = req.body.username;

  if (!username) {
    return next("No username provided to /api/users");
  }
  let t = handleTimeout(next);
  createAndSaveUser(username, (err, user) => {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!user) {
      const postError = ERROR_MSG.concat(
        "\nReturned user is null or doesn't exist",
      );
      console.error(postError);
      return next({ message: postError });
    }
    findUserById(user._id, (err, foundUser) => {
      if (err) {
        return next(err);
      }
      console.log(`returning found user: ${JSON.stringify(foundUser)}`);
      res.json(foundUser);
    });
  });
});

router.post("/:id/exercises", (req, res, next) => {
  let t = handleTimeout(next);
  findUserById(req.params.id, (err, user) => {
    if (err) {
      return next(err);
    }
    try {
      const { description, duration, date } = req.body;
      const requestParams = {
        username: user.username,
        _id: user._id,
        description,
        duration,
        date: date || new Date(),
      };
      createAndSaveExercise(requestParams, (err, data) => {
        clearTimeout(t);
        if (err) {
          return next(err);
        }
        if (!data) {
          const postError = ERROR_MSG.concat(
            "\nReturned exercise is null or doesn't exist",
          );
          console.error(postError);
          return next({ message: postError });
        }
        res.json(requestParams);
      });
    } catch (err) {
      return next(err);
    }
  });
});

router.get("/:id/logs", (req, res, next) => {
  let t = handleTimeout(next);
  findUserById(req.params.id, (err, user) => {
    if (err) {
      return next(err);
    }
    try {
      const requestParams = {
        fromDate: req.params.from,
        toDate: req.params.to,
        limit: req.params.limit,
      };
      findExercisesById(user._id, requestParams, (err, exercises) => {
        clearTimeout(t);
        if (err) {
          return next(err);
        }
        if (!exercises) {
          console.error(
            "Nothing returned by findExercisesById in GET /:id/logs",
          );
          return next({ message: "Could not find Exercises by User" });
        }

        const result = {
          ...user,
          count: exercises.length,
          log: exercises,
        };

        res.json(result);
      });
    } catch (err) {
      console.error(
        `Erred somewhere within FindUsersById callback try in GET /:id/logs: ${JSON.stringify(err)}`,
      );
      return next(err);
    }
  });
});

const TIMEOUT = 10000;
const handleTimeout = (callback) => {
  return setTimeout(() => {
    callback({ message: "timeout" });
  }, TIMEOUT);
};

export default router;
