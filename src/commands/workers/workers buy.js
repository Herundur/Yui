require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function async (user, message) {

    const playerStats = require("../../schema.js")

    const mongoWorkersBuy = async () => {

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
                    if (userDataNew.silver >= 250 * userDataNew.workers && userDataNew.workers < 3 * userDataNew.guild) {
                        userDataNew.updateOne({ $inc: {workers: 1, silver: -250 * userDataNew.workers}})
                        playerStats.findOne({ _id: user.id }).then(userDataNew => {
                            message.channel.send(`⚒ | You hired a **skilled human miner**! (+200 silver/day)`)
                        })
                    } else if (userDataNew.silver < 250 * userDataNew.workers) {
                        message.channel.send(`❗️| You do not have enough **silver**.`)
                    } else if (userDataNew.workers >= 3 * userDataNew.guild) {
                        message.channel.send(`❗️| You need to upgrade your **guild**!`)
                    }
                    
                })

            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })
                // SILVER ZU GOLD
            if (userData.silver >= 250 * userData.workers && userData.workers < 3 * userData.guild) {

                await userData.updateOne({ $inc: {workers: 1, silver: -250 * userData.workers}})
                await playerStats.findOne({ _id: user.id }).then(userData => {
                    message.channel.send(`⚒ | You hired a **skilled human miner**! (+200 silver/day)`)
                })
                // GOLD ZU SILVER
            } else if (userData.silver < 250 * userData.workers) {
                    message.channel.send(`❗️| You do not have enough **silver**.`)
            } else if (userData.workers >= 3 * userData.guild) {
                message.channel.send(`❗️| You need to upgrade your **guild**!`)
            }

        }
        return
    }
    
    mongoWorkersBuy();
}

 