import { SlashCommandBuilder, ChatInputCommandInteraction, channelMention } from "discord.js";
import type { Command, ConfigObject } from "../types";
import path from "node:path";
import fs from 'node:fs/promises';
import { setTasteChannelId } from "../config";

const command: Command = {
  metadata: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Sets the taste channel ID")
    .addStringOption(option =>
      option.setName("channelid")
        .setDescription("The channel ID to write TasteBot posts to")
        .setRequired(true)
    ),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const channelId = interaction.options.getString("channelid");
    const channelExists = channelId && interaction.guild?.channels.cache.has(channelId);
    if (!channelExists) {
        interaction.reply({ ephemeral: true, content: `Channel ${channelId} does not seem to exist.` });
        return;
    }
    const error = await setTasteChannelId(channelId);
    if (error) {
        interaction.reply({ ephemeral: true, content: `Error updating config: ${error}`});
        return;
    }
    interaction.reply({ ephemeral: true, content: `Got it! TasteBot will now write to ${channelMention(channelId)}` });
  },
};

export default command;