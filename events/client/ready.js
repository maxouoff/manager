const client = require("../../index")
const db = require("quick.db")

client.on("ready", () => {

    console.log(`${client.user.username} est en ligne !`)

    setInterval(() => {

        client.user.setActivity(`Kirio Manager`, { type: "WATCHING", url: "https://twitch.tv/kirio" })

    }, 5000)
})