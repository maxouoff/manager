const bot = require("../../models/mybot")
const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: "delbot",
    description: "Permet de supprimer les bots d'utilisateur",
    category: "admin",
    options: [
        {
            name: "client",
            description: "Veuillez choisir le client",
            type: "USER",
            required: true
        }
    ],

    run: async (client, interaction, args) => {

        if (client.db.fetch(`owner_${interaction.guild.id}_${interaction.user.id}`) === true) {

            let color = client.db.fetch(`color_${interaction.guild.id}`)
            if (color == null) color = client.config.color

            let buyer = interaction.options.getUser("client").id

            let user = interaction.guild.members.cache.get(buyer)
            if (!user) return interaction.reply({ content: `L'utilisateur que vous m'avez donnée n'est pas valide !`, ephemeral: true })

            bot.findOne({
                User: user.id
            }, async (err, data) => {

                if (err) throw err;
                if (!data) {
                    data = new bot({
                        User: user.id,
                        content: [{
                            time: data.time,
                            addid: interaction.user.id
                        }]
                    })
                } else {
                    let object = {
                        time: data.time,
                        addid: interaction.user.id
                    }
                    data.content.push(object)
                }
                await data.delete()
            })

            let embed = new MessageEmbed().setColor(color).setDescription(`J'ai bien supprimé les bots de **${user.user.tag}** !`)

            interaction.reply({ embeds: [embed] })

        } else {

            return interaction.reply({ content: `Vous n'avez pas la permission de supprimer des bots !`, ephemeral: true })

        }

    }
}