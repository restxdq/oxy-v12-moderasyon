const Discord = require('discord.js')
const db = require('quick.db')
const roles = require('../oxy/roles.json');
const emoji = require('../oxy/emojis.json');
const config = require('../oxy/config.json');

exports.run = async (client, message, args) => {
let member = message.mentions.members.first() || client.users.cache.get(args.join(' '));
let oxy = message.guild.member(member)
const oxyemb = new Discord.MessageEmbed().setAuthor(message.member.displayName,message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.durum)

if (message.author.bot || message.channel.type === "dm") return;
if(!message.member.roles.cache.has(roles.registerCommander) && (!message.member.roles.cache.has(roles.botCommander) && !message.member.hasPermission('VIEW_AUDIT_LOG')))
return message.channel.send(oxyemb.setDescription(`**Ops** Yeterli Yetkiye Sahip Değilsin.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
if(!member) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Üye Etiketlemeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  
//=================DATA BASE=================//
db.delete(`ceza_${oxy.id}`)
//=================DATA BASE=================//

await message.react(emoji.tik_emoji);
message.channel.send(oxyemb.setDescription(`<@${oxy.id}> **Adlı Kullanıcının Sicil Geçmişi Başarıyla Sıfırlandı.`).setColor(config.renk_yesil).setThumbnail(message.author.avatarURL({ dynamic: true })))

}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["sicil-temizle", "sicilsil"],
    permLevel: 0
  };
  
  exports.help = {
    name: "sicilsil",
    description: "isim geçmişini gösterir",
    usage: ".sicilsil @uye"
  };