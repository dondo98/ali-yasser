const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StadiumSchema = new Schema({
  rows: {
    type: Number,
    required: true
  },
  columns: {
    type: Number,
    required: true
  },
  name:{
    type:String,
    required:true
  }

});

module.exports = User = mongoose.model("Stadium", StadiumSchema);
