
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  hometeam: {
    type: String,
    required: true
  },
  awayteam: {
    type: String,
    required: true
  },
  matchvenue: {
    type: String,
    required: true
  },
  datetime:{
    type: Date,
    required: true
  },
  mainreferee:{
    type: String,
    required: true
  },
  lineone:{
    type: String,
    required: true
  },
  linetwo:{
    type: String,
    required: true
  },
  stadium_id:{
    type: Schema.Types.ObjectId, ref: 'Stadium'
},
  stadiumArray:[
    {
      type:Array  
    }
  ]

});

module.exports = User = mongoose.model("Match", MatchSchema);
