require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function async (user, message, amount) {

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
                    if (userDataNew.gold >= amount) {
                        userDataNew.updateOne({ $inc: {gold: -amount, bankbalance: amount}})
                        playerStats.findOne({ _id: user.id }).then(userDataNew => {
                            message.channel.send(`📈 | Successfully deposited **${new Intl.NumberFormat('de-DE').format(amount)} gold** into your account.`)
                        })
                    } else if (userDataNew.gold < amount) {
                        message.channel.send(`❗️| You do not have enough **gold**.`)
                }
                    
                })

            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })
                // GOLD WIR DEPOSIT
            if (userData.gold >= amount) {

                await userData.updateOne({ $inc: {gold: -amount, bankbalance: amount}})
                await playerStats.findOne({ _id: user.id }).then(userData => {
                    message.channel.send(`📈 | Successfully deposited **${new Intl.NumberFormat('de-DE').format(amount)} gold** into your account.`)
                })
                // ZU WENIG GOLD
            } else if (userData.gold < amount) {
                    message.channel.send(`❗️| You do not have enough **gold**.`)
            }

        }
        return
    }
    
    mongoBank();
}

 