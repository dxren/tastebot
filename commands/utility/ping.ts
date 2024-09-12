import {
  ChatInputCommandInteraction,
  CommandInteraction,
  SlashCommandBuilder,
  type Interaction,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply("Pong!");
};

export { data, execute };
