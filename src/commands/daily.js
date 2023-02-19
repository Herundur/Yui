require("dotenv").config()
const mongoose = require("mongoose")
const discord = require("discord.js")

module.exports = function (user1, message) {
    //EMBED

    bankdrop = {
        value: 0,
        bonus: 1,
        message: " ",
    }



    function createEmbedBank(userStats) {

        if (Math.ceil(((userStats.banklevel * 1500)/1000)/0.072) <= userStats.bankbalance) {
            bankdrop.value = userStats.banklevel * 1500

        } else if (userStats.bankbalance < Math.ceil(((userStats.banklevel * 1500)/1000)/0.072)) {
            bankdrop.value = Math.ceil(((userStats.bankbalance / ((Math.ceil(((userStats.banklevel * 1500)/1000)/0.072)) / 100)) * 0.01) * (userStats.banklevel * 1500))
        }

        if (message.member.roles.cache.has("863126106408615939")) {
            bankdrop.bonus = 1.25
            bankdrop.message = `❤️ Bonus **${new Intl.NumberFormat('de-DE').format(((350 + ((userStats.skills.mine.level + userStats.skills.mine.level + userStats.skills.mine.level) * 50) + (userStats.workers * 200) + (bankdrop.value)) * bankdrop.bonus) - (350 + ((userStats.skills.mine.level + userStats.skills.mine.level + userStats.skills.mine.level) * 50) + (userStats.workers * 200) + (bankdrop.value)))} silver** (25%) earned as Server-Booster!`
        }
    
        const embedBank = new discord.MessageEmbed()
            .setColor("#9b59b6")
            .setAuthor({ name: 'You collected your daily!', iconURL: "https://cdn.discordapp.com/attachments/951243124489990225/996527787852710059/yui_5f7026379c0ef.png" })
            .setThumbnail(user1.displayAvatarURL())
            .setDescription(`💰 You collected **${new Intl.NumberFormat('de-DE').format((350 + ((userStats.skills.mine.level + userStats.skills.mine.level + userStats.skills.mine.level) * 50) + (userStats.workers * 200) + (bankdrop.value)) * bankdrop.bonus)} silver** from your daily reward!
            🪓 You earned **${new Intl.NumberFormat('de-DE').format((userStats.skills.mine.level + userStats.skills.mine.level + userStats.skills.mine.level) * 50)} silver** from your skills level reward!
            ⚒ An extra **${new Intl.NumberFormat('de-DE').format(userStats.workers * 200)} silver** was collected from workers!
            🏦 Your bank gained **${new Intl.NumberFormat('de-DE').format(bankdrop.value)} silver** in interest!
            ${bankdrop.message}
            `)
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '🎁  Share The Love!', value: `Did you know you can gift your daily? Just ping a user when running the command!`, inline: false },
                { name: '💵  Donation Bonus!', value: `[Become a Server-Booster to receive 25% more silver for every daily!](https://www.youtube.com/watch?v=Qu-6G9A8NHw)`, inline: false },
            )
        return embedBank
    } 
    const playerStats = require("../schema.js")

    const mongoBank = async () => {
        if (message.member.roles.cache.has("863126106408615939")) {
            bankdrop.bonus = 1.25
        }

        //MONGO DATENBANK WIRD DURCHSUCHT OB USERDATEN VORHANDEN SIND
        let userData = await playerStats.findOne({ _id: user1.id })

        //USER DATEN NOCH NICHT VORHANDEN -> ES WERDEN NEUE ERSTELLT
        if (!userData) {
            const createdData = new playerStats({
                _id: user1.id,
                _name: user1.username,
            })
            await createdData.save().catch(e => console.log(e)).then(
                await playerStats.findOne({ _id: user1.id })).then(userDataNew => {
                    userDataNew.updateOne({ $inc: {silver: (350 + ((userDataNew.skills.mine.level + userDataNew.skills.mine.level + userDataNew.skills.mine.level) * 50) + (userDataNew.workers * 200) + (bankdrop.value)) * bankdrop.bonus}})
                    userDataNew.updateOne({ $set: {daily: message.createdAt, alreadyReminded: false}})
                    message.channel.send({ embeds: [createEmbedBank(userDataNew)] })
                    message.channel.send("griagst eh deine oidn stats zruck und waunst bugs findst sogs ma")
                })
            return

            //USER DATEN BEREITS VORHANDEN                            
        } else if (userData) {
            userData = await playerStats.findOne({ _id: user1.id })

            if (message.createdTimestamp - (Date.parse(userData.daily)) >= 43200000) {
                if (Math.ceil(((userData.banklevel * 1500)/1000)/0.072) <= userData.bankbalance) {
                    bankdrop.value = userData.banklevel * 1500
        
                } else if (userData.bankbalance < Math.ceil(((userData.banklevel * 1500)/1000)/0.072)) {
                    bankdrop.value = Math.ceil(((userData.bankbalance / ((Math.ceil(((userData.banklevel * 1500)/1000)/0.072)) / 100)) * 0.01) * (userData.banklevel * 1500))
                }
                await userData.updateOne({ $inc: {silver: (350 + ((userData.skills.mine.level + userData.skills.mine.level + userData.skills.mine.level) * 50) + (userData.workers * 200) + (bankdrop.value)) * bankdrop.bonus}})
                await userData.updateOne({ $set: {daily: message.createdAt, alreadyReminded: false}})
                message.channel.send({ embeds: [createEmbedBank(userData)] })

            } else {
                message.channel.send(`❗️| Yui daily useable in **${Math.floor((43200000 - (message.createdTimestamp - (Date.parse(userData.daily)))) / 1000 / 60 / 60)} hours, ${Math.floor((43200000 - (message.createdTimestamp - (Date.parse(userData.daily)))) / 1000 / 60 % 60)}minutes**!`)
            }
        }
        return
    }
    
    mongoBank();
}

 