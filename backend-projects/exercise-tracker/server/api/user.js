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
  const validateErr = validateString(username);

  if (!username) {
    return next("No username provided to /api/users");
  }
  if (validateErr) {
    return next(validateErr);
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
      const dateValidateErr = validateDate(date);
      const stringValidateErr = validateString(description);

      if (stringValidateErr || dateValidateErr) {
        if (stringValidateErr) return next(stringValidateErr);
        if (dateValidateErr) return next(dateValidateErr);
      }

      const requestParams = {
        username: user.username,
        _id: user._id,
        description,
        duration,
        date: new Date(date) || new Date(),
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

        res.json({ ...requestParams, date: requestParams.date.toDateString() });
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
        fromDate: req.query.from,
        toDate: req.query.to,
        limit: req.query.limit,
      };

      const fromValidateErr = validateDate(requestParams.fromDate);
      const toValidateErr = validateDate(requestParams.toDate);

      if (fromValidateErr || toValidateErr) {
        if (fromValidateErr) return next(fromValidateErr);
        if (toValidateErr) return next(toValidateErr);
      }

      console.log(
        `check requestParams before find by filters: ${JSON.stringify(requestParams)}`,
      );
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

        exercises = exercises.map((exercise) => {
          return { ...exercise._doc, date: exercise.date.toDateString() };
        });

        console.log(exercises);

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

const validateDate = (date) => {
  if (date && new Date(date) == "Invalid Date") {
    return "Invalid Date";
  }
};

const validateString = (str) => {
  if (!str) {
    return "Missing required string";
  }
  if (str && str.match(/[^a-zA-Z0-9:]/g)) {
    return "Some string param is not valid";
  }

  return null;
};

export default router;
