import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const metadata = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply("Pong!");
};