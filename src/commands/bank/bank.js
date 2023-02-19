require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function (user, message) {
    //EMBED
    function createEmbedBank(userStats) {
        const embedBank = new discord.MessageEmbed()
            .setColor("#2ecc71")
            .setAuthor({ name: 'Bank Information', iconURL: user.displayAvatarURL() })
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '🏦  Bank Balance', value: `${userStats.bankbalance} gold`, inline: true },
                { name: '💰  Reserve Balance', value: `${userStats.bankreserve} silver`, inline: true },
                { name: '🛡️  Maximum Reserve', value: `${userStats.banklevel * 1500} silver`, inline: true },
                { name: '📈  Bank Interest', value: `Deposit **${Math.ceil(((userStats.banklevel * 1500)/1000)/0.072)} gold** to gain enough copper every day.`, inline: false },
                { name: '💎  Bank Upgrades', value: `Your next ` + "`" + "yui bank upgrade" + "`" + ` will cost **${Math.ceil(5+(Math.pow(userStats.banklevel, 1.65)))} gold**.`, inline: false },
                { name: '💵  Deposit', value: `Deposit gold into the bank using ` + "`" + "yui bank deposit <amount>" + "`", inline: false },
            )
        return embedBank
    } 

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
                await playerStats.findOne({ _id: user.id })).then(userDataNew => {

                    message.channel.send({ embeds: [createEmbedBank(userDataNew)] })
                })
            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })

            message.channel.send({ embeds: [createEmbedBank(userData)] })
        }
        return
    }
    
    mongoBank();
}

 