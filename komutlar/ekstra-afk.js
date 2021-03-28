const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const config = require('../oxy/config.json');

exports.run = async (client, message, args) => {
  const oksi = db.fetch(`afkid_${message.author.id}_${message.guild.id}`);
  if (oksi) return;
  const oxy = args[0];
  if (!args[0]) {
    let kullanıcı = message.guild.members.cache.get(message.author.id);
    const b = kullanıcı.displayName;
    //----------------------------------Created By OxY.---------------------------------------------\\
    await db.set(`afkoxy_${message.author.id}_${message.guild.id}`,"Sebep Girilmemiş");
    await db.set(`afkid_${message.author.id}_${message.guild.id}`,message.author.id);
    await db.set(`afkAd_${message.author.id}_${message.guild.id}`, b);
    //----------------------------------Created By OxY.---------------------------------------------\\
    const oksii = await db.fetch(`afkoxy_${message.author.id}_${message.guild.id}`);
    message.channel.send(new MessageEmbed().setColor(config.renk_siyah).setDescription(`${kullanıcı} Başarıyla Afk Oldunuz Afk Olmanızın Sebebi: **${oksii}**`));
    message.member.setNickname(`[AFK] ` + b);
  }
  if (args[0]) {
    let oxy = args.join(" ");
    let kullanıcı = message.guild.members.cache.get(message.author.id);
    const b = kullanıcı.displayName;
    await db.set(`afkoxy_${message.author.id}_${message.guild.id}`, oxy);
    await db.set(`afkid_${message.author.id}_${message.guild.id}`,message.author.id);
    await db.set(`afkAd_${message.author.id}_${message.guild.id}`, b);
    const zyn = await db.fetch(`afkoxy_${message.author.id}_${message.guild.id}`);

    message.channel.send(new MessageEmbed().setColor(config.renk_siyah).setDescription(`${kullanıcı} Başarıyla Afk Oldunuz Afk Olmanızın Sebebi: **${zyn}**`));

    message.member.setNickname(`[AFK] ` + b);
  }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['afk' ,'yokum'],
    permLevel: 0,
}

exports.help = {
      name: "afk"  
}