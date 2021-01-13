// Dependencies
const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

//Create A User
router.post('/register',userController.registerUser);

router.get("/getAllFans/:user_id", userController.getALlFans);

//Get Specific User
router.post("/approveUser/:user_id/:id", userController.approveUser);

//Create
router.delete("/deleteUser/:user_id/:id", userController.deleteUser);

//create and update match
router.post('/createMatch/:user_id',userController.createMatchEvent);
router.put("/updateMatch/:user_id/:id", userController.updateMatchEvent);

//create Stadium
router.post("/createStadium/:user_id", userController.createStadium);

// get match details 
router.get("/getMatchDetails/:id",userController.getMatchDetails);

// update user 
router.put("/updateUser/:id",userController.updateUser);

// get matches details 
router.get("/getMatchesDetails",userController.getMatchesDetails);


router.post("/bookTicket/:user_id/:match_id",userController.bookTicket);

router.delete("/cancelTicket/:user_id/:ticket_id",userController.deleteTicket)

// login
router.post("/login", userController.login);

module.exports = router;
