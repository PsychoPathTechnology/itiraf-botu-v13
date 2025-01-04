const fs = require("fs");
const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, Collection, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const ayarlar = require("config.json");
const client = new Client({
  fetchAllMembers: true,
  intents:[
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS

    
  ]});



const mongoose = require("mongoose");
mongoose.connect(ayarlar.mongoDB)
.then(() => console.log('MongoDB bağlandı!'))
.catch(err => console.log(err))


global.client = client;
client.commands = (global.commands = []);
fs.readdir("./letKomutlar/", (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./letKomutlar/${file}`);

        client.commands.push({
             name: props.name.toLowerCase(),
             description: props.description,
             options: props.options,
             category: props.category,
          
             
        })
    });
})
;
fs.readdir("./events/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        
        client.on(eventName, (...args) => {
           event(client, ...args);
        });
    });
});


client.on("ready", async () => {
  
    const rest = new REST({ version: "9" }).setToken(ayarlar.token);

  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }
});


client.login(ayarlar.token);


