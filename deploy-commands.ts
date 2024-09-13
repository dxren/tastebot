import { REST, Routes } from "discord.js";
import { getEnv } from "./utils/utils";
import getCommands from "./utils/getCommands";

const clientId = getEnv("DISCORD_CLIENT_ID");
const guildId = getEnv("DISCORD_GUILD_ID");
const token = getEnv("DISCORD_TOKEN");

if (!token || !clientId || !guildId) throw new Error("failed to load token");
const rest = new REST().setToken(token);

const deploy = async () => {
    const commandList = await getCommands();
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commandList.map((command) => command.metadata.toJSON()) }
        );
        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
};

deploy();
