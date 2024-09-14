import {
  EmbedBuilder,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandStringOption,
  userMention,
} from "discord.js";
import type { Command } from "../types";
import { summarizeUrl } from "../services/openai/getSummary";
import path from "node:path";

const CONFIG_PATH = '../config.json';

const optionUrl = new SlashCommandStringOption()
  .setName("url")
  .setDescription("The URL to make a taste from")
  .setRequired(true);

const optionUseLargeImage = new SlashCommandBooleanOption()
  .setName("use-large-image")
  .setDescription("Use a larger summary image")
  .setRequired(false);

const createEmbed = async (url: string, userId: string, useLargeImage: boolean) => {
  const summary = await summarizeUrl(url);
  const embed = new EmbedBuilder()
    .setTitle(summary.title)
    .setDescription(`${summary.description}\n\nSubmitted by ${userMention(userId)}`)
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

      const config = await import(path.join(__dirname, CONFIG_PATH));
      const tasteChannel = interaction.guild?.channels.cache.get(config.tasteChannelId);
      if (!tasteChannel) {
        interaction.reply({ content: `Failed to find channel with id: ${config.tasteChannelId || '(none)'}. Please run /setchannel first.`, ephemeral: true });
        return;
      } else if (!tasteChannel.isTextBased || !tasteChannel.isSendable()) {
        interaction.reply({ content: `Channel ${config.tasteChannelId} cannot be used.`, ephemeral: true });
        return;
      }
    interaction.reply({ content: 'Generating your summary...', ephemeral: true });
    const url = interaction.options.getString("url");
    if (!url) {
      await interaction.editReply("No URL provided");
      return;
    }
    const embed = await createEmbed(
      url,
      interaction.user.id,
      interaction.options.getBoolean("use-large-image") ?? false
    );
    const newMessage = await tasteChannel.send({ embeds: [embed] });
    await interaction.editReply(`Done! See your post [here](${newMessage.url})!`);
  },
};

export default command;
