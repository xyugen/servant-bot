require("dotenv").config();
const keep_alive = require("./keep_alive");
const { inspect } = require("util");
const {
    EmbedBuilder,
    Client,
    Events,
    GatewayIntentBits,
    Partials,
} = require("discord.js");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    VoiceConnectionStatus,
    NoSubscriberBehavior,
} = require("@discordjs/voice");

const { textToSpeech } = require("./tts");

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

var hasJoined = false;
const botOwnerId = "560612243012845578";

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply({
            content: `🏓 Latency is \`${
                Date.now() - interaction.createdTimestamp
            }ms\`. API Latency is \`${Math.round(client.ws.ping)}ms\``,
            ephemeral: true,
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

    // TEXT TO SPEECH
    if (interaction.commandName === "tts") {
        const voiceChannel = interaction.member?.voice;

        if (voiceChannel.channelId) {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.channelId,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });

            // Event listener for state changes
            connection.on(VoiceConnectionStatus.Disconnected, (state) => {
                interaction.channel.send(
                    "Bot disconnected from voice channel."
                );
                player.stop();
                hasJoined = false;
            });

            // MODE JOIN
            if (interaction.options.getString("mode") === "join") {
                try {
                    connection.subscribe(player);
                    hasJoined = true;

                    const resource = createAudioResource(
                        textToSpeech("Hello my niggas!")
                    );
                    player.play(resource);

                    await interaction.reply("Joined the voice channel!");
                } catch (error) {
                    console.error(
                        `Error joining voice channel: ${error.message}`
                    );
                    await interaction.reply(
                        "An error occurred while joining the voice channel."
                    );
                }
            }

            // MODE QUIT
            if (interaction.options.getString("mode") === "quit") {
                connection.destroy();
                hasJoined = false;
                await interaction.reply("Exited the voice channel!");
            }
        } else {
            await interaction.reply(
                "You need to be in a voice channel to use this command."
            );
        }
    }

    if (interaction.commandName === "debug") {
        const code = interaction.options.getString("input");

        // Check if the user invoking the command is the bot owner
        if (interaction.user.id !== botOwnerId) {
            await interaction.reply(
                "You are not the bot owner. This command is restricted."
            );
            return;
        }

        try {
            const result = eval(code);
            const formattedResult = inspect(result, { depth: 0 });

            const embed = new EmbedBuilder()
                .setTitle("Debug Output")
                .addFields(
                    { name: "📥 Input", value: `\`\`\`js\n${code}\n\`\`\`` },
                    {
                        name: "📤 Output",
                        value: `\`\`\`js\n${formattedResult}\n\`\`\``,
                    }
                )
                .setFooter({ text: `Code was executed in: ${Date.now() - interaction.createdTimestamp}ms.` })
                .setColor(0xea5c52);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply(`Error: ${error.message}`);
        }
    }
});

const iHabNoMicChannelId = "1014768193451085936";

client.on(Events.MessageCreate, async (message) => {
    if (message.channelId === iHabNoMicChannelId) {
        if (hasJoined) {
            const resource = createAudioResource(
                textToSpeech(message.content)
            );
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            })
            getVoiceConnection(message.guildId).subscribe(player);
            player.play(resource);
        }
    }
})

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
        await reaction.remove();
        return;
    }

    if (
        reaction.message &&
        reaction.message.id === verificationMessageId &&
        reaction.emoji.name === "✅"
    ) {
        console.log("Verifying user...");
        const message = await user.send("You are being verified...");

        // Get the user who reacted
        const verifiedUser = reaction.message.guild.members.cache.get(user.id);

        // Assign the "verified" role
        const verifiedRole = reaction.message.guild.roles.cache.find(
            (role) => role.name === "verified"
        );

        try {
            if (verifiedRole) {
                verifiedUser.roles.add(verifiedRole);
                console.log(`User ${user.tag} has been verified.`);
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
        reaction.emoji.name === "✅"
    ) {
        // Get the user who reacted
        const verifiedUser = reaction.message.guild.members.cache.get(user.id);

        // Remove the "verified" role
        const verifiedRole = reaction.message.guild.roles.cache.find(
            (role) => role.name === "verified"
        );

        try {
            if (verifiedRole && verifiedUser.roles.cache.has(verifiedRole.id)) {
                verifiedUser.roles.remove(verifiedRole);
                console.log(`User ${user.tag} has been unverified.`);
            }
        } catch (error) {
            console.error(error);
        }
    }
});

const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

client.login(process.env.TOKEN);
