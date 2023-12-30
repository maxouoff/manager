const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose")

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {

    const commandfiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandfiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties)
        }
        if (file.aliases) {
            const properties = { directory, ...file };
            client.commands.set(file.aliases, properties)
        }
    });

    const eventFiles = await globPromise(`${process.cwd()}/events/*/*.js`);
    eventFiles.map((value) => require(value));


    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;


        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        await client.application.commands.set(arrayOfSlashCommands);
    });

    const { mongoURL } = require("../config.json")
    if (!mongoURL) return console.log("Je n'ai pas réussi à me connecter à MongoDB")
    mongoose.set('strictQuery', true)
    mongoose.connect(mongoURL).then(() => console.log("J'ai réussi à me connecter à MongoDB"));
};