require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function async (user, message, reciver, amount) {

    const playerStats = require("../schema.js")

    const mongoSend = async () => {

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
                    if (userDataNew.silver >= amount && amount <= 100000) {
                        userDataNew.updateOne({ $inc: {silver: -amount}})
                        const reciverStats = playerStats.findOne({ _id: reciver.id })
                        reciverStats.updateOne({ $inc: {silver: +amount}})
                        message.channel.send(`✅ | Transaction complete successfully: <:silver:996006753940537374> **${amount}** -> ${reciver} (<:silver:996006753940537374> **0** tax)`)

                    } else if (userDataNew.silver >= amount && amount > 100000) {
                        userDataNew.updateOne({ $inc: {silver: -amount}})
                        const reciverStats = playerStats.findOne({ _id: reciver.id })
                        reciverStats.updateOne({ $inc: {silver: (amount * 0.8)}})
                        message.channel.send(`✅ | Transaction complete successfully: <:silver:996006753940537374> **${amount * 0.8}** -> ${reciver} (<:silver:996006753940537374> **${amount * 0.2}** tax)`)

                    }else if (userDataNew.silver < amount) {
                        message.channel.send(`❗️| You do not have enough **silver**.`)
                    }
                    
                })

            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })
                // SILVER ZU GOLD
                if (userData.silver >= amount && amount <= 100000) {
                    await userData.updateOne({ $inc: {silver: -amount}})
                    const reciverStats = await playerStats.findOne({ _id: reciver.id })
                    await reciverStats.updateOne({ $inc: {silver: +amount}})
                    message.channel.send(`✅ | Transaction complete successfully: <:silver:996006753940537374> **${amount}** -> ${reciver} (<:silver:996006753940537374> **0** tax)`)
    

                } else if (userData.silver >= amount && amount > 100000) {
                    await userData.updateOne({ $inc: {silver: -amount}})
                    const reciverStats = await playerStats.findOne({ _id: reciver.id })
                    await reciverStats.updateOne({ $inc: {silver: (amount * 0.8)}})
                    message.channel.send(`✅ | Transaction complete successfully: <:silver:996006753940537374> **${amount * 0.8}** -> ${reciver} (<:silver:996006753940537374> **${amount * 0.2}** tax)`)


                }else if (userData.silver < amount) {
                    message.channel.send(`❗️| You do not have enough **silver**.`)
                }

        }
        return
    }
    
    mongoSend();
}

 