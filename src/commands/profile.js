require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function (user, message) {
    
    function createEmbedProfile(userStats) {
        const embedProfile = new discord.MessageEmbed()
            .setColor("#94078C")
            .setTitle(`Profile for ${user.username}`)
            .setDescription(`${userStats.status}`)
            .setThumbnail(user.displayAvatarURL())
            .setAuthor({ name: 'Banura | Yui 2.0', iconURL: 'https://cdn.discordapp.com/attachments/951243124489990225/955461759475523634/green-b-md.png' })
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '💰 Balance', value: "```" + `${userStats.gold} Gold\n${userStats.silver} Silver` + "```", inline: false },
                { name: '🏦 Bank', value: "```" + `${userStats.bankbalance} Kapital\n${userStats.banklevel} Level\n${userStats.banklevel * 1500} max. Reserve` + "```", inline: false },
                { name: '🏚️ Guild', value: "```" + `${userStats.workers} Workers\n${userStats.guild} Level\n${userStats.guild * 3} max. Workers` + "```", inline: false },
            )
            .setTimestamp()
            .setFooter({ text: "🕓" })
        return embedProfile
    }

    const playerStats = require("../schema.js")

    const mongoProfile = async () => {

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

                    message.channel.send({ embeds: [createEmbedProfile(userDataNew)] })
                })
            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })
            console.log(userData)
            message.channel.send({ embeds: [createEmbedProfile(userData)] })
        }
        return
    }

    mongoProfile();
}

 