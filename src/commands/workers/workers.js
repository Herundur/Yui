require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function (user, message) {
    //EMBED
    function createEmbedWorkers(userStats) {
        const embedWorkers = new discord.MessageEmbed()
            .setColor("#2ecc71")
            .setAuthor({ name: 'Your workers', iconURL: user.displayAvatarURL() })
            .setDescription("You can buy more workers via " + "`" +"yui workers buy" + "`")
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '📈 Guild Level', value: `${userStats.guild}`, inline: true },
                { name: '⚒️ Worker Count', value: `${userStats.workers}`, inline: true },
                { name: '💰 Income/day', value: `${userStats.workers * 200} silver`, inline: true },
            )
        return embedWorkers
    } 

    const playerStats = require("../../schema.js")

    const mongoWorkers = async () => {

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

                    message.channel.send({ embeds: [createEmbedWorkers(userDataNew)] })
                })
            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })

            message.channel.send({ embeds: [createEmbedWorkers(userData)] })
        }
        return
    }
    
    mongoWorkers();
}

 