require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function (user, message) {
    //EMBED
    function createEmbedSkills(userStats) {
        const embedSkills = new discord.MessageEmbed()
            .setColor("#2ecc71")
            .setAuthor({ name: 'Your skill progress', iconURL: user.displayAvatarURL() })
            .setDescription("You can level up skills by executing their commands " + "`" + "yui <mine/chop/fish>" + "`")
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '🎣  fishing', value: `**Level:** ${userStats.skills.fish.level} (+${userStats.skills.fish.level}% bonus)\n**XP:** ${userStats.skills.fish.xp}/${userStats.skills.fish.level * 1000}`, inline: false },
                { name: '⛏️  mining', value: `**Level:** ${userStats.skills.mine.level} (+${userStats.skills.mine.level}% bonus)\n**XP:** ${userStats.skills.mine.xp}/${userStats.skills.mine.level * 1000}`, inline: false },
                { name: '🌲  chopping', value: `**Level:** ${userStats.skills.chop.level} (+${userStats.skills.chop.level}% bonus)\n**XP:** ${userStats.skills.chop.xp}/${userStats.skills.chop.level * 1000}`, inline: false },
            )
        return embedSkills
    } 

    const playerStats = require("../../schema.js")

    const mongoSkills = async () => {

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

                    message.channel.send({ embeds: [createEmbedSkills(userDataNew)] })
                })
            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user.id })

            message.channel.send({ embeds: [createEmbedSkills(userData)] })
        }
        return
    }
    
    mongoSkills();
}

 