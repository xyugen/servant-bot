require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
    {
        name: "ping",
        description: "Replies with the bot's latency.",
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
    },
    {
        name: "tts",
        description: "Text to speech",
        options: [
            {
                name: "mode",
                description: "Make the bot join or quit a voice channel.",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "join",
                        value: "join",
                    },
                    {
                        name: "quit",
                        value: "quit",
                    }
                ]
            }
        ]
    },
    {
        name: "debug",
        description: "Debug data",
        options: [
            {
                name: "input",
                description: "The data to be debugged.",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: "userinfo",
        description: "Get info about a user",
        options: [
            {
                name: "user",
                description: "The user to get info about.",
                type: ApplicationCommandOptionType.User,
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