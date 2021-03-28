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
  if(!message.member.roles.cache.has(roles.jailCommander) && (!message.member.roles.cache.has(roles.Seth) && !message.member.hasPermission('VIEW_AUDIT_LOG')))
  return message.channel.send(oxyemb.setDescription(`**Ops** Yeterli Yetkiye Sahip Değilsin.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!member) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Üye Etiketlemeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(!roles.jailRole) return message.channel.send(oxyemb.setDescription('**Ops** Jail Rolü Ayarlanmamış.').setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  if(oxy.id === message.author.id) return message.channel.send(oxyemb.setDescription(`**Sen Çok Akıllısın Kanka.**`).setColor(config.renk_kırmızı)).then(o => o.delete({timeout: 5000}));
  if(!sebep) return message.channel.send(oxyemb.setDescription(`**Kişiyi neden Jailden Çıkartıcaksın ?**`).setColor(config.renk_kırmızı)).then(o => o.delete({timeout: 5000}));
   
    //=================DATA BASE=================//
    db.push(`ceza_${oxy.id}` , `\n\`>\` <@!${message.author.id}> adlı kullanıcı tarafından \`${oxytarih}\` Tarihinde \`${sebep}\` Sebebiyle **Jailden Çıkartıldı.**`)
    db.add(`cezaNo_${message.guild}`, 1);
    db.delete(`jail_${oxy.id}`)
    //=================DATA BASE=================//
  channels.jailLog.send(oxyemb.setFooter(`Ceza No : \`${cezaNo}\``).setColor(config.renk_siyah).setDescription(`\`•\` **Jailden Çıkartıldı.**\n\n**•** Hapisten Çıkartan Yetkili : <@!${message.author.id}> (\`${message.author.id}\`)\n**•** Hapisten Çıkan : <@!${oxy.id}> (\`${oxy.id}\`)\n**•** Sebebi : \`${sebep}\`\n**•** Tarih : \`${oxytarih}\``))
  message.channel.send(oxyemb.setFooter(`Ceza No : \`${cezaNo}\``).setDescription(`**${oxy} Adlı Kullanıcı Başarıyla Jailden Çıkartıldı.**`).setColor(config.renk_yesil)).then(o => o.delete({timeout: 10000}));
  await oxy.setNickname(`${config.tag2} İsim | Yaş`);
  await oxy.roles.add(roles.unregister1);
  await oxy.roles.add(roles.unregister2);
  await oxy.roles.cache.forEach(r => {oxy.roles.remove(r.id)});
      
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