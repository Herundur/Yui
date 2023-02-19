require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function (client) {

    const playerStats = require("../schema.js")

    const reminderFkn = async (data) => { 
      if (Date.parse(data.daily) + 43200000 <= Date.now() && data.alreadyReminded === false) {
 
          client.channels.cache.get("684055460302946320").send(`❗<@${data._id}> **yui daily** ist wieder möglich.❗`)

          person = await playerStats.findOne({ _id: data._id })

          await person.updateOne({ $set: {alreadyReminded: true}})
      }
    }


    setInterval( async function() {
      try {
 
        let userData = await playerStats.find({ reminder: true })
       
        userData.forEach(data => reminderFkn(data))
   

        
          } catch (error) {
              console.error('Something went wrong when fetching the message:', error);
              return;
      }
  }, 300 * 1000);
    
}