const Discord = require('discord.js')
const db = require('quick.db')
const roles = require('../oxy/roles.json');
const emoji = require('../oxy/emojis.json');
const config = require('../oxy/config.json');

exports.run = async (client, message, args) => {
//----------------------------------Created By OxY.---------------------------------------------\\
let member = message.mentions.members.first() || client.users.cache.get(args.join(' '));
let oxy = message.guild.member(member)
const oxyemb = new Discord.MessageEmbed().setAuthor(message.member.displayName,message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.durum)

if (message.author.bot || message.channel.type === "dm") return;
if(!message.member.roles.cache.has(roles.banCommander) && (!message.member.roles.cache.has(roles.Seth) && !message.member.hasPermission('VIEW_AUDIT_LOG')))
return message.channel.send(oxyemb.setDescription(`**Ops** Yeterli Yetkiye Sahip Değilsin.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
if(!member) return message.channel.send(oxyemb.setDescription(`**Ops** Bir Üye Etiketlemeyi Unutmuşsun.`).setColor(config.renk_kırmızı)).then(o => o.delete({ timeout: 10000 })).catch(err => console.error(error));
  
//=================DATA BASE=================//
let banlar = db.get(`banBilgi_${oxy.id}`)
let banlist = ""
var sayı = 0
if(banlar){
sayı = banlar.lenght;
for(let oxycim = 0;
oxycim < banlar.length;
oxycim++)
{banlist+=`\n\`${oxycim}\` ${banlar}`}} 
else {banlist=`\nBu Kullanıcı Daha Önce Banlanmamış.`}
//=================DATA BASE=================//

await message.react(emoji.tik_emoji);
message.channel.send(oxyemb.setDescription(`<@${oxy.id}> **Adlı Kullanıcının Ban Geçmişi :** \n ${banlist}\n \`>\` Ceza Sebeplerine Bakmak İçin \`.sicil <@oxy/id>\``).setColor(config.renk_yesil).setThumbnail(message.author.avatarURL({ dynamic: true })))

}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["banbilgi","ban-bilgi"],
    permLevel: 0
  };
  
  exports.help = {
    name: "banbilgi",
    description: "isim geçmişini gösterir",
    usage: ".banbilgi @uye"
  };