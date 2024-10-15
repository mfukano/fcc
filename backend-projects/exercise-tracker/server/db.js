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
  console.log(`check received username: ${username}`);
  new User({ username })
    .save()
    .then((createdUser) => handleCallback(done, createdUser))
    .catch((err) => logErr(err));
};

const findAllUsers = (done) => {
  User.find()
    .then((foundUsers) => handleCallback(done, foundUsers))
    .catch((err) => logErr(err));
};

const findUsersByName = (userName, done) => {
  const filter = { name: userName };
  User.find(filter)
    .then((foundUsers) => handleCallback(done, foundUsers))
    .catch((err) => logErr(err));
};

const findUserById = (userId, done) => {
  User.findById({ _id: userId })
    .select("_id username")
    .then((foundUser) => handleCallback(done, foundUser._doc))
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
    date,
  });
  console.log(`check exercise before save: ${JSON.stringify(exercise)}`);
  exercise
    .save()
    .then((savedExercise) => handleCallback(done, savedExercise))
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
      $or: [
        {
          $and: [
            { date: { $gte: new Date(fromDate).toISOString() } },
            { date: { $lte: new Date(toDate).toISOString() } },
          ],
        },
        { userId },
      ],
    };
  } else {
    filter = { userId };
    if (fromDate) {
      filter.date = { $gte: new Date(fromDate).toISOString() };
    }
    if (toDate) {
      filter.date = { $lte: new Date(toDate).toISOString() };
    }
  }
  console.log(`filter: ${JSON.stringify(filter)}`);

  Exercise.find(filter)
    .limit(limit ? limit : Number.MAX_VALUE)
    .select("date duration description -_id")
    .then((err, foundExercises) => handleCallback(done, err, foundExercises));
};

/* helper functions */

const handleCallback = (done, data) => {
  console.log(`logging received data: ${JSON.stringify(data)}`);
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
