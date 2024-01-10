require('dotenv').config();
const { REST, Routes } = require("discord.js");

const commands = [
    {
        name: "ping",
        description: "Replies with Pong!",
    },
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