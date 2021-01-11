const validator = require("../validations/userValidations");
const bcrypt = require("../routes/api/utils/encryption.js");
const newsURI = require("../config/keys_dev").newsURI;
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(newsURI);
const passport = require("passport");
const tokenKey = require("../config/keys_dev").secretOrKey;
const jwt = require("jsonwebtoken");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const User = require("../models/User");

// get All Users
exports.getAllUsers = async function(req, res) {
  const users = await User.find();
  res.send({ data: users });
};
// get user
exports.getUser = async function(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    res.send({ data: user });
  } catch (error) {
    res.status(404).send({ error: "user does not exist" });
  }
};
// create user

async function checkUniqueEmail(email) {
  const existingUser = await User.findOne({ email: email });
  if (existingUser) return false;
  return true;
}

exports.createUser = async function(req, res) {
  try {
    const isValidated = validator.createValidation(req.body);
    if (isValidated.error) {
      res.status(400).send({ error: isValidated.error.details[0].message });
      return;
    }
    const isUniqueEmail = await checkUniqueEmail(req.body.email);
    if (!isUniqueEmail)
      return res
        .status(400)
        .send({ error: `email ${req.body.email} is already taken!` });
    req.body.password = bcrypt.hashPassword(req.body.password);
    const newUser = await User.create(req.body);
    res.send({ msg: "User was created successfully", data: newUser });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong" });
  }
};

// update user  password only
exports.updateUser = async function(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).send({ error: "user does not exist" });
      return;
    }
    if (!req.body.password) {
      req.body.password = user.password;
    } else {
      req.body.password = bcrypt.hashPassword(req.body.password);
    }
    const email = user.email;
    const username = user.username;
    const password = req.body.password;
    const favoriteArticles = user.favoriteArticles;
    const favoriteAuthors = user.favoriteAuthors;
    const topicsHistory = user.topicsHistory;
    const isValidated = validator.updateValidation(req.body);
    if (isValidated.error) {
      res.status(400).send({ error: isValidated.error.details[0].message });
      return;
    }
    await User.findByIdAndUpdate(id, {
      email,
      password,
      username,
      favoriteArticles,
      favoriteAuthors,
      topicsHistory
    });
    res.send({ msg: "user updated successfully" });
  } catch (error) {
    res.status(404).send({ error: "user does not exist" });
  }
};

// delete User
exports.deleteUser = async function(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).send({ error: "user does not exist" });
      return;
    }
    const deletedUser = await User.findByIdAndRemove(id);
    res.send({ msg: "user was deleted successfully", data: deletedUser });
  } catch (error) {
    res.status(404).send({ error: "user does not exist" });
  }
};

// Search
exports.search = async function(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).send({ error: "user does not exist" });
      return;
    }
    let topicsHistory = user.topicsHistory;
    let flag = true;
    for (let i = 0; i < topicsHistory.length; i++)
      if (topicsHistory[i] === req.params.searchQuery) flag = false;
    if (flag) {
      topicsHistory.push(req.params.searchQuery);
      await User.findByIdAndUpdate(id, {
        topicsHistory
      });
    }
    let date = new Date();
    let from =
      date.getFullYear() + "-" + date.getMonth() + "-" + date.getUTCDate(); // handle this more precisely
    let to =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getUTCDate();
    try {
      newsapi.v2
        .everything({
          q: req.params.searchQuery,
          sources: "",
          domains: "",
          from: from,
          to: to,
          language: "en",
          sortBy: "relevancy",
          page: 2
        })
        .then(response => {
          res.json({ data: response });
        });
    } catch (error) {
      res.status(404).send({ error: "failed to search" });
    }
  } catch (error) {
    res.status(404).send({ error: "user does not exist" });
  }
};

// get Favourite Articles
exports.getFavoriteArticles = async function(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    res.send({ data: user.favoriteArticles });
  } catch (error) {
    res.status(404).send({ error: "user does not exist" });
  }
};

