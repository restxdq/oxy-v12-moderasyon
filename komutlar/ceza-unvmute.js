const { MessageEmbed } = require('discord.js')
const datab = require('quick.db')
const moment = require("moment");
const ms = require('ms')
const roles = require('../oxy/roles.json');
const emoji = require('../oxy/emojis.json');
const config = require('../oxy/config.json');
const db = require('quick.db')

exports.run = async (client, message, args) => {
    //----------------------------------Created By OxY.---------------------------------------------\\
  moment.locale("tr")
  let oxytarih = moment(message.createdAt).format("LLLL")
  let member = message.mentions.members.first() || client.users.cache.get(args.join(' '));
  let oxy = message.guild.member(member)
  let sebep = args.splice(1).join(" ");
  const oxyemb = new Discord.MessageEmbed().setAuthor(message.member.displayName,message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.durum)
  let cezaNo = db.get(`cezaNo_${oxy.id}`)

  if (message.author.bot || message.channel.type === "dm") return;
  if(!message.member.roles.cache.has(roles.vmuteCommander) && (!message.member.roles.cache.has(roles.Seth) && !message.member.hasPermission('VIEW_AUDIT_LOG')))
  return message.channel.send(oxyemb.setDescription(`**Ops** Yeterli Yetkiye Sahip Değilsin.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!member) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Üye Etiketlemeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(oxy.id === message.author.id) return message.channel.send(oxyemb.setDescription(`**Sen Çok Akıllısın Kanka.**`).setColor(config.renk_kırmızı)).then(o => o.delete({timeout: 5000}));
  if(!sebep) return message.channel.send(oxyemb.setDescription(`**Kişinin neden Mutesini Kaldırıcaksın ?**`).setColor(config.renk_kırmızı)).then(o => o.delete({timeout: 5000}));
   
    //=================DATA BASE=================//
    db.push(`ceza_${oxy.id}` , `\n\`>\` <@!${message.author.id}> adlı kullanıcı tarafından \`${oxytarih}\` Tarihinde \`${sebep}\` Sebebiyle **Ses Mutesi Açıldı.**`)
    db.add(`cezaNo_${message.guild}`, 1);
    db.delete(`vmute_${oxy.id}`)
    //=================DATA BASE=================//
  channels.jailLog.send(oxyemb.setFooter(`Ceza No : \`${cezaNo}\``).setColor(config.renk_siyah).setDescription(`\`•\` **Ses Mutesi Açıldı.**\n\n**•** Ses Mutesini Açan Yetkili : <@!${message.author.id}> (\`${message.author.id}\`)\n**•** Susturması Açılan : <@!${oxy.id}> (\`${oxy.id}\`)\n**•** Sebebi : \`${sebep}\`\n**•** Tarih : \`${oxytarih}\``))
  message.channel.send(oxyemb.setFooter(`Ceza No : \`${cezaNo}\``).setDescription(`**${oxy} Adlı Kullanıcı Başarıyla Ses Mutesi Açıldı.**`).setColor(config.renk_yesil)).then(o => o.delete({timeout: 10000}));
  await oxy.voice.setMute(false);
      
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['unjail' ,'af'],
    permLevel: 0,
}

exports.help = {
      name: "unjail"  
}