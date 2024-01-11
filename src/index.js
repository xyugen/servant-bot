require('dotenv').config();
const { EmbedBuilder, Client, Events, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply({ 
            content: `🏓 Latency is \`${Date.now() - interaction.createdTimestamp}ms\`. API Latency is \`${Math.round(client.ws.ping)}ms\``,
            ephemeral: true
        });
    }

    if (interaction.commandName === "decide") {
        const choice1 = interaction.options.getString("first-choice");
        const choice2 = interaction.options.getString("second-choice");
        const choice3 = interaction.options.getString("third-choice");
        const choices = [choice1, choice2, choice3].filter(Boolean);

        const randomIndex = Math.floor(Math.random() * choices.length);
        const decision = choices[randomIndex];

        await interaction.reply(`The decision is: ${decision}`);
    }
});

/* client.on("messageCreate", async (message) => {
    const embed = new EmbedBuilder()
      .setTitle("Verification")
      .setColor(0x6cba48)
      .setDescription("React with ✅ to verify yourself.");
    if (message.content.toLowerCase() === "!verify") {
        const verificationMessage = await message.channel.send({ embeds: [embed] });
        verificationMessage.react("✅");
    }
}); */

const verificationMessageId = "1194945458137731153";

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (
        reaction.message &&
        reaction.message.id === verificationMessageId &&
        reaction.emoji.name !== "✅"
    ) {
        reaction.remove();
        return;
    }
    
    if (
        reaction.message &&
        reaction.message.id === verificationMessageId &&
        reaction.emoji.name === '✅'
    ) {
        console.log("Verifying user...");
        const message = await user.send("You are being verified...");

        // Get the user who reacted
        const verifiedUser = reaction.message.guild.members.cache.get(user.id);

        // Assign the "verified" role
        const verifiedRole = reaction.message.guild.roles.cache.find((role) => role.name === "verified");
        
        try {
            if (verifiedRole) {
                verifiedUser.roles.add(verifiedRole);
                console.log((`User ${user.tag} has been verified.`));
                message.edit("You have been verified in IT Dark Room!");
            }
        } catch (error) {
            console.error(error);
        }
    }
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (
        reaction.message &&
        reaction.message.id === verificationMessageId &&
        reaction.emoji.name === '✅'
    ) {
        // Get the user who reacted
        const verifiedUser = reaction.message.guild.members.cache.get(user.id);

        // Remove the "verified" role
        const verifiedRole = reaction.message.guild.roles.cache.find((role) => role.name === "verified");

        try {
            if (verifiedRole && verifiedUser.roles.cache.has(verifiedRole.id)) {
                verifiedUser.roles.remove(verifiedRole);
                console.log(`User ${user.tag} has been unverified.`);
            }
        } catch (error) {
            console.error(error);
        }
    }
})

const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

client.login(process.env.TOKEN);
