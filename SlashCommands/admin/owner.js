const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "owner",
    description: "Permet de gérer les owners du serveur",
    category: "admin",
    options: [
        {
            name: "add",
            description: "Permet d'ajouter un owner au serveur",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "utilisateur",
                    description: "Veuillez renseigner l'utilisateur",
                    type: "USER",
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Permet de retirer un owner du serveur",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "utilisateur",
                    description: "Veuillez renseigner l'utilisateur",
                    type: "USER",
                    required: true
                }
            ]
        },
        {
            name: "list",
            description: "Permet d'afficher tous les owners du serveur",
            type: "SUB_COMMAND",
        },
        {
            name: "clear",
            description: "Permet de supprimer tous les owners du serveur",
            type: "SUB_COMMAND"
        }
    ],

    /**
    * @param {Client} client 
    * @param {CommandInteraction} interaction 
    */

    run: async (client, interaction, args) => {

        const [SubCmd] = args
        const color = client.config.color

        if (SubCmd == "add") {

            //if (message.member.id !== message.guild.ownerId || interaction.member.id !== client.config.dev) return interaction.reply({ content: "Vous n'êtes pas autorisé a faire cela", ephemeral: true })

            let user = interaction.options.getUser("utilisateur").id
            let member = interaction.guild.members.cache.get(user)

            let jugemax = db.get(`owner_${interaction.guild.id}_${member.id}`)

            if (jugemax == true) {

                let dejaowner = new MessageEmbed().setColor(color).setDescription(`\`❌\` **${member.user.tag}** est déjà **owner** !`)

                return interaction.reply({ embeds: [dejaowner] })

            } else {

                db.set(`owner_${interaction.guild.id}_${member.id}`, true)

                let goodowner = new MessageEmbed().setColor(color).setDescription(`\`✅\` **${member.user.tag}** est maintenant **owner** !`)

                interaction.reply({ embeds: [goodowner] })
            }
        } else if (SubCmd == "remove") {
            if (interaction.member.id !== interaction.guild.ownerId) return interaction.reply({ content: "Vous n'êtes pas autorisé a faire cela", ephemeral: true })
            let member = interaction.options.getUser("user").id
            member = interaction.guild.members.cache.get(member)
            let user = member
            let jugemax = db.get(`owner_${interaction.guild.id}_${user.id}`)
            if (jugemax !== true) {
                db.delete(`owner_${interaction.guild.id}_${user.id}`)
                interaction.reply(`${user.username} n'est plus owner `)
            } else {
                interaction.reply(`${user.username} n'est pas owner `)
            }
        } else if (SubCmd == "list") {

            const data = db.all().filter(data => data.ID.startsWith(`owner_${interaction.guild.id}`)).sort((a, b) => b.data - a.data)

            let embed = new MessageEmbed()
                .setTitle(`Liste des Owners`)
                .setFooter({ text: `${client.config.footer}` })
                .setColor(color)
                .setDescription(data
                    .map((m, c) => `**${c + 1}**) ${client.users.cache.get(m.ID.split("_")[2]).tag} | <@${m.ID.split("_")[2]}>`).join("\n") || "Aucune personne")

            interaction.reply({ embeds: [embed] })


        } else if (SubCmd == "clear") {

            //if (interaction.member.id !== interaction.guild.ownerId) return interaction.reply({ content: "Vous n'êtes pas autorisé a faire cela", ephemeral: true })
            let tt = await db.all().filter(data => data.ID.startsWith(`owner_${interaction.guild.id}`));

            let no = new MessageEmbed().setColor(color).setDescription(`\`✅\` ${tt.length === undefined || null ? 0 : tt.length} ${tt.length > 1 ? "personnes ont été correctement supprimées" : "personne a été correctement supprimée"} des owners`)

            interaction.reply({embeds: [no]})

            let delowner = 0;
            for (let i = 0; i < tt.length; i++) {
                db.delete(tt[i].ID);
                delowner++;
            }

        }
    }
}