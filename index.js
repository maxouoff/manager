const { Client, Collection } = require("discord.js");
const config = require('./config.json')
const db = require("quick.db")

const client = new Client({
    partials: ["MESSAGE", "GUILD_MEMBER", "CHANNEL", "USER", "GUILD_SCHEDULED_EVENT", "REACTION"],
    intents: 32767,
});

client.setMaxListeners(0)
module.exports = client;

client.slashCommands = new Collection();
client.commands = new Collection();
client.config = config
client.db = db

require("./handlers")(client);
require('./handlers/anti-crash')(client);
require('./handlers/api')(client);

client.login(client.config.token);