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
  if(!message.member.roles.cache.has(roles.jailCommander) && (!message.member.roles.cache.has(roles.Seth) && !message.member.hasPermission('VIEW_AUDIT_LOG')))
  return message.channel.send(oxyemb.setDescription(`**Ops** Yeterli Yetkiye Sahip Değilsin.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!member) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Üye Etiketlemeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if (oxy.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(oxyemb.setDescription(`**Ops** Etiketlediğin kullanıcı senden üst/aynı rolde.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!sebep) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Sebep Belirtmeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(oxy.roles.cache.has(roles.registerCommander)) return message.channel.send(oxyemb.setDescription(`**Ops** Yetkili Birini Jaile Atamazsın.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
 
  //=================DATA BASE=================//
  db.push(`ceza_${oxy.id}`, `\n\`>\` <@!${message.author.id}> adlı kullanıcı tarafından \`${oxytarih}\` Tarihinde \`${sebep}\` Sebebiyle **Jaile Yollandı.**`);
  db.add(`cezaNo_${message.guild}`, 1);
  db.add(`jail_${oxy.id}`, 1);
  //=================DATA BASE=================//

message.channel.send(oxyemb.setColor(config.renk_yesil).setFooter(`Ceza No : \`${cezaNo}\``).setDescription(`<@!${message.author.id}> tarafından <@${oxy.id}> adlı kullanıcı **${sebep}** sebebiyle jail atıldı`));
channels.jailLog.send(oxyemb.setColor(config.renk_siyah).setFooter(`Ceza No : \`${cezaNo}\``).setDescription(`\`•\` **Jail Atıldı.**\n\n**•** Hapse Atan Yetkili : <@!${message.author.id}> (\`${message.author.id}\`)\n**•** Hapse Atılan : <@!${oxy.id}> (\`${oxy.id}\`)\n**•** Sebebi : \`${sebep}\`\n**•** Tarih : \`${oxytarih}\``))
await oxy.roles.add(roles.jailRole);
await oxy.roles.cache.forEach(r => {oxy.roles.remove(r.id)});


}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['jail' ,'hapis'],
    permLevel: 0,
}

exports.help = {
      name: "jail"  
}