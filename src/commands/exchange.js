require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function async (user, message, currency, amount) {

    const playerStats = require("../schema.js")

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
                    if (currency === "gold" && userDataNew.silver / 1000 >= amount) {
                        userDataNew.updateOne({ $inc: {gold: amount, silver: amount * -1000}})
                        playerStats.findOne({ _id: user.id }).then(userDataNew => {
                            message.channel.send(`💰 | You exchanged ${amount * 1000} silver for ${amount} gold.`)
                        })
                    } else if (currency === "silver" && userDataNew.gold * 1000 >= amount && amount >= 1000) {
                        userDataNew.updateOne({ $inc: {silver: amount, gold: amount / -1000}})
                        playerStats.findOne({ _id: user.id }).then(userDataNew => {
                            message.channel.send(`💰 | You exchanged ${amount / 1000} gold for ${amount} silver.`)
                        })
                        //FALLS ZU WENIG SILBER ODER GOLD
                    } else if (currency === "gold" && userDataNew.silver / 1000 < amount) {
                        message.channel.send(`❗️| You do not have enough **silver**.`)
                    } else if (currency === "silver" && userDataNew.gold * 1000 >= amount && amount >= 1000) {
                        message.channel.send(`❗️| You do not have enough **gold**.`)
                }
                    
                })

            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })
                // SILVER ZU GOLD
            if (currency === "gold" && userData.silver / 1000 >= amount) {

                await userData.updateOne({ $inc: {gold: amount, silver: amount * -1000}})
                await playerStats.findOne({ _id: user.id }).then(userData => {
                    message.channel.send(`💰 | You exchanged **${amount * 1000} silver** for **${amount} gold**.`)
                })
                // GOLD ZU SILVER
            } else if (currency === "silver" && userData.gold * 1000 >= amount && amount >= 1000) {
                await userData.updateOne({ $inc: {silver: amount, gold: amount / -1000}})
                await playerStats.findOne({ _id: user.id }).then(userData => {
                    message.channel.send(`💰 | You exchanged **${amount / 1000} gold** for **${amount} silver**.`)
                })
                //FALLS ZU WENIG SILBER ODER GOLD
            } else if (currency === "gold" && userData.silver / 1000 < amount) {
                    message.channel.send(`❗️| You do not have enough **silver**.`)
            } else if (currency === "silver" && userData.gold * 1000 >= amount && amount >= 1000) {
                    message.channel.send(`❗️| You do not have enough **gold**.`)
            }

        }
        return
    }
    
    mongoBank();
}

 