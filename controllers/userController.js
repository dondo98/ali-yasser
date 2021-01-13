const validator = require("../validations/userValidations");
const User = require("../models/User");
const Match = require("../models/Match")
const Stadium = require("../models/Stadium")

// create user
async function checkUniqueEmail(email) {
  const existingUser = await User.findOne({ email: email });
  if (existingUser) return false;
  return true;
}
async function checkUniqueUserName(username) {
  const existingUser = await User.findOne({ username: username });
  if (existingUser) return false;
  return true;
}
// F12
exports.registerUser = async function(req, res) {
  const newUser = new User(req.body);
  console.log(newUser)
  try {
    const isValidated = validator.createValidation(req.body);
    if (isValidated.error) {
      res.status(400).send({ error: isValidated.error.details[0].message });
      return;
    } 
    const isUniqueEmail = await checkUniqueEmail(req.body.email);
    if (!isUniqueEmail)
    {
      return res
        .status(400)
        .send({ error: `email ${req.body.email} is already taken!` });
        req.body.password = bcrypt.hashPassword(req.body.password);
    }
    const isUniqueUsername = await checkUniqueUserName(req.body.username);
    if (!isUniqueUsername)
    {
      return res
        .status(400)
        .send({ error: `Username ${req.body.username} is already taken!` });
        req.body.password = bcrypt.hashPassword(req.body.password);
    }

    const user = await newUser.save();
    if(!user) throw Error("Something Went Wrong");
    /*res.status(200).json(user);*/
    res.status(200).send({ msg: "User was created successfully", data: user });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong" });
  }
};
// does not represented in the documentation but need. 
exports.getALlFans = async function(req, res) {
  try {
    const id = req.params.user_id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    if(user.role!="siteAdminstrator") return res.status(404).send({ error: "UnAuthorized Action" });
    const fans= await User.find({role:"fan"});
    res.send({ data: fans });
  } catch (error) {
    res.status(404).send({ error: "error occurred fetching fans" });
  }
};

// F1: Approve new users as an authority.
exports.approveUser = async function(req, res) {
  try {
    const id = req.params.user_id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    if(user.role!="siteAdminstrator") return res.status(404).send({ error: "UnAuthorized Action" });
    const userToBeApproved = await User.findOne({ _id: req.params.id });
    if(!userToBeApproved) return res.status(404).send({ error: "user to be approved does not exist" });
    await User.findByIdAndUpdate(userToBeApproved._id, {
      approved:true
    });
    res.send({ msg: "user updated successfully" });
  } catch (error) {
    res.status(404).send({ error: "user can not be updated due to error " });
  }
};
//F2: Remove an existing user.
exports.deleteUser = async function(req, res) {
  try {
    const id = req.params.user_id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    if(user.role!="siteAdminstrator") return res.status(404).send({ error: "UnAuthorized Action" });
    const userToBeDelete = await User.findOne({ _id: req.params.id });
      const deletedUser = await User.findByIdAndRemove(userToBeDelete._id);
      res.send({ msg: "user was deleted successfully", data: deletedUser }); 
  } catch (error) {
    res.status(404).send({ error: "error occurred while deleting the user" });
  }
};
// F3: Create a new match event
exports.createMatchEvent = async function(req, res) {
  try {
    const id = req.params.user_id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    if(user.role!="manager") return res.status(404).send({ error: "UnAuthorized Action" });
    if(!req.body.stadium_id) return res.status(404).send({error:"Missing Stadium Details "});
    const stadiumObj= await Stadium.findById( req.body.stadium_id)
    if(!stadiumObj) return res.status(404).send({error:"Stadium does not found "})
    const rows=stadiumObj.rows
    const columns=stadiumObj.columns
    var stadiumArray=[]
    for(var i=0;i<rows;i++){
      row={columns:[]}
      stadiumArray[i]={row}
      for(var j=0;j<columns;j++){
        stadiumArray[i].row.columns[j]=false
      }
    }
    console.log(stadiumArray) 
    req.body.stadiumArray=stadiumArray
    const newMatch = await Match.create(req.body);
    res.send({ msg: "Match was created successfully", data: newMatch });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong" });
  }
};
// F4: Edit the details of an existing match.
exports.updateMatchEvent = async function(req, res) {
  try {
    // ************** update body with 2d array of booleans depending on the stadium  rows and columns 
    const id = req.params.user_id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    if(user.role!="manager") return res.status(404).send({ error: "UnAuthorized Action" });
    const matchToBeUpdated = await Match.findOne({ _id: req.params.id });
    if(!matchToBeUpdated) return res.status(404).send({ error: "match to be updated does not exist" });
    await Match.findByIdAndUpdate(matchToBeUpdated._id, req.body);
    res.send({ msg: "match updated successfully" });
  } catch (error) {
    res.status(404).send({ error: "match can not be updated due to error " });
  }
};
// F5 
exports.createStadium = async function(req, res) {
  try {
    const id = req.params.user_id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    if(user.role!="manager") return res.status(404).send({ error: "UnAuthorized Action" });
    const newStadium = await Stadium.create(req.body);
    res.send({ msg: "Stadium was created successfully", data: newStadium });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong" });
  }
};
// get match details F6 
exports.getMatchDetails = async function(req, res) {
  try {
    const id = req.params.id;
    const match = await Match.findOne({ _id: id });
    if (!match) return res.status(404).send({ error: "user does not exist" });
    res.send({ data: match });
  } catch (error) {
    res.status(404).send({ error: "match does not exist" });
  }
};
// update user  F8 
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
    const firstname = req.body.firstname;
    const lastname = req.body.las;
    const birthdate = req.body.password;
    const gender = req.body.gender;
    const city = req.body.city;
    const address = req.body.address;
    const role = user.role;
    const approved = user.approved;
    req.body.username=user.username
    await User.findByIdAndUpdate(id, req.body);
    res.send({ msg: "user updated successfully" });
  } catch (error) {
    res.status(404).send({ error: "user does not exist" });
  }
};
// get matches details F14 F9   
exports.getMatchesDetails = async function(req, res) {
  try {
    const matches= await Match.find();
    if (!matches) return res.status(404).send({ error: "matches does not exist" });
    res.send({ data: matches });
  } catch (error) {
    res.status(404).send({ error: "matches does not exist" });
  }
};

//login f13 
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
