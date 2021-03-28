const { MessageEmbed } = require("discord.js");
const config = require('../oxy/config.json');

exports.run = async (client, message, args, ayar, emoji) => {
const oxyemb = new Discord.MessageEmbed().setAuthor(message.member.displayName,message.author.avatarURL({ dynamic: true })).setTimestamp().setFooter(config.durum)
if (!message.member.hasPermission("MANAGE_MESSAGES"))return message.channel.send(oxyemb.setColor(config.renk_kırmızı).setDescription("Bu komutu kullanabilmek için **Mesajları Yönet** iznine sahip olmalısın!")).then(x => x.delete({ timeout: 5000 }));
if (!args[0] ||(args[0] && isNaN(args[0])) ||Number(args[0]) < 1 ||Number(args[0]) > 100) return message.channel.send(oxyemb.setColor(config.renk_kırmızı).setDescription("1-100 arasında silinecek mesaj miktarı belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
await message.delete().catch();
 message.channel.bulkDelete(Number(args[0])).then(msjlar =>message.channel.send(oxyemb.setColor(config.renk_yesil).setDescription(`Başarıyla **${msjlar.size}** adet mesaj silindi!`)).then(x => x.delete({ timeout: 5000 }))).catch();
};
exports.conf = {
  aliases: ["sil", "clear"],
  usage: "temizle 1-100",
  description: "Belirtilen mesaj sayısı kadar mesaj temizler."
};

exports.help = {
  name: "temizle"
};