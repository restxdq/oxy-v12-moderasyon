const { MessageEmbed } = require("discord.js");
const data = require("quick.db");

exports.run = async (client, message, args) => {
  const oxy = await data.fetch(`snipe.id.${message.guild.id}`);
  if (!oxy) {const oksi = new MessageEmbed().setAuthor(client.user.username, client.user.avatarURL()).setDescription(`Mesaj bulunamadı!`).setColor(`BLACK`);
    message.channel.send(oksi);
  } else {
    let kullanıcı = client.users.cache.get(oxy);
    const zyn = await data.fetch(`snipe.mesaj.${message.guild.id}`);
    const zynask = new MessageEmbed().setAuthor(kullanıcı.username, kullanıcı.avatarURL()).setDescription(`Silinen mesaj: ` + zyn + `\nSilen Kişi : \n ${oxy}`).setColor(`BLACK`);
    message.channel.send(zynask);
  }
};

exports.conf = {
    aliases: ["snipe", "sonmesaj"],
    usage: ".snipe",
    description: "Belirtilen mesaj sayısı kadar mesaj temizler."
  };
  
  exports.help = {
    name: "snipe"
  };