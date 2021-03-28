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
  let zaman = args[1].replace("sn", "s").replace("dk", "m").replace("sa", "h").replace("gün", "d");
  let zamandilimi = zaman.replace("m", " dakika").replace("s", " saniye").replace("h", " saat").replace("d", " d");
  let sebep = args[2];
  let cezaNo = db.get(`cezaNo_${oxy.id}`)

  if (message.author.bot || message.channel.type === "dm") return;
  if(!message.member.roles.cache.has(roles.muteCommander) && (!message.member.roles.cache.has(roles.Seth) && !message.member.hasPermission('VIEW_AUDIT_LOG')))
  return message.channel.send(oxyemb.setDescription(`**Ops** Yeterli Yetkiye Sahip Değilsin.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!member) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Üye Etiketlemeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!zaman) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Zaman Belirtmeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if (oxy.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(oxyemb.setDescription(`**Ops** Etiketlediğin kullanıcı senden üst/aynı rolde.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!sebep) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Sebep Belirtmeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  
  //=================DATA BASE=================//
  db.push(`ceza_${oxy.id}`, `\n\`>\` <@!${message.author.id}> adlı kullanıcı tarafından \`${oxytarih}\` Tarihinde \`${sebep}\` Sebebiyle **Mutelendi.**`);
  db.add(`cezaNo_${message.guild}`, 1);
  db.add(`süreMute_${oxy.id}`, zamandilimi);  
  db.add(`muted_${oxy.id}`, 1);
  //=================DATA BASE=================//

message.channel.send(oxyemb.setFooter(`Ceza No : \`${cezaNo}\``).setColor(config.renk_yesil).setDescription(`<@!${message.author.id}> tarafından ${oxy} **${sebep}** sebebiyle **${zamandilimi} boyunca** mute atıldı`));
{channels.muteLog.send(oxyemb.setFooter(`Ceza No : \`${cezaNo}\``).setColor(config.renk_siyah).setDescription(`\`•\` **Mute Atıldı.**\n\n**•** Susturan Yetkili : <@!${message.author.id}> (\`${message.author.id}\`)\n**•** Susturulan : <@!${oxy.id}> (\`${oxy.id}\`)\n**•** Mutelenme Süresi : ${zamandilimi}\n**•** Tarih : ${oxytarih}`))
await oxy.roles.add(roles.mutedRole);}setTimeout(async function() {
channels.muteLog.send(oxyemb.setFooter(`Ceza No : \`${cezaNo}\``).setColor(config.renk_yesil).setDescription(`\`•\` **Mute Süresi Doldu.**\n\n**•** Susturan Yetkili : <@!${message.author.id}> (\`${message.author.id}\`)\n**•** Susturulan : <@!${oxy.id}> (\`${oxy.id}\`)\n**•** Tarih : ${oxytarih}`))
await oxy.roles.remove(roles.mutedRole);
},ms(zaman));

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['mute' ,'sustur'],
    permLevel: 0,
}

exports.help = {
      name: "mute"  
}