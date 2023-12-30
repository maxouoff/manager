const ms = require('ms');
const gdate = require('gdate')
const dateFormater = require('pm-date-formater');
const { Message, Client, MessageEmbed } = require('discord.js')
const bot = require("../../models/mybot")

module.exports = {
    name: "addbot",
    description: "Permet d'ajouter un bot à un utilisateur",
    category: "admin",
    options: [
        {
            name: "client",
            description: "Veuillez choisir le client",
            type: "USER",
            required: true
        },
        {
            name: "temps",
            description: "Veuillez rentrer le temps en jours",
            type: "STRING",
            required: true
        },
        {
            name: "identifiant",
            description: "Veuillez rentrer l'id du bot",
            type: "STRING",
            required: true
        }
    ],

    run: async (client, interaction, args) => {

        if (client.db.fetch(`owner_${interaction.guild.id}_${interaction.user.id}`) === true) {

            let color = client.db.fetch(`color_${interaction.guild.id}`)
            if (color == null) color = client.config.color

            let buyer = interaction.options.getUser("client").id
            let temps = interaction.options.getString("temps")
            let iden = interaction.options.getString("identifiant")

            let addby = interaction.user.id

            let user = interaction.guild.members.cache.get(buyer)
            if (!user) return interaction.reply({ content: `L'utilisateur que vous m'avez donnée n'est pas valide !`, ephemeral: true })

            if (isNaN(ms(temps))) return interaction.reply({ content: `La durée que vous m'avez envoyé n'est pas valide !`, ephemeral: true })
            let dur = ms(temps)

            if (isNaN(iden)) return interaction.reply({ content: `L'identifiant du bot que vous m'avez envoyé n'est pas valide !`, ephemeral: true })

            /*let time = new Date(new Date().getTime() + (dur * 24 * 60 * 60 * 1000));
            time = gdate.createYYYYMMDD(time);

            while (time.includes('/')) {
                time = time.replace('/', '-')
            }

            let formattime = dateFormater.formatDate(new Date(time), 'yyyy-MM-dd')*/

            bot.findOne({
                User: user.id
            }, async (err, data) => {

                if (err) throw err;
                if (!data) {
                    data = new bot({
                        User: user.id,
                        BotId: iden,
                        content: [{
                            botid: iden,
                            time: Date.now() + dur,
                            addid: interaction.user.id,
                            buyerid: buyer
                        }]
                    })
                } else {
                    let object = {
                        botid: iden,
                        time: Date.now() + dur,
                        addid: interaction.user.id,
                        buyerid: buyer
                    }
                    data.content.push(object)
                }
                await data.save()
            })

            let embed = new MessageEmbed().setColor(color).setDescription(`J'ai bien créé un bot pour **${user.user.tag}** !`)

            interaction.reply({ embeds: [embed] })

        } else {

            return interaction.reply({content: `Vous n'avez pas la permission d'ajouter des bots !`, ephemeral: true})

        }
    } 
}