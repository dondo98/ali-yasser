const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StadiumSchema = new Schema({
  rows: {
    type: Integer,
    required: true
  },
  columns: {
    type: Integer,
    required: true
  },

});

module.exports = User = mongoose.model("Stadium", StadiumSchema);
