import {
  EmbedBuilder,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import type { Command } from "../types";
import { summarizeUrl } from "../services/openai/getSummary";

const optionUrl = new SlashCommandStringOption()
  .setName("url")
  .setDescription("The URL to make a taste from")
  .setRequired(true);

const optionUseLargeImage = new SlashCommandBooleanOption()
  .setName("use-large-image")
  .setDescription("Use a larger summary image")
  .setRequired(false);

const createEmbed = async (url: string, useLargeImage: boolean) => {
  const summary = await summarizeUrl(url);
  const embed = new EmbedBuilder()
    .setTitle(summary.title)
    .setDescription(summary.description)
    .setURL(url)
    .setColor("#ed6226");

  if (useLargeImage) {
    embed.setImage(
      summary.imageURL ||
        "https://cdn.discordapp.com/attachments/1283885817223446551/1284142569877667860/download_1.png"
    );
  } else {
    embed.setThumbnail(
      summary.imageURL ||
        "https://cdn.discordapp.com/attachments/1283885817223446551/1284142569877667860/download_1.png"
    );
  }

  return embed;
};

const command: Command = {
  metadata: new SlashCommandBuilder()
    .setName("maketaste")
    .setDescription("Make a taste")
    .addStringOption(optionUrl)
    .addBooleanOption(optionUseLargeImage),

  execute: async (interaction) => {
    await interaction.deferReply();
    const url = interaction.options.getString("url");
    if (!url) {
      await interaction.editReply("No URL provided");
      return;
    }
    const embed = await createEmbed(
      url,
      interaction.options.getBoolean("use-large-image") ?? false
    );
    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
