import { REST, Routes } from "discord.js";
import { data, execute } from "./utility/ping";
import { getEnv } from "../utils/utils";

// const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

const token = getEnv("DISCORD_TOKEN");

if (!token || !clientId || !guildId) throw new Error("failed to load token");
const rest = new REST().setToken(token);

const deploy = async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    const result = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [data.toJSON()] }
    );
    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
};

deploy();
