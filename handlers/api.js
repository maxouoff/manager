const websocket = require("ws")
const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const connections = {}
const getNow = () => {
    return {
        time: new Date().toLocaleString("fr-FR", {
            timeZone: "Europe/Paris",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
    }
}

module.exports = async (client) => {

    const server = new websocket.Server({ port: 5000 })
    const allServers = []
    server.on('connection', ws => {
        ws.on('message', async data => {
            console.log(JSON.parse(data))
            let received = JSON.parse(data)
            if (received.type === "connection") {
                allServers.push({
                    id: received.id,
                    ws: ws
                })
            }
            const embed = new Discord.MessageEmbed()
                .setDescription(`
                Connection effectuée le <t:${received.date}:d> (<t:${received.date}:R>)

                Nom du bot : [\`${received.tag}\`](${client.config.support}) (\`${received.id}\`)
                Nom du buyer : [\`${received.buyertag}\`](${client.config.support}) (\`${received.buyer}\`)
                `)
                .setAuthor({name: `Nouvelle connection au serveur`, iconURL: received.botpic || null})
                .setFooter({ text: client.config.footer })
                .setTimestamp()
                .setColor(client.config.color)

            let channel = client.channels.cache.get(client.config.channel)
            console.log(`Le bot ${received.tag} (${received.id}) viens de se connecter au serveur`)
            channel.send({embeds: [embed]});
            ws.send(JSON.stringify({ message: "bien reçu" }))
        })
    })
}