
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  bookingdate:{
    type: Date,
    required: true
  },
  user_id:{
    type: Schema.Types.ObjectId, ref: 'User'
   },
   match_id:{
    type: Schema.Types.ObjectId, ref: 'Match'
   },
   x:{
    type: Number,
    required: true
  },
  y:{
    type: Number,
    required: true
  },
  creditnumber:{
    type: Number,
    required: true
  },
  pinnumber:{
    type: Number,
    required: true
  },

});

module.exports = User = mongoose.model("Ticket", TicketSchema);
