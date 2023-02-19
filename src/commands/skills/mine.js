require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function async (user, message) {

    const playerStats = require("../../schema.js")

    const mongoMine = async () => {
        
        ore = {
            xp: 0,
            value: 0,
            type: "undefined",
            message: " ",
            cooldown: 10800000,
        }

        let i = Math.floor(Math.random() * 100)

        switch (true) {
            case (55 <= i && i < 100):
                ore.xp = 20
                ore.type = "rock"
              break;
            case (10 <= i && i < 55):
                ore.xp = 100
                ore.type = "copper";
              break;
            case (0 <= i && i < 5):
                ore.xp = 200
                ore.type = "iron";
              break;
            case (5 <= i && i < 10):
                ore.xp = 250
                ore.type = "gold";
              break;
            default:
              console.log('Enjoy your meal');
          }

          let v = Math.floor(Math.random() * 100)

          switch (true) {
            case (75<=v && v<100):
                ore.value = 0
              break;
            case (65<=v && v<75):
                ore.value= 100
              break;
            case (30<=v && v<65):
                ore.value = 50
              break;
            case (0<=v && v<30):
                ore.value = 20
              break;
            default:
              console.log('Enjoy your meal');
          }

        //MONGO DATENBANK WIRD DURCHSUCHT OB USERDATEN VORHANDEN SIND
        let userData = await playerStats.findOne({ _id: user.id })


        //USER DATEN NOCH NICHT VORHANDEN -> ES WERDEN NEUE ERSTELLT
        if (!userData) {
            const createdData = new playerStats({
                _id: user.id,
                _name: user.username,
            })
            await createdData.save().catch(e => console.log(e)).then(
                await playerStats.findOne({ _id: user.id })).then (userDataNew => {
                      if (ore.value !== 0) {
                        ore.message = ` and **${Math.floor(ore.value * ((userDataNew.skills.mine.level / 100) + 1))} silver**`
                      }
                      userDataNew.updateOne({ $inc: {"skills.mine.xp": Math.ceil(ore.xp * ((userDataNew.skills.mine.level / 100) + 1)), silver: Math.floor(ore.value * ((userDataNew.skills.mine.level / 100) + 1)), "skills.mine.counter": 1}})
                      playerStats.findOne({ _id: user.id }).then(userDataNew => {
                      message.channel.send(`⛏️ | You swing your pickaxe and strike **${ore.type}** gaining **${Math.ceil(ore.xp * ((userDataNew.skills.mine.level / 100) + 1))}xp**${ore.message}`)
                      if (userDataNew.skills.mine.level * 1000 <= userDataNew.skills.mine.xp) {
                        userDataNew.updateOne({ $inc: {"skills.mine.level": 1}})
                        userDataNew.updateOne({ $set: {"skills.mine.xp": 0}})
                        playerStats.findOne({ _id: user.id }).then(userDataNew => {
                          message.channel.send(`🎉 | You just leveled up! Your new mining level is: **Level ${userDataNew.skills.mine.level}** (+${userDataNew.skills.mine.level}% value)`)
                        })
                    }
                    
                })

            return})

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            if (message.createdTimestamp - (Date.parse(userData.skills.mine.timer)) >= ore.cooldown) {
              await userData.updateOne({ $set: {"skills.mine.counter": 0}})
              userData = await playerStats.findOne({ _id: user.id })
            }
            if (ore.value !== 0) {
              ore.message = ` and **${Math.floor(ore.value * ((userData.skills.mine.level / 100) + 1))} silver**`
            }
            if (userData.skills.mine.counter < 200/* && message.createdTimestamp - (Date.parse(userData.skills.mine.timer)) >= ore.cooldown*/) {
              await userData.updateOne({ $inc: {"skills.mine.xp": Math.ceil(ore.xp * ((userData.skills.mine.level / 100) + 1)), silver: Math.floor(ore.value * ((userData.skills.mine.level / 100) + 1)), "skills.mine.counter": 1}})
              await userData.updateOne({ $set: {"skills.mine.timer": message.createdAt}})
              userData = await playerStats.findOne({ _id: user.id })
              message.channel.send(`⛏️ | You swing your pickaxe and strike **${ore.type}** gaining **${Math.ceil(ore.xp * ((userData.skills.mine.level / 100) + 1))}xp**${ore.message}`)
              if (userData.skills.mine.level * 1000 <= userData.skills.mine.xp) {
                await userData.updateOne({ $inc: {"skills.mine.level": 1}})
                await userData.updateOne({ $set: {"skills.mine.xp": 0}})
                userData = await playerStats.findOne({ _id: user.id })
                message.channel.send(`🎉 | You just leveled up! Your new mining level is: **Level ${userData.skills.mine.level}** (+${userData.skills.mine.level}% value)`) 
              }
            } else if (userData.skills.mine.counter >= 200 && message.createdTimestamp - (Date.parse(userData.skills.mine.timer)) < ore.cooldown) {
              userData = await playerStats.findOne({ _id: user.id })
              message.channel.send(`⛏️ | Your pickaxe is currently depleted, you can use it again in **${Math.floor((ore.cooldown - (message.createdTimestamp - (Date.parse(userData.skills.mine.timer)))) / 1000 / 60 / 60)} hours, ${Math.floor((ore.cooldown - (message.createdTimestamp - (Date.parse(userData.skills.mine.timer)))) / 1000 / 60 % 60)} minutes**!`)
            }

        }
        return
    }
    
    mongoMine();
}

 