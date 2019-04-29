// this code was given to me by 1988_YumChocolate from the ROBLOX API Server, all credits (as far as I know) go to him



const roblox = require('noblox.js')
const Discord = require('discord.js')
const client = new Discord.Client();
var token = "NTcyMDUwNDUxMDg4ODAxODEz.XMWs2w.eGUDbcxgRq3XMw7BfEyarh2X3o8";

client.login(token)

var cookie = "0AD4193A6FEFE5792FECBE12271278FBA8DB0E54FD4658D2D20AFD469D195855A60CDC95DC02E722076A8E468D493AD6F7C6FC40EE5F4D4268FF619CD80EC6E2467234094C13E0AE23AA4586165FEA01282B333F0FB6C980E8DEB782B895CD09FEAB0C81462C0E76E49E0CD7D0FDCC2F83AEE8E4E2D3EA9EC0815202B49BC177B2326D3CDB6CC8F4E96D12BC2907733CE530704C205AA207456572405ED9E638EEA8E6AE452D5C911B519300DAAD6B3EC936E75BD744AE6F25B52AA7DEECCAA88B8342363067C758CBACCCF8474FE61DED39752ACB347C4805B4A87922C0D9F767BC7BBDC4AE108AF148E0BB2FBF3CB6B09212B45483C89667B79C674DD7BEC2F939D042024C152606F1EA12756D78B4457CC5DE0B49F5C190CF84F27663BA4F946C3034";
var prefix = '.';
var groupId = 3186545;
var maximumRank = 19;

function login() {
    return roblox.cookieLogin(cookie);
}

login() // Log into ROBLOX
    .then(function() { // After the function has been executed
        console.log('Logged in.') // Log to the console that we've logged in
    })
    .catch(function(error) { // This is a catch in the case that there's an error. Not using this will result in an unhandled rejection error.
        console.log(`Login error: ${error}`) // Log the error to console if there is one.
    });
 
function isCommand(command, message){
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}
 
client.on('message', (message) => {
    if (message.author.bot) return; // Dont answer yourself.
    var args = message.content.split(/[ ]+/)
   
    if(isCommand('rank', message)){
       if(!message.member.roles.some(r=>["Ranker"].includes(r.name)) ) // OPTIONAL - Checks if the sender has the specified roles to carry on further
        return message.reply("You can't use this command.");
        var username = args[1]
        var rankIdentifier = Number(args[2]) ? Number(args[2]) : args[2];
        if (!rankIdentifier) return message.channel.send("Please enter a rank");
        if (username){
            message.channel.send(`Checking ROBLOX for ${username}`)
            roblox.getIdFromUsername(username)
            .then(function(id){
                roblox.getRankInGroup(groupId, id)
                .then(function(rank){
                    if(maximumRank <= rank){
                        message.channel.send(`${id} is rank ${rank} and not promotable.`)
                    } else {
                        message.channel.send(`${id} is rank ${rank} and promotable.`)
                        roblox.setRank(groupId, id, rankIdentifier)
                        .then(function(newRole){
                            message.channel.send(`Changed rank`)
                        }).catch(function(err){
                            console.error(err)
                            message.channel.send("Failed to change rank.")
                        });
                    }
                }).catch(function(err){
                    message.channel.send("Couldn't get that player in the group.")
                });
            }).catch(function(err){
                message.channel.send(`Sorry, but ${username} doesn't exist on ROBLOX.`)
           });
       } else {
           message.channel.send("Please enter a username.")
       }
       return;
   }
})