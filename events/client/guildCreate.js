const client = require("../../index")
const db = require("quick.db")
const { MessageEmbed } = require("discord.js")

client.on("guildCreate", async (guild) => {

    let maxkou = client.users.cache.get(client.config.dev)

    let premiumTier = {
        NONE: 0,
        TIER_1: 1,
        TIER_2: 2,
        TIER_3: 3,
    };

    let embed = new MessageEmbed()
        .setTitle(`J'ai rejoins un serveur`)
        .setDescription(`
        > Nom : ${guild.name}
        > ID : ${guild.id}
        > Description : ${guild.description || 'Aucune'}
        > Membres : ${guild.memberCount}
        > Boost(s) : ${guild.premiumSubscriptionCount || 0} (tier ${premiumTier[guild.premiumTier]})
        > Date de création : <t:${Math.floor(guild.createdAt / 1000)}:F> (<t:${Math.floor(guild.createdAt / 1000)}:R>)
        `)
        .setFooter({ text: client.config.footer })
        .setTimestamp()
        .setColor(client.config.color)
        .setImage(guild.bannerURL({ size: 4096 } || null))
        .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 }))

    maxkou.send({ embeds: [embed], content: `Je viens de quitter le serveur :` })

    await guild.leave()

})