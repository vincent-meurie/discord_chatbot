const Eris = require("eris")
require('dotenv').config()

const PREFIX = '!';

const bot = new Eris(process.env.BOT_TOKEN);

const commandHandlerForCommandName = {};
commandHandlerForCommandName['quelbuild'] = (msg, args) => {
    return msg.channel.createMessage({content: `Stuff classique par défaut, et option critique si :\
    peu de range en face, besoin de sidelane 1v1, \
    déjà une frontline dans l'équipe, \
    pas trop de cc en face, squishy en face`, messageReferenceID: msg.id})
}

commandHandlerForCommandName['buildcrit'] = (msg, args) => {
    return msg.channel.createMessage({content: `Le build critique de Garen : Berserker -> Estropieur -> Danseur Fantôme -> Prestelames Navori -> Salutations de Dominik ou Rappel Mortel -> Collector`, messageReferenceID: msg.id})
}

commandHandlerForCommandName['build'] = (msg, args) => {
    return msg.channel.createMessage({content: `Le nouveau build (depuis le rework Rappel Mortel) : Berserker -> Estropieur -> Plaque du Mort -> Couperet Noir -> Force de la Nature -> Gage de Sterak`, messageReferenceID: msg.id})
}

commandHandlerForCommandName['runes'] = (msg, args) => {
    return msg.channel.createMessage({content: `Phase Rush -> Matchups scale, ranged et où il faut disengage | Conqueror -> Matchups mêlée gagnables en early | En dessous de Platinum 2, je vous conseille de prendre Conqueror toutes les games`, messageReferenceID: msg.id})
}

commandHandlerForCommandName['opgg'] = (msg, args) => {
    return msg.channel.createMessage({content: `https://www.op.gg/multisearch/euw?summoners=STREYITO%2CStrey+en+mission%2CLFT+Strey`, messageReferenceID: msg.id})
}

commandHandlerForCommandName['playlist'] = (msg, args) => {
    return msg.channel.createMessage({content: `La playlist médiévale : https://open.spotify.com/playlist/2hFIMWxjIeDB1PLqksENuG?si=650f7706f13c48f8 La playlist Oblivion : https://open.spotify.com/playlist/6h5eZko4HLKBFeGkHpKlUX?si=1f9c65083f2c4e48 et la playlist Skyrim : https://open.spotify.com/album/25r7pEf31viAbsoVHC6bQ4?si=zbjtDClwQ6yN6eqC-063wg`, messageReferenceID: msg.id})
}

commandHandlerForCommandName['qui'] = (msg, args) => {
    return msg.channel.createMessage({content: `https://lolpros.gg/live/strey`, messageReferenceID: msg.id})
}

commandHandlerForCommandName['vod'] = (msg, args) => {
    return msg.channel.createMessage({content: `La chaîne VOD avec les meilleures games de chaque stream : https://www.youtube.com/channel/UCzI3AVV_K0x_QHgvjqWKqXg`, messageReferenceID: msg.id})
}

commandHandlerForCommandName['rank'] = (msg, args) => {
    const rankFetch = async(msg, args) => {
        const accountUrl = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${args.join('%20')}?api_key=${process.env.API_KEY}`
        let result = await fetch(accountUrl)
        const id =JSON.parse(await result.text()).id
        const rankUrl = await `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${process.env.API_KEY}`
        result = await fetch(rankUrl)
        data = JSON.parse(await result.text())

        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }

        try {
            if (typeof data[1] !== 'undefined') {
                data[0] = data[1]
            }
            const {summonerName, tier, rank, leaguePoints} = data[0]
            if (tier === "MASTER" || tier === "GRANDMASTER" || tier === "CHALLENGER") {
                return msg.channel.createMessage({content: `${summonerName} est actuellement ${capitalize(tier.toLowerCase())} avec ${leaguePoints} LP.`, messageReferenceID: msg.id})
            }
            else {
                return msg.channel.createMessage({content: `${summonerName} est actuellement ${capitalize(tier.toLowerCase())} ${rank} avec ${leaguePoints} LP.`, messageReferenceID: msg.id})
            }
        } catch (e) {
             return msg.channel.createMessage({content: `Invalid or unranked Summoner name.`, messageReferenceID: msg.id})
        }
    }

    rankFetch(msg, args)
}
bot.on("ready", () => {
    console.log('connected and ready !')
})

bot.on("messageCreate", async (msg) => {
    const content = msg.content;

    if (!msg.channel.guild) return;
    if (!content.startsWith(PREFIX)) return;

    const parts = content.split(' ').map(s => s.trim()).filter(s => s);
    const commandName = parts[0].substr(PREFIX.length);

    const commandHandler = commandHandlerForCommandName[commandName];

    if (!commandHandler) return;

    const args = parts.slice(1)

    try {
        await commandHandler(msg, args);
    } catch (e) {
        console.warn('Error handling command');
        console.warn(e);
    }
});

bot.on('error', e => {
    console.warn(e);
});

bot.connect();