const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./models");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const port = 3001; // Must be different than the port of the React app
// const port = process.env.PORT || 3001;

const dbName = "myFirstDb"; //set dbName as "exercise" also work,because have 2 databases in Mongodb

app.use(cors());
app.use(express.json()); // Allows express to read a request body

mongoose.connect(
  // "mongodb+srv://mongouser:" + process.env.MONGODB_PWD + "@cluster0.omwq8.mongodb.net/" +
  // dbName +"?retryWrites=true&w=majority",
  // mongodb+srv://mongouser:<password>@cluster0.omwq8.mongodb.net/<nameOfDatabase>?retryWrites=true&w=majority

  "mongodb+srv://exercise:" +
    process.env.MONGODB_PWD +
    "@cluster0.9az9heg.mongodb.net/" +
    dbName +
    "?retryWrites=true&w=majority",

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.post("/users/register", async (request, response) => {
  // const id = request.body.id;
  const username = request.body.username;
  const password = request.body.password;
  try {
    if (
      username &&
      validator.isAlphanumeric(username) &&
      password &&
      validator.isStrongPassword(password)
    ) {
      // Check to see if the user already exists. If not, then create it.

      const user = await userModel.findOne({ username: username });
      if (user) {
        const msg =
          "Invalid registration - username " + username + " already exists.";
        console.log(msg);
        response.send({ success: false, msg: msg });
        return;
      } else {
        hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Registering username " + username);
        const userToSave = { username: username, password: hashedPassword };
        await userModel.create(userToSave);
        response.send({ success: true });
        return;
      }
    }
  } catch (error) {
    console.log(error.message);
    response.send({ success: false, msg: error.message });
    return;
  }
  response.send({ success: false, msg: "Invalid username or password" });
});

app.post("/users/login", async (request, response) => {
  const username = request.body.username;
  const password = request.body.password;
  try {
    if (username && password) {
      // Check to see if the user already exists. If not, then create it.
      const user = await userModel.findOne({ username: username });

      if (!user) {
        const msg = "Invalid login - username " + username + " doesn't exist.";
        console.log(msg);
        response.send({ success: false, msg: msg });
        return;
      } else {
        const isSame = await bcrypt.compare(password, user.password);
        if (isSame) {
          console.log("Successful login");
          response.send({ success: true });
          return;
        } else {
          response.send({
            success: false,
            msg: "Password did not match.",
          });
          return;
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    response.send({ success: false, msg: error.message });
    return;
  }
  response.send({ success: false, msg: "Username and/or password was empty" });
});

// Configuring body parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/users", async (req, res) => {
  const user = await userModel.find();
  res.send(user);
});

app.post("/users", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = {
    username: username,
    password: password,
  };
  await userModel.create(user);
  res.send(user);
});

app.get("/user", async (req, res) => {
  const username = req.query.username;
  const user = await userModel.findOne({ username: username });
  res.send(user);
});

app.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  const user = await userModel.findOne({ username: username });
  res.send(user);
});

/* An API post request using body to get user /users/get */
app.post("/users/get", async (req, res) => {
  const username = req.body.username;
  const user = await userModel.findOne({ username: username });
  res.send(user);
});

/* An API post request using body /users.  Replaces the entire user. */
app.put("/users", async (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  const user = {
    username: username,
    password: password,
  };
  const results = await userModel.replaceOne({ username: username }, user);
  console.log("matched: " + results.matchedCount);
  console.log("modified: " + results.modifiedCount);
  res.send(results);
});

/* An API post request using body /users/username that changes a single field */
app.patch("/users/:username/password", async (req, res) => {
  const username = req.params.username;
  const password = req.body.password;
  const results = await userModel.updateOne(
    { username: username },
    { password: password }
  );
  console.log("matched: " + results.matchedCount);
  console.log("modified: " + results.modifiedCount);
  res.send(results);
});

/* An API delete request using URL path parameters to /users/:username */
app.delete("/users/:username", async (req, res) => {
  const username = req.params.username;
  const results = await userModel.deleteOne({ username: username });
  res.send(results);
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
