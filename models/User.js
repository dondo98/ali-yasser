const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  firstname:{
    type: String,
    required: true
  },
  lastname:{
    type: String,
    required: true
  },
  birthdate:{
    type: Date,
    required: true
  },
  gender:{
    type: String,
    required: true
  },
  city:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: false
  },
  role:{
    type: String,
    required: true
  },
  approved:{
    type:Boolean,
    required:false,
    default:false
  }

});

module.exports = User = mongoose.model("User", UserSchema);
