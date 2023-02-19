const mongoose = require("mongoose")

const stats = mongoose.Schema({
  // User Info
  _id: {
    type: String,
    required: true
  },

  _name: {
    type: String,
    required: true,
  },
  // Wins and loses Counter

  status: {
    type: String,
    required: false,
    default: "Kein Status gesetzt.",
  },

  gold: {
    type: Number,
    required: false,
    default: 0,
  },
  
  silver: {
    type: Number,
    required: false,
    default: 0,
  },

  workers: {
    type: Number,
    required: false,
    default: 0,
  },

  guild: {
    type: Number,
    required: false,
    default: 0,
  },

  bankbalance: {
    type: Number,
    required: false,
    default: 0,
  },

  banklevel: {
    type: Number,
    required: false,
    default: 0,
  },

  bankreserve: {
    type: Number,
    required: false,
    default: 0,
  },

  daily: {
    type: Date,
    required: false,
    default: 0,
  },

  reminder: {
    type: Boolean,
    required: false,
    default: false,
  },

  alreadyReminded: {
    type: Boolean,
    required: false,
    default: false,
  },

  skills: {
    mine: {level: {type: Number, required: false, default: 1,},
          xp: {type: Number, required: false, default: 0,},
          counter: {type: Number, required: false, default: 0,},
          timer: {type: Date, required: false, default: 0,}},
    chop: {level: {type: Number, required: false, default: 1,},
          xp: {type: Number, required: false, default: 0,},
          counter: {type: Number, required: false, default: 0,},
          timer: {type: Date, required: false, default: 0,}},
    fish: {level: {type: Number, required: false, default: 1,},
          xp: {type: Number, required: false, default: 0,},
          counter: {type: Number, required: false, default: 0,},
          timer: {type: Date, required: false, default: 0,}},
  },
})

module.exports = mongoose.model("playerStats", stats)