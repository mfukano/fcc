import * as dotenv from "dotenv";
import mongoose from "mongoose";
import path from "node:path";

/*
 * config and connect
 * */

dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });
mongoose.connect(process.env.MONGO_URI);

/*
 * schemas and model setup
 * */

const userSchema = new mongoose.Schema({
  username: String,
});

const exerciseType = {
  username: String,
  description: String,
  duration: Number,
  date: Date,
  userId: String,
};

const exerciseSchema = new mongoose.Schema(exerciseType);

let User = mongoose.model("User", userSchema);
let Exercise = mongoose.model("Exercise", exerciseSchema);

/*
 * db access functions
 **/

const createAndSaveUser = (username, done) => {
  new User({ username })
    .save()
    .then((createdUser) =>
      handleCallback(done, createdUser, "createAndSaveUser"),
    )
    .catch((err) => logErr(err));
};

const findAllUsers = (done) => {
  User.find()
    .then((foundUsers) => handleCallback(done, foundUsers, "findAllUsers"))
    .catch((err) => logErr(err));
};

const findUsersByName = (userName, done) => {
  const filter = { name: userName };
  User.find(filter)
    .then((foundUsers) => handleCallback(done, foundUsers, "findUsersByName"))
    .catch((err) => logErr(err));
};

const findUserById = (userId, done) => {
  User.findById(userId)
    .select("_id username")
    .then((foundUser) => handleCallback(done, foundUser, "findUserById"))
    .catch((err) => logErr(err));
};

const createAndSaveExercise = (
  { username, description, duration, date, _id },
  done,
) => {
  const exercise = new Exercise({
    userId: _id,
    username,
    description,
    duration,
    date: new Date(date).toISOString(),
  });

  exercise
    .save()
    .then((savedExercise) =>
      handleCallback(done, savedExercise, "createAndSaveExercise"),
    )
    .catch((err) => logErr(err));
};

/**
 * findExercisesById takes a userId, and requests all Exercises by { _id: userId }.
 * This is the format the exercise expects Exercises are partitioned by.
 *
 * This needs to be modified for receiving parameter filters:
 * - [from, to]: Date   --  Date constraints for returned Exercises
 * - limit: Number      --  Limit constraint on returned number of records
 *
 * @param userId - MongoDB User _id
 * @returns [Exercise] for shaping into a user's exercise log
 */
const findExercisesById = (userId, requestParams, done) => {
  const { fromDate, toDate, limit } = requestParams;
  let filter;
  // This should create new objects for either parameter and fill them accordingly;
  // toDate might act weird if filter.date is null but I should test.
  if (fromDate && toDate) {
    filter = {
      userId,
      date: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    };
  } else {
    filter = { userId };

    if (fromDate) {
      filter.date = { $gte: new Date(fromDate) };
    }
    if (toDate) {
      filter.date = { $lte: new Date(toDate) };
    }
  }
  console.log(`filter: ${JSON.stringify(filter)}`);

  Exercise.find(filter)
    .select("date duration description -_id")
    .limit(limit ? limit : Number.MAX_VALUE)
    .then((foundExercises) =>
      handleCallback(done, foundExercises, "findExercisesById"),
    )
    .catch((err) => logErr(err));
};

/* helper functions */

const handleCallback = (done, data, caller) => {
  console.log(`
${caller} handleCallback LOG
----------------------------
logging received data: ${JSON.stringify(data)}
`);
  done(null, data);
};

const logErr = (err) => {
  if (err) console.log(err);
};

/*
 * exports
 **/

export {
  createAndSaveUser,
  findAllUsers,
  findUsersByName,
  findUserById,
  createAndSaveExercise,
  findExercisesById,
};
