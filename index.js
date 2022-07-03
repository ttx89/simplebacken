const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./models");

const itemModel = require("./items"); //items
const reviewModel = require("./reviews"); //review
const grabbeditemModel = require("./grabbeditems"); //grabbeditem
const wisheditemModel = require("./wisheditems"); //grabbeditem

const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
// const port = 3001; // Must be different than the port of the React app
const port = process.env.PORT || 3001;

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

app.use(cors()); // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(express.json()); // Allows express to read a request body
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/items", async (req, res) => {
  const itemname = req.body.itemname;
  const username = req.body.username;
  const expiredate = req.body.expiredate;
  const address = req.body.address;
  const description = req.body.description;
  const isActive = req.body.isActive;
  const winner = req.body.winner;
  const item = {
    itemname: itemname,
    username: username,
    expiredate: expiredate,
    address: address,
    description: description,
    isActive: isActive,
    winner: winner,
  };
  await itemModel.create(item);
  res.send(item);
});

app.get("/items", async (req, res) => {
  const item = await itemModel.find();
  res.send(item);
});

app.delete("/items/delete/:id", async (req, res) => {
  const id = req.params.id;
  const results = await itemModel.deleteOne({ _id: id });
  res.send(results);
});

// fang
app.get("/items/:username", async (req, res) => {
  const username = req.params.username;
  const item = await itemModel.find({ username: username });
  res.send(item);
});

app.get("/items/edit/:id", async (req, res) => {
  const id = req.params.id;
  const item = await itemModel.findOne({ _id: id });
  res.send(item);
});

app.put("/items/edit/:id", async (req, res) => {
  const id = req.params.id;
  const itemname = req.body.itemname;
  const username = req.body.username;
  const expiredate = req.body.expiredate;
  const address = req.body.address;
  const description = req.body.description;
  const isActive = req.body.isActive;
  const winner = req.body.winner;
  const item = {
    itemname: itemname,
    username: username,
    expiredate: expiredate,
    address: address,
    description: description,
    isActive: isActive,
    winner: winner,
  };
  const results = await itemModel.replaceOne({ _id: id }, item);
  res.send(results);
});
// fang end

app.get("/items/active", async (req, res) => {
  const active = req.query.active;
  const items = await userModel.find({ active: active });
  res.send(items);
});

app.put("/items/grab", async (req, res) => {
  const id = req.body.id;
  const item = await itemModel.updateOne(
    { _id: id },
    { $set: { winner: req.body.userInfo, isActive: false } }
  );
  res.send(item);
});

app.put("/items/ungrab", async (req, res) => {
  const id = req.body.id;
  const item = await itemModel.updateOne(
    { _id: id },
    { $set: { isActive: true } }
  );
  res.send(item);
});

// review

app.post("/reviews", async (req, res) => {
  const review_id = req.body.review_id;
  const reviewcomments = req.body.reviewcomments;
  const rating = req.body.rating;
  const review = {
    review_id: review_id,
    reviewcomments: reviewcomments,
    rating: rating,
  };
  await reviewModel.create(review);
  res.send(review);
});

app.get("/reviews", async (req, res) => {
  const review = await reviewModel.find();
  res.send(review);
});

// Grabber

app.post("/grabbeditems", async (req, res) => {
  const grabber_name = req.body.userInfo;
  const grabbeditem_id = req.body.id;
  const founditem = await itemModel.findOne({ _id: req.body.id });
  const grabbeditem = {
    grabber_name: grabber_name,
    grabbeditem_id: grabbeditem_id,
    itemname: founditem.itemname,
    username: founditem.username,
    address: founditem.address,
  };
  await grabbeditemModel.create(grabbeditem);
  res.send(grabbeditem);
});


app.post("/wisheditems", async (req, res) => {
  const grabber_name = req.body.userInfo;
  const wisheditem_id = req.body.id;
  const founditem = await itemModel.findOne({ _id: req.body.id });
  const wisheditem = {
    grabber_name: grabber_name,
    wisheditem_id: wisheditem_id,
    itemname: founditem.itemname,
    username: founditem.username,
  };
  await wisheditemModel.create(wisheditem);
  res.send(wisheditem);
});

app.get("/grabbeditems/:userInfo", async (req, res) => {
  const grabbeditems = await grabbeditemModel.find({ grabber_name: req.params.userInfo });
  res.send(grabbeditems);
});


app.get("/grabbeditems/", async (req, res) => {
  const allgrabbeditems = await grabbeditemModel.find();
  res.send(allgrabbeditems);
});

app.delete("/grabbeditems/:id", async (req, res) => {
  const results = await grabbeditemModel.deleteOne({ grabbeditem_id : req.params.id });
  // console.log(results);
  res.send(results);
});

app.get("/wisheditems/:userInfo", async (req, res) => {
  const wisheditems = await wisheditemModel.find({ grabber_name: req.params.userInfo });
  console.log(req.body.userInfo);
  res.send(wisheditems);
});

app.get("/wisheditems/", async (req, res) => {
  const allwisheditems = await wisheditemModel.find();
  res.send(allwisheditems);
});

app.delete("/wisheditems/:id", async (req, res) => {
  const results = await wisheditemModel.deleteOne({ wisheditem_id : req.params.id });
  console.log("delete wished id " + req.params.id);
  res.send(results);
});


////////////////////////////////////
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
