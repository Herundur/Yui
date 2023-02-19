require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function (user, message) {

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
                await playerStats.findOne({ _id: user.id })).then(userDataNew => {

                    message.channel.send(`💰 | Here is your balance: <:gold:996006907288502332> **${new Intl.NumberFormat('de-DE').format(userDataNew.gold)}** <:silver:996006753940537374> **${new Intl.NumberFormat('de-DE').format(userDataNew.silver)}**!`)
                })
            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })

            message.channel.send(`💰 | Here is your balance: <:gold:996006907288502332> **${new Intl.NumberFormat('de-DE').format(userData.gold)}** <:silver:996006753940537374> **${new Intl.NumberFormat('de-DE').format(userData.silver)}**!`)
        }
        return
    }
    
    mongoBank();
}

 