// get favourite Authors
exports.getFavoriteAuthors = async function(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    res.send({ data: user.favoriteAuthors });
  } catch (error) {
    res.status(404).send({ error: "user does not exist" });
  }
};

// update Favourite Articles
exports.updateFavouriteArticles = async function(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).send({ error: "user does not exist" });
      return;
    }
    const newFavourite = req.body;

    var favoriteArticles = user.favoriteArticles;
    var flag = true;
    for (var i = 0; i < favoriteArticles.length; i++) {
      let count = 0;
      if (favoriteArticles[i].author === newFavourite.author) count++;
      if (favoriteArticles[i].title === newFavourite.title) count++;
      if (favoriteArticles[i].description === newFavourite.description) count++;
      if (favoriteArticles[i].url === newFavourite.url) count++;
      if (favoriteArticles[i].urlToImage === newFavourite.urlToImage) count++;
      if (favoriteArticles[i].publishedAt === newFavourite.publishedAt) count++;
      if (favoriteArticles[i].content === newFavourite.content) count++;
      if (count === 6) flag = false;
    }

    if (flag) {
      favoriteArticles.push(newFavourite);

      await User.findByIdAndUpdate(id, {
        favoriteArticles
      });
    }
    res.send({ msg: "favourite article updated successfully" });
  } catch (error) {
    res.status(404).send({ error: "does exist" });
  }
};

// update Favourite Authors
exports.updateFavouriteAuthors = async function(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).send({ error: "user does not exist" });
      return;
    }
    const newFavourite = req.body.author;

    var favoriteAuthors = user.favoriteAuthors;
    var flag = true;
    for (var i = 0; i < favoriteAuthors.length; i++)
      if (favoriteAuthors[i] === newFavourite) flag = false;

    if (flag) {
      favoriteAuthors.push(newFavourite);

      await User.findByIdAndUpdate(id, {
        favoriteAuthors
      });
    }
    res.send({ msg: "favourite authors  updated successfully" });
  } catch (error) {
    res.status(404).send({ error: " does exist" });
  }
};

// recommend
exports.recommend = async function(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    const topicsHistory = user.topicsHistory;
    var recommededArticles = await searchForRecommendations(topicsHistory);
    res.send({ data: recommededArticles });
  } catch (error) {
    res.status(404).send({ error: " error" });
  }
};

// Search
searchForRecommendations = async function(topicsHistory) {
  try {
    let recommededArticles = [];
    var temp = topicsHistory.map(obj => {
      let date = new Date();
      let from =
        date.getFullYear() + "-" + date.getMonth() + "-" + date.getUTCDate(); // handle this more precisely
      let to =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getUTCDate();
      try {
        const Http = new XMLHttpRequest();
        const url =
          "https://newsapi.org/v2/top-headlines?" +
          "q=" +
          obj +
          "&" +
          "from=" +
          from +
          "&" +
          "sortBy=popularity&" +
          "apiKey=" +
          newsURI;
        Http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            recommededArticles.push(JSON.parse(Http.responseText));
          }
        };
        Http.open("GET", url, false);
        Http.send();
      } catch (error) {}
    });
    return recommededArticles;
  } catch (error) {
    res.status(404).send({ error: "user does not exist" });
  }
};

//login
exports.login = function(req, res, next) {
  passport.authenticate("users", async function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({ error: "User not found" });
    }
    req.logIn(user, async function(err) {
      try {
        if (err) {
          return next(err);
        }
        var user = await User.where("email", req.body.email);

        const payload = {
          id: user[0]._id,
          email: user[0].email,
          type: "user"
        };

        const token = jwt.sign(payload, tokenKey, { expiresIn: "1h" });
        res.json({ data: `Bearer ${token}` });
        return res.json({ data: "Token" });
      } catch (err) {
        return err;
      }
    });
  })(req, res, next);
};
