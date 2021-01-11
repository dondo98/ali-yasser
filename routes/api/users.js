// Dependencies
const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

//Get All Users
router.get("/", userController.getAllUsers);

//Get Specific User
router.get("/:id", userController.getUser);

//Create
router.post("/", userController.createUser);

//Update
router.put("/:id", userController.updateUser);

//Delete
router.delete("/:id", userController.deleteUser);

//Search
router.post("/search/:id/:searchQuery", userController.search);

// get Favourite Articles
router.get("/favouriteArticles/:id", userController.getFavoriteArticles);

// update Favourite Articles
router.put("/favouriteArticles/:id", userController.updateFavouriteArticles);

// get Favourite Authors
router.get("/favouriteAuthors/:id", userController.getFavoriteAuthors);

// update FavouriteAuthors
router.put("/favouriteAuthors/:id", userController.updateFavouriteAuthors);

// recommend Articles
router.get("/recommend/:id", userController.recommend);

// login
router.post("/login", userController.login);

module.exports = router;
