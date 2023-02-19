require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function async (user, message) {

    const playerStats = require("../../schema.js")

    const mongoWorker = async () => {

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
                    if (userDataNew.silver >= Math.ceil(1200 * userDataNew.guild + 1000)) {
                        userDataNew.updateOne({ $inc: {guild: 1, silver: -Math.ceil(1200 * userDataNew.guild + 1000)}})
                        playerStats.findOne({ _id: user.id }).then(userDataNew => {
                            message.channel.send(`📈 | Your lodging has been upgraded to **level ${userDataNew.guild}**!`)
                        })
                    } else if (userDataNew.silver < Math.ceil(1200 * userDataNew.guild + 1000)) {
                        message.channel.send(`❗️| You do not have enough **silver**.`)
                }
                    
                })

            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })
                // SILVER ZU GOLD
            if (userData.silver >= Math.ceil(1200 * userData.guild + 1000)) {

                await userData.updateOne({ $inc: {guild: 1, silver: -(Math.ceil(1200 * userData.guild + 1000))}})
                await playerStats.findOne({ _id: user.id }).then(userData => {
                    message.channel.send(`📈 | Your lodging has been upgraded to **level ${userData.guild}**!`)
                })
                // GOLD ZU SILVER
            } else if (userData.silver < Math.ceil(1200 * userData.guild + 1000)) {
                    message.channel.send(`❗️| You do not have enough **silver**.`)
            }

        }
        return
    }
    
    mongoWorker();
}

 