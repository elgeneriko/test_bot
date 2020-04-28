if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const token = process.env.TOKEN;
const Discord = require('discord.js');
const fetch = require("node-fetch");

const prefix = '*';

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
if(msg.author.username!=='tesbot')
  console.log(msg.content);
  if (msg.content === '!console log') {
    msg.reply('terminal updated');
  }
});

client.on('message',async msg =>{
  if(!msg.content.startsWith(prefix)){
    return;
  }
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command=='search'){
    var playerdata = await getPlayer(args);
    msg.channel.send(playerdata);
  }
});

client.on('message',async msg =>{
  if(!msg.content.startsWith(prefix)){
    return;
  }
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log(command);
  
  if(command=='coviddata'){
    covid = await getCovidData(args.join(' '));
    if(covid.state!='Total')
      msg.channel.send(`${covid.state} has ${covid.active} active cases, ${covid.deaths} deaths and ${covid.recovered} recoveries`);
    else
    msg.channel.send(`India has ${covid.active} active cases, ${covid.deaths} deaths and ${covid.recovered} recoveries`);

  }

});



async function getPlayer(name){
  try{
  const response = await fetch('https://r6.apitab.com/search/uplay/' + name + '?u=1585761495');
  const statData = await response.json();
  return (JSON.stringify(statData.players));
  }catch(err){
    console.log(err);
  }
}

async function getCovidData(city){
  try{
    const response = await fetch('https://api.covid19india.org/data.json');
    const covidData = await response.json();
    for(i=0;i<covidData.statewise.length;i++){
      if(covidData.statewise[i].state.toLowerCase()==city.toLowerCase()){
        console.log(i);
        console.log(JSON.stringify(covidData.statewise[i].state));
        console.log(JSON.stringify(covidData.statewise[i].state.toLowerCase()));
        return covidData.statewise[i];
      }
    }
    }catch(err){
        console.log(err);
  }
}

client.login(token);