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
    type: datetime,
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
  // foreign key mn stadium  
  stadiumArray:{
    type:[{
      rows: {
        type:[{
          columns:{
            type:Boolean,
            required:false
          }
        }],
        required: true
      }
    }]
  }

});

module.exports = User = mongoose.model("Match", MatchSchema);
