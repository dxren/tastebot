import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

const command: Command = {
  metadata: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply("Pong!");
  },
};

export default command;
