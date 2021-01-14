const validator = require("../validations/userValidations");
const User = require("../models/User");
const Match = require("../models/Match")
const Stadium = require("../models/Stadium")
const Ticket = require("../models/Ticket")


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

    if(newUser.role=="siteAdminstrator")
    {
      newUser.approved=true;
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
    if(!user.approved) return res.status(404).send({ error: "You're still not approved" });
    if(!req.body.stadium_id) return res.status(404).send({error:"Missing Stadium Details "});
    const stadiumObj= await Stadium.findById( req.body.stadium_id)
    if(!stadiumObj) return res.status(404).send({error:"Stadium does not found "})

    const getMatches = await Match.find({stadium_id:stadiumObj._id})

    var datetimeMatch=req.body.datetime
    datetimeMatch=new Date(req.body.datetime)

    const timeOne=(datetimeMatch.getHours()*60)+datetimeMatch.getMinutes()
    const matchDate=datetimeMatch.getFullYear()+'-'+(datetimeMatch.getMonth()+1)+'-'+datetimeMatch.getDate()

    for( var i =0;i<getMatches.length;i++){
      const everyMatch=getMatches[i]
      const everyMatchDate=everyMatch.datetime.getFullYear()+'-'+(everyMatch.datetime.getMonth()+1)+'-'+everyMatch.datetime.getDate()
      if(everyMatchDate==matchDate)
      {
        // check time 
        const timeTwo=(everyMatch.datetime.getHours()*60)+everyMatch.datetime.getMinutes()
        const diffTime=Math.abs(timeTwo-timeOne)
        if(diffTime<=180) return res.status(404).send({ error: "There is a match in that stadium which conflict in that time " });
      }
    }

    const rows=stadiumObj.rows
    const columns=stadiumObj.columns
    var stadiumArray=new Array(rows)
    for( var i =0;i<stadiumArray.length;i++){
        stadiumArray[i]=new Array(columns)
        for(var j=0;j<columns;j++)
        {
          stadiumArray[i][j]=false
        }
    }
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
    const id = req.params.user_id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    if(user.role!="manager") return res.status(404).send({ error: "UnAuthorized Action" });
    if(!user.approved) return res.status(404).send({ error: "You're still not approved" });
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
    if(!user.approved) return res.status(404).send({ error: "You're still not approved" });
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


exports.bookTicket = async function(req, res) {
  try {
    const id = req.params.user_id;
    const user = await User.findOne({ _id: id });
    const match_id=req.params.match_id;
    if (!user) return res.status(404).send({ error: "user does not exist" });
    if(user.role!="fan") return res.status(404).send({ error: "UnAuthorized Action" });
    if(!user.approved) return res.status(404).send({error: "You're still unAuthorized"});
    const match = await Match.findOne({ _id: match_id });
    if(!match) return res.status(404).send({ error: "match does not exist" });
    const x = req.body.x
    const y = req.body.y
    if(!req.body.x||!req.body.y)
    {
      return res.status(404).send({ error: "missing location in body" });
    }
    if(match.stadiumArray[x][y]) return res.status(404).send({ error: "That location already reserved to someone else " });

    const getMyBookedTickets= await Ticket.find({user_id:id})
    const matchDate=match.datetime.getFullYear()+'-'+(match.datetime.getMonth()+1)+'-'+match.datetime.getDate()
    const timeOne=(match.datetime.getHours()*60)+match.datetime.getMinutes()
    for(var i =0;i<getMyBookedTickets.length;i++){
      if(getMyBookedTickets[i].match_id==match_id) return res.status(404).send({ error: "you already booked a ticket in that match " }); 
      const everyMatch = await Match.findOne({_id:getMyBookedTickets[i].match_id})
      const everyMatchDate=everyMatch.datetime.getFullYear()+'-'+(everyMatch.datetime.getMonth()+1)+'-'+everyMatch.datetime.getDate()
      if(everyMatchDate==matchDate){
        // check time 
        const timeTwo=(everyMatch.datetime.getHours()*60)+everyMatch.datetime.getMinutes()
        const diffTime=Math.abs(timeTwo-timeOne)
        if(diffTime<=90) return res.status(404).send({ error: "you already booked a match at that time " });
      }
    }

    var stadiumArray=match.stadiumArray
    stadiumArray[x][y]=true
    var createdTicket={
      bookingdate:new Date(),
      user_id:id,
      match_id:match_id,
      x:x,
      y:y,
      creditnumber:req.body.creditnumber,
      pinnumber:req.body.pinnumber
    }
    await Ticket.create(createdTicket)
    await Match.findByIdAndUpdate(match_id, {stadiumArray});
    res.send({ msg: "Ticket is created succesfully " });
  } catch (error) {
    res.status(404).send({ error: "ticket is not created due to error " });
  }
};

exports.deleteTicket = async function(req, res) {
  try {
    const id = req.params.user_id;
    const ticket_id=req.params.ticket_id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).send({ error: "user does not exist" });
    const ticket = await Ticket.findOne({_id:ticket_id,user_id:id});
    if (!ticket)  return res.status(404).send({error: "Ticket not found"});
    const currentDate=new Date()
    const match=await Match.findOne({_id:ticket.match_id})
    const matchDate=match.datetime
    if(dateDiffInDays(currentDate,matchDate)<3)
      return res.status(400).send({error:"Ticket can not be cancelled because the match will start in less than 3 days"})
    
    const x = ticket.x
    const y = ticket.y 
    var stadiumArray=match.stadiumArray
    stadiumArray[x][y]=false

    await Ticket.findByIdAndRemove(ticket_id)
    await Match.findByIdAndUpdate(match._id,{stadiumArray})
    res.send({ msg: "Ticket was deleted successfully" }); 
  } catch (error) {
    res.status(404).send({ error: "error occurred while deleting the user" });
  }
};

//login f13 
exports.login =async function(req, res, next) {
  try{
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username:username, password: password},function(err,user){
      if(err){
        console.log(err)
        return res.status(500).send();
      }
      if(!user)
      {
        return res.status(404).send("username or password is incorrect");
      }
      return res.status(200).send("login successfully");
    })
  } catch (error)
  {
    res.status(404).send({ error: "error occurred while logging in" });
  }
 
};
function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}