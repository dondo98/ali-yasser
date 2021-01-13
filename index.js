/*const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const users = require("./routes/api/users");
//Require Route Handlers

// Passport Config
require("./config/passport")(passport);

const app = express();

app.use(cors());

//Getting Mongo's connection URI
const db = require("./config/keys").mongoURI;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

//Connecting to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Use Route Handlers
app.use("/api/users", users);

//production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  //Homepage
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("Homepage"));
}

// Handling 404
app.use((req, res) => {
  res.status(404).send({ err: "We can not find what you are looking for" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
*/