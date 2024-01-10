require('dotenv').config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

client.login(process.env.TOKEN);
