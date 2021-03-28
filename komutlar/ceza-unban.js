const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("ms");
const moment = require("moment");
const roles = require('../oxy/roles.json');
const emoji = require('../oxy/emojis.json');
const config = require('../oxy/config.json');
const channels = require('../oxy/channels.json');
module.exports.run = async (client, message, args) => {
  //----------------------------------Created By OxY.---------------------------------------------\\
  let oxytarih = moment(message.createdAt).format("LLLL")
  let member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
  const oxyemb = new Discord.MessageEmbed().setAuthor(message.member.displayName,message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.durum)
  let oxy = message.guild.member(member)
  let sebep = args[1];
  let cezaNo = db.get(`cezaNo_${oxy.id}`)

  if (message.author.bot || message.channel.type === "dm") return;
  if(!message.member.roles.cache.has(roles.banCommander) && (!message.member.roles.cache.has(roles.Seth) && !message.member.hasPermission('VIEW_AUDIT_LOG')))
  return message.channel.send(oxyemb.setDescription(`**Ops** Yeterli Yetkiye Sahip Değilsin.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!member) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Üye Etiketlemeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!sebep) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Sebep Belirtmeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
 
  //=================DATA BASE=================//
  db.push(`ceza_${oxy.id}`, `\n\`>\` <@!${message.author.id}> adlı kullanıcı tarafından \`${oxytarih}\` Tarihinde \`${sebep}\` Sebebiyle **Banı Açıldı.**`);
  db.add(`cezaNo_${message.guild}`, 1);
  db.push(`banBilgi_${oxy.id}`, `\`>\` <@!${message.author.id}> adlı kullanıcı tarafından \`${oxytarih}\` Tarihinde \`${sebep}\` Sebebiyle  **Banı Açıldı.**`)
  //=================DATA BASE=================//

message.channel.send(oxyemb.setColor(config.renk_yesil).setFooter(`Ceza No : \`${cezaNo}\``).setImage().setDescription(`<@!${message.author.id}> tarafından <@${oxy.id}> adlı kullanıcı **${sebep}** sebebiyle Banlandı`));
{channels.banLog.send(oxyemb.setColor(config.renk_siyah).setFooter(`Ceza No : \`${cezaNo}\``).setDescription(`\`•\` **Ban Açıldı.**\n\n**•** Ban Açan Yetkili : <@!${message.author.id}> (\`${message.author.id}\`)\n**•** Ban Açan : <@!${oxy.id}> (\`${oxy.id}\`)\n**•** Sebebi : \`${sebep}\`\n**•** Tarih : \`${oxytarih}\``))
await message.guild.members.unban(oxy.id).catch(err => console.error(error));
}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['unban' ,'banaç'],
    permLevel: 0,
}

exports.help = {
      name: "unban"  
}