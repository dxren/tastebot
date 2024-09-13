import { Client, Events, GatewayIntentBits } from "discord.js";
import { execute } from "./commands/utility/ping";

const token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ping") {
    await execute(interaction);
  }
  console.log(interaction);
});

client.login(token);
