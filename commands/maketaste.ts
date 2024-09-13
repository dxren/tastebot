import { EmbedBuilder, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import type { Command } from '../types';
import { summarizeSite } from '../services/scraper';

const optionUrl = new SlashCommandStringOption()
    .setName('url')
    .setDescription('The URL to make a taste from')
    .setRequired(true);

const optionUseLargeImage = new SlashCommandBooleanOption()
    .setName('use-large-image')
    .setDescription('Use a larger summary image')
    .setRequired(false);

const createEmbed = async (url: string, useLargeImage: boolean) => {
    const summary = await summarizeSite(url);
    const embed = new EmbedBuilder()
        .setTitle(summary.title)
        .setDescription(summary.summary)
        .setURL(url)
        .setColor('#ed6226');

    if (useLargeImage) {
        embed.setImage(summary.imageUrl);
    } else {
        embed.setThumbnail(summary.imageUrl);
    }

    return embed;
};

const command: Command = {
    metadata:  new SlashCommandBuilder()
        .setName('maketaste')
        .setDescription('Make a taste')
        .addStringOption(optionUrl)
        .addBooleanOption(optionUseLargeImage),
        
    execute: async (interaction) => {
        const url = interaction.options.getString('url');
        if (!url) {
            await interaction.reply('No URL provided');
            return;
        }
        const embed = await createEmbed(url, interaction.options.getBoolean('use-large-image') ?? false);
        await interaction.reply({ embeds: [embed] });
    }
};

export default command;
