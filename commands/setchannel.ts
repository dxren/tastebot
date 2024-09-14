import { SlashCommandBuilder, ChatInputCommandInteraction, channelMention } from "discord.js";
import type { Command, ConfigObject } from "../types";
import path from "path";
import fs from 'node:fs/promises';

const CONFIG_PATH = '../config.json';

const updateConfig = async (tasteChannelId: string): Promise<string | undefined> => {
    const configPath = path.join(__dirname, CONFIG_PATH);
    const config: ConfigObject = (await import(configPath)).default;
    if (!config) return;
    const newConfig = {...config};
    newConfig.tasteChannelId = tasteChannelId;
    try {
        await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2));
    } catch (e) {
        console.error(e);
        return String(e);
    }
}

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
    const error = await updateConfig(channelId);
    if (error) {
        interaction.reply({ ephemeral: true, content: `Error updating config: ${error}`});
        return;
    }
    interaction.reply({ ephemeral: true, content: `Got it! TasteBot will now write to ${channelMention(channelId)}` });
  },
};

export default command;