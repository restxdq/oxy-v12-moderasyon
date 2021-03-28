const Discord = require('discord.js');//
const client = new Discord.Client();//
const chalk = require('chalk');//
const moment = require('moment');//
const { Client, Util } = require('discord.js');//
const fs = require('fs');//
const db = require('quick.db');//
require('./util/eventLoader.js')(client);//
const snekfetch = require('snekfetch');//

const roles = require('./oxy/roles.json');//
const channels = require('./oxy/channels.json');//
const config = require('./oxy/config.json');//
const settings = require('./oxy/settings.json');//
const emoji = require('./oxy/emojis.json');//

const log = message => {console.log(`${message}`);};//
const prefix = settings.prefix;

client.commands = new Discord.Collection();//
client.aliases = new Discord.Collection();//
fs.readdir('./komutlar/', (err, files) => {//
    if (err) console.error(err);//
    log(`${files.length} komut yüklenecek.`);//
    files.forEach(f => {//
        let props = require(`./komutlar/${f}`);//
        log(`Yüklenen komut: ${props.help.name}.`);//
        client.commands.set(props.help.name, props);//
        props.conf.aliases.forEach(alias => {//
            client.aliases.set(alias, props.help.name);//
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === settings.oxy) permlvl = 4;
    return permlvl;
};
var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.on('guildMemberAdd', async(member) => {
    let sürevMute = db.fetch(`sürevMute_${member.id}`)
    let süreMute = db.fetch(`süreMute_${member.id}`)
    let jail = db.get(`jail_${member.id}`) || 0;
    let vmute = db.get(`vmuted_${member.id}`) || 0;
    let mute = db.get(`muted_${member.id}`) || 0;
    const oxyemb = new Discord.MessageEmbed().setAuthor(`Küçük Fare Seni..`, client.avatarURL({ dynamic: true })).setFooter(config.durum).setTimestamp()
    const kanal = member.guild.channels.cache.find(r => r.id === channels.jailChat);
    let replies = ["https://cdn.discordapp.com/attachments/760226817898053702/825049053321494578/33CYhED.gif","https://tenor.com/view/anime-punch-wall-ouch-gif-9509158","https://media.discordapp.net/attachments/697505578972348436/806509067144134664/35.gif"];
    let result = Math.floor((Math.random() * replies.length));
    if(vmute === 0) return;
    if(vmute > 0){
    await member.voice.setMute(true);
    setTimeout(function(){db.push(`ceza_${member.id}` , `\n\`>\` <@!${member.id}> adlı kullanıcının olan Ses mutesi bitti.`)
    db.delete(`vmuted_${member.id}`)
    await member.voice.setMute(false);
}, ms(sürevMute));
    }
    if(mute === 0) return;
    if(mute > 0){
    await member.roles.add(roles.mutedRole);
    setTimeout(function(){db.push(`ceza_${member.id}` , `\n\`>\` <@!${member.id}> adlı kullanıcının olan mutesi bitti.`)
    db.delete(`muted_${member.id}`)
    await member.roles.remove(roles.mutedRole);
}, ms(süreMute));
    }
    if (jail === 0) return;
    if (jail > 0) {
    kanal.send(oxyemb.setThumbnail(replies[result]).setColor(config.renk_mavi).setDescription(`Maalesef. <@!${member.id}> Sen Çok Akıllı Bir Faresin. Yerine Dön Şimdi.`))
    await member.roles.set([roles.jailRole]);
    }
    })

client.on("message" , async message => {
    if(!message.guild) return;
    if(message.content.startsWith(settings.prefix+"afk")) return; 
    let afk = message.mentions.users.first()
    const kisi = db.fetch(`afkid_${message.author.id}_${message.guild.id}`)
    const isim = db.fetch(`afkAd_${message.author.id}_${message.guild.id}`)
    if(afk){
    const oxy = db.fetch(`afkoxy_${afk.id}_${message.guild.id}`)
    const kisi3 = db.fetch(`afkid_${afk.id}_${message.guild.id}`)
    if(message.content.includes(kisi3)){
    message.channel.send(new Discord.MessageEmbed().setColor(config.renk_kırmızı).setDescription(`<@` + message.author.id + `> Etiketlediğiniz Kişi Afk \nSebep : ${oxy}`))}}
    if(message.author.id === kisi){
    message.channel.send(new Discord.MessageEmbed().setColor(config.renk_yesil).setDescription(`<@${kisi}> Başarıyla Afk Modundan Çıktınız`))
    db.delete(`afkoxy_${message.author.id}_${message.guild.id}`)
    db.delete(`afkid_${message.author.id}_${message.guild.id}`)
    db.delete(`afkAd_${message.author.id}_${message.guild.id}`)
    message.member.setNickname(isim)}   
});

client.on('messageDelete', message => {
    const data = require("quick.db")
    data.set(`snipe.mesaj.${message.guild.id}`, message.content)
    data.set(`snipe.id.${message.guild.id}`, message.author.id)
  })

client.login(settings.token);