const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js")
const bot = require("../../models/mybot")
const { map } = require('modern-async')

module.exports = {
    name: 'mybots',
    description: "Permet d'afficher la liste de vos bots personnalisés",
    category: "utility",
    options: [
        {
            name: "utilisateur",
            description: "Veuillez choisir un utilisateur",
            type: "USER",
            required: false
        }
    ],

    run: async (client, interaction, args) => {

        let color = client.db.fetch(`color_${interaction.guild.id}`)
        if (color == null) color = client.config.color

        let max = interaction.options.getUser("utilisateur")

        if (max) {

            if (client.db.fetch(`owner_${interaction.guild.id}_${interaction.user.id}`) === true) {

                let user = interaction.options.getUser("utilisateur").id

                let mmr = interaction.guild.members.cache.get(user)
                let nowtime = new Date(Date.now()).getTime()

                bot.findOne({
                    User: mmr.id
                }, async (err, data) => {
                    if (err) throw err
                    if (data) {
                        let e = await map(data.content,
                            async (w, i) =>
                                `> Bot : [\`${((await client.users.fetch(w.botid)).tag)}\`](https://discord.com/api/oauth2/authorize?client_id=${w.botid}&permissions=8&scope=bot%20applications.commands) (\`${w.botid}\`)\n> État : ${(Math.round((new Date(w.time).getTime() - new Date(nowtime).getTime()) / (1000))) >= 1 ? `\`✅\`` : `\`❌\``}\n> Expiration : <t:${(Math.round((new Date(w.time).getTime()) / 1000))}:d> (<t:${(Math.round((new Date(w.time).getTime()) / 1000))}:R>)\n> Créé par : <@${w.addid || "1071188330915561593"}>`
                        )
                        let selectMenuOptions = await map(data.content,
                            async (w, i) => {
                                return {
                                    label: `${i + 1}) ${((await client.users.fetch(w.botid)).tag)}`,
                                    value: w.botid
                                }
                            })

                        let select = new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId("mybots_bot")
                                    .setPlaceholder("Veuillez choisir un bot")
                                    .addOptions([selectMenuOptions])
                            )
                        let img = new MessageEmbed()
                            .setColor(color)
                            .setImage("https://cdn.discordapp.com/attachments/1110177611113582592/1110177640133972048/banner_kirio.png")

                        let embed = new MessageEmbed()
                            .setAuthor({ name: `Abonnement de ${mmr.user.tag}`, iconURL: mmr.user.displayAvatarURL({ dynamic: true }) })
                            .setDescription(e.join(`\n\n`))
                            .setColor(color)
                            .setImage("https://cdn.discordapp.com/attachments/1110177611113582592/1110178821325467668/barre_kirio.png")
                            .setFooter({ text: client.config.footer })
                            .setTimestamp()

                        interaction.reply({ embeds: [img, embed], components: [select] })

                        let collector = interaction.channel.createMessageComponentCollector()

                        collector.on("collect", async (m) => {

                            if (interaction.user.id !== m.user.id) return m.reply({ content: `Hop hop hop ! Ne touches pas à ça !`, ephemeral: true })

                            let p = await map(data.content,
                                async (w, i) => {
                                    let btid = w.botid

                                    if (m.values[0] === btid) {

                                        let embed = new MessageEmbed()
                                            .setAuthor({ name: `Informations sur ${((await client.users.fetch(w.botid)).tag)}`, iconURL: ((await client.users.fetch(w.botid)).displayAvatarURL({ dynamic: true })) })
                                            .setFooter({ text: client.config.footer })
                                            .setTimestamp()
                                            .setColor(color)
                                            .setDescription(`> Acheteur : [\`${client.users.cache.get(w.buyerid || m.user.id).tag}\`](https://discord.com/users/${w.buyerid || m.user.id}) (\`${w.buyerid || m.user.id}\`)\n> Invation : [\`Clique ici\`](https://discord.com/api/oauth2/authorize?client_id=${w.botid}&permissions=8&scope=bot%20applications.commands)\n> État : ${(Math.round((new Date(w.time).getTime() - new Date(nowtime).getTime()) / (1000))) >= 1 ? `\`Allumé\`` : `\`Éteint\``}`)

                                        await m.update({ embeds: [embed], components: [] })

                                    }

                                })

                        })


                    } else {

                        let nobot = new MessageEmbed().setColor(color).setDescription(`\`❌\` **${mmr.user.tag}** ne possède aucun bot !`)

                        interaction.reply({ embeds: [nobot] })
                    }
                })

            } else {

                return interaction.reply({ content: `Vous n'avez pas la permission de voir les bots des autres personnes !`, ephemeral: true })

            }

        }

        else if (!max) {

            let nowtime = new Date(Date.now()).getTime()

            bot.findOne({
                User: interaction.user.id
            }, async (err, data) => {
                if (err) throw err
                if (data) {
                    let e = await map(data.content,
                        async (w, i) =>
                            `> Bot : [\`${((await client.users.fetch(w.botid)).tag)}\`](https://discord.com/api/oauth2/authorize?client_id=${w.botid}&permissions=8&scope=bot%20applications.commands) (\`${w.botid}\`)\n> État : ${(Math.round((new Date(w.time).getTime() - new Date(nowtime).getTime()) / (1000))) >= 1 ? `\`✅\`` : `\`❌\``}\n> Expiration : <t:${(Math.round((new Date(w.time).getTime()) / 1000))}:d> (<t:${(Math.round((new Date(w.time).getTime()) / 1000))}:R>)\n> Créé par : <@${w.addid || "1071188330915561593"}>`
                    )

                    let selectMenuOptions = await map(data.content,
                        async (w, i) => {
                            return {
                                label: `${i + 1}) ${((await client.users.fetch(w.botid)).tag)}`,
                                value: w.botid
                            }
                        })

                    let select = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId("mybots_bot")
                                .setPlaceholder("Veuillez choisir un bot")
                                .addOptions([selectMenuOptions])
                        )
                    let img = new MessageEmbed()
                        .setColor(color)
                        .setImage("https://cdn.discordapp.com/attachments/1110177611113582592/1110177640133972048/banner_kirio.png")

                    let embed = new MessageEmbed()
                        .setAuthor({ name: `Abonnement de ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(e.join("\n\n"))
                        .setColor(color)
                        .setFooter({ text: client.config.footer })
                        .setTimestamp()

                    interaction.reply({ embeds: [img, embed], components: [select] })

                    let collector = interaction.channel.createMessageComponentCollector()

                        collector.on("collect", async (m) => {

                            if (interaction.user.id !== m.user.id) return m.reply({ content: `Hop hop hop ! Ne touches pas à ça !`, ephemeral: true })

                            let p = await map(data.content,
                                async (w, i) => {
                                    let btid = w.botid

                                    if (m.values[0] === btid) {

                                        let embed = new MessageEmbed()
                                            .setAuthor({ name: `Informations sur ${((await client.users.fetch(w.botid)).tag)}`, iconURL: ((await client.users.fetch(w.botid)).displayAvatarURL({ dynamic: true })) })
                                            .setFooter({ text: client.config.footer })
                                            .setTimestamp()
                                            .setColor(color)
                                            .setDescription(`> Acheteur : [\`${client.users.cache.get(w.buyerid || m.user.id).tag}\`](https://discord.com/users/${w.buyerid || m.user.id}) (\`${w.buyerid || m.user.id}\`)\n> Invation : [\`Clique ici\`](https://discord.com/api/oauth2/authorize?client_id=${w.botid}&permissions=8&scope=bot%20applications.commands)\n> État : ${(Math.round((new Date(w.time).getTime() - new Date(nowtime).getTime()) / (1000))) >= 1 ? `\`Allumé\`` : `\`Éteint\``}`)

                                        await m.update({ embeds: [embed], components: [] })

                                    }

                                })

                        })

                } else {

                    let nobot = new MessageEmbed().setColor(color).setDescription(`\`❌\` Vous ne possédez aucun bot !`)

                    interaction.reply({ embeds: [nobot] })
                }
            })

        }

    }
}