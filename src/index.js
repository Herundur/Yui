require("dotenv").config()
const { Client } = require("discord.js")
const discord = require("discord.js")
const mongoose = require("mongoose");
const { db } = require("./schema.js");
require('events').EventEmitter.defaultMaxListeners = 20;

const client = new Client({ 
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS"], 
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'], })

client.on("ready", async () => {
    console.log(`Ready! Logged in as ${client.user.tag}!`)

    const mongoPw = process.env.MONGO_PW
    await mongoose.connect(
      `mongodb+srv://Heredur:S41dG5z1uRjdQKA4@banura.rk1bp.mongodb.net/?retryWrites=true&w=majority`,
      {
        keepAlive: true
      }   
    )

    // REMINDER

    const fkn2 = require(`./commands/reminder.js`)
    fkn2(client)

})

//SKILLS FKN DEFINITION
const skillFkn = skill => {
  client.on("messageCreate", msg => {
    if (msg.content.toLowerCase() === `yui ${skill}` && msg.channelId === "996822129288958102") {
        const fkn = require(`./commands/skills/${skill}.js`)

        fkn(msg.author, msg)
    } else if (msg.content.toLowerCase() === `yui ${skill}` && msg.channelId !== "996822129288958102") {
      msg.channel.send("⛔️ | " + "`" + "yui <mine/chop/fish>" + "`" + " nur in <#996822129288958102> ausführbar! Durch " + "`" + "#reminder" + "`" + " Channel anzeigen lassen.")
    }
  })
}

//FKN DEF
const messageEventFkn1 = (type) => {
  client.on("messageCreate", msg => {
    if (msg.content.toLowerCase() === `yui ${type}` && msg.channelId !== "996822129288958102") {
        const fkn = require(`./commands/${type}.js`)
        fkn(msg.author, msg)
    }
  })
}

//FKN DEF
const messageEventFkn2 = (type, folder) => {
  client.on("messageCreate", msg => {
    if (msg.content.toLowerCase() === `yui ${type}` && msg.channelId !== "996822129288958102") {
        const fkn = require(`./commands/${folder}/${type}.js`)
        fkn(msg.author, msg)
    }
  })
}

//YUI PROFILE
messageEventFkn1("profile")

//YUI BANK
messageEventFkn2("bank", "bank")


//YUI BANK UPGRADE
messageEventFkn2("bank upgrade", "bank")


//YUI BANK DEPOSIT
client.on("messageCreate", msg => {
  if (msg.content.toLowerCase().startsWith("yui bank deposit")) {
      const bankDeposit = require("./commands/bank/bank deposit.js")
      
      const depositObj = {
        amount: 0,
      }

      if (msg.content.match(/[0-9]+$/) === null) {
        msg.channel.send("<:pepega:671009023587385345> **Falscher Command!** <:pepega:671009023587385345>\n\n**yui bank deposit [amount]**\n\nRichtig wäre: " + "`" + "yui bank deposit 4" + "`" + "\n(Somit wurden 4 Gold auf das Bankkonto eingezahlt)") 
      } else {
        depositObj.amount = msg.content.match(/[0-9]+$/)[0]
        bankDeposit(msg.author, msg, depositObj.amount)  
      }
  
  }
})


//YUI BAL
messageEventFkn1("bal")


//YUI EXCHANGE
client.on("messageCreate", msg => {
  if (msg.content.toLowerCase().startsWith("yui exchange")) {

      const exchangeObj = {
        amount: 0,
        currency: undefined,
      }

      if (msg.content.toLowerCase().includes("gold")) {
        let currency = "gold"
        exchangeObj.currency = "gold"
      } else if (msg.content.toLowerCase().includes("silver")) {
        let currency = "silver"
        exchangeObj.currency = "silver"
      } else {
        msg.channel.send("<:pepega:671009023587385345> **Falscher Command!** <:pepega:671009023587385345>\n\n**yui exchange [gold/silver] [amount]**\n\nRichtig wäre: " + "`" + "yui exchange gold 4" + "`" + "\n(Somit wurden 4000 Silber in 4 Gold umgewandelt)")
      }

      //CHECK OB ZAHL ANGEGEBEN WURDE
      if (msg.content.match(/[0-9]+$/) === null && (msg.content.toLowerCase().includes("silver") || msg.content.toLowerCase().includes("gold"))) {
        msg.channel.send("<:pepega:671009023587385345> **Falscher Command!** <:pepega:671009023587385345>\n\n**yui exchange [gold/silver] [amount]**\n\nRichtig wäre: " + "`" + "yui exchange gold 4" + "`" + "\n(Somit wurden 4000 Silber in 4 Gold umgewandelt)")
      } else if (msg.content.match(/[0-9]+$/) !== null && (msg.content.toLowerCase().includes("silver") || msg.content.toLowerCase().includes("gold"))) {
        exchangeObj.amount = msg.content.match(/[0-9]+$/)[0]
        const exchange = require("./commands/exchange.js")
        exchange(msg.author, msg, exchangeObj.currency, exchangeObj.amount) 
      }
  }
})

//YUI SEND
client.on("messageCreate", msg => {
  if (msg.content.toLowerCase().startsWith("yui send")) {
      //CHECK OB ZAHL ANGEGEBEN WURDE
      if (msg.content.match(/[0-9]+$/) === null) {
        msg.channel.send("<:pepega:671009023587385345> **Falscher Command!** <:pepega:671009023587385345>\n\n**yui send [@spieler] [amount]**")
      } else if (msg.content.match(/[0-9]+$/) !== null) {
        const sendSilver = require("./commands/send.js")
        sendSilver(msg.author, msg, msg.mentions.users.at(0), msg.content.match(/[0-9]+$/)[0]) 
      }
  }
})

//YUI WORKERS
messageEventFkn2("workers", "workers")

//YUI WORKERS UPGRADE
messageEventFkn2("workers upgrade", "workers")

//YUI WORKERS BUY
messageEventFkn2("workers buy", "workers")

//YUI MINE
skillFkn("mine")

//YUI FISH
skillFkn("fish")

//YUI CHOP
skillFkn("chop")

//YUI CHANNEL MSG DELETE
client.on("messageCreate", msg => {
  if (msg.content.toLowerCase() !== "yui mine" && msg.content.toLowerCase() !== "yui fish" && msg.content.toLowerCase() !== "yui chop" && msg.channelId === "996822129288958102" && msg.author.id !== "995378006392590409") {
    msg.channel.send("⛔️ | Nur " + "`" + "yui <mine/chop/fish>" + "`" + " sind in diesem Channel ausführbar!").then(msg => setTimeout(function() { msg.delete() }, 10000));
    msg.delete();
  }
})

//YUI SKILLS
messageEventFkn2("skills", "skills")

//YUI DAILY
messageEventFkn1("daily")

// REMINDER

const reminderOn = new discord.MessageActionRow()
	.addComponents(
		new discord.MessageButton()
			.setCustomId('off')
			.setLabel('DEAKTIVIEREN')
			.setStyle('DANGER'))

const reminderOff = new discord.MessageActionRow()
      .addComponents(
        new discord.MessageButton()
          .setCustomId('on')
          .setLabel('AKTIVIEREN')
          .setStyle('SUCCESS'))


client.on("messageCreate", async message => {
  if (message.content.toLowerCase() === "#reminder") {
      const reminderFkn = () => {
          const user1 = client.users.cache.get(message.author.id)
          const memberHasYuiRole = message.guild.members.fetch(user1.id).then(m => {return m._roles.includes("644927085915144222")})
          return memberHasYuiRole;
        }
        const hasRoleBol = await reminderFkn()
    if (hasRoleBol === true) {
      message.channel.send({ content: "🔔Benachrichtigung bei wieder ausführbaren `yui daily`-Command momentan **EIN📳**\n\n<#996822129288958102>-Channel wird momentan **angezeigt**.\n", components: [reminderOn] }) .then(msg => {
        setTimeout(function() {
        msg.delete()
      }, 30*1000); 
      })

    } else if (hasRoleBol !== true) {
      message.channel.send({ content: "🔕Benachrichtigung bei wieder ausführbaren `yui daily`-Command momentan **AUS📴** \n\n<#996822129288958102>-Channel wird momentan **ausgeblendet**.\n", components: [reminderOff] }) .then(msg => {
        setTimeout(function() {
        msg.delete()
      }, 30*1000); 
      })
    }
  }
})
const playerStats = require("./schema.js")
client.on("interactionCreate", async interaction => {
  if (interaction.isButton()) {

    reminderChanger = await playerStats.findOne({ _id: interaction.user.id })

    if (interaction.customId === "on") {
      interaction.member.roles.add("644927085915144222")
      await reminderChanger.updateOne({ $set: {reminder: true}})
      interaction.deferUpdate();
  } else if (interaction.customId === "off") {
      interaction.member.roles.remove("644927085915144222")
      await reminderChanger.updateOne({ $set: {reminder: false}})
      interaction.deferUpdate()
  } }})   



client.login(process.env.DISCORD_BOT_TOKEN)