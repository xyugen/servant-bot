require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
    {
        name: "ping",
        description: "Replies with Pong!",
    },
    {
        name: "decide",
        description: "Let the bot decide!",
        options: [
            {
                name: "first-choice",
                description: "The first choice",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "second-choice",
                description: "The second choice",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "third-choice",
                description: "The third choice",
                type: ApplicationCommandOptionType.String,
                required: false,
            }
        ]
    }
];

const registerSlashCommands = async () => {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
    console.log("Registering slash commands...");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
    });

    console.log("Successfully registered application (/) commands!");
    } catch (error) {
        console.error(error);
    }
};

registerSlashCommands();