require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function async (user, message) {

    const playerStats = require("../../schema.js")

    const mongoBank = async () => {

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
                    if (userDataNew.bankbalance >= Math.ceil(5+(Math.pow(userDataNew.banklevel, 1.65)))) {
                        userDataNew.updateOne({ $inc: {banklevel: 1, bankbalance: -(Math.ceil(5+(Math.pow(userDataNew.banklevel, 1.65))))}})
                        playerStats.findOne({ _id: user.id }).then(userDataNew => {
                            message.channel.send(`📈 | Successfully upgraded bank to **level ${userDataNew.banklevel}**! (+1,500 reserve)`)
                        })
                    } else if (userDataNew.bankbalance < Math.ceil(5+(Math.pow(userDataNew.banklevel, 1.65)))) {
                        message.channel.send(`❗️| You do not have enough **gold**.`)
                }
                    
                })

            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })
                // SILVER ZU GOLD
            if (userData.bankbalance >= Math.ceil(5+(Math.pow(userData.banklevel, 1.65)))) {

                await userData.updateOne({ $inc: {banklevel: 1, bankbalance: -(Math.ceil(5+(Math.pow(userData.banklevel, 1.65))))}})
                await playerStats.findOne({ _id: user.id }).then(userData => {
                    message.channel.send(`📈 | Successfully upgraded bank to **level ${userData.banklevel}**! (+1,500 reserve)`)
                })
                // GOLD ZU SILVER
            } else if (userData.bankbalance < Math.ceil((Math.pow(userData.banklevel, 1.65))+5)) {
                    message.channel.send(`❗️| You do not have enough **gold**.`)
            }

        }
        return
    }
    
    mongoBank();
}

 