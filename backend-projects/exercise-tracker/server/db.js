import * as dotenv from "dotenv";
import mongoose from "mongoose";

/*
 * config and connect
 * */

dotenv.config({ path: path.resolve(import.meta.dirname, ".env") });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/*
 * schemas and model setup
 * */

const userSchema = new mongoose.Schema({
  name: String,
});

const exerciseType = {
  username: String,
  description: String,
  duration: Number,
  date: String,
  _id: String,
};

const exerciseSchema = new mongoose.Schema(exerciseType);

let User = mongoose.model("User", userSchema);
let Exercise = mongoose.model("Exercise", exerciseSchema);

/*
 * db access functions
 **/

const createAndSaveUser = (name, done) => {
  const user = new User({
    name,
  });
  user.save((err, createdUser) => handleCallback(done, err, createdUser));
};

const findUsersByName = (userName, done) => {
  const filter = { name: userName };
  User.find(filter, (err, foundUsers) => handleCallback(done, err, foundUsers));
};

const findUserById = (userId, done) => {
  User.findById({ _id: userId }, (err, foundUser) =>
    handleCallback(done, err, foundUser),
  );
};

const createAndSaveExercise = (
  { username, description, duration, date, userId },
  done,
) => {
  const exercise = new Exercise({
    _id: userId,
    username,
    description,
    duration,
    date,
  });
  exercise.save((err, savedExercise) =>
    handleCallback(done, err, savedExercise),
  );
};

const findExercisesById = (userId, done) => {
  const filter = { _id: userId };
  Exercise.find(filter, (err, foundExercises) =>
    handleCallback(done, err, foundExercises),
  );
};

/* helper functions */

const handleCallback = (done, err, data) => {
  logErr(err);
  done(null, data);
};

const logErr = (err) => {
  if (err) console.log(err);
};

/*
 * exports
 **/

export { createAndSaveUser, findUsersByName, findUserById };
