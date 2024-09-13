import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import type { Command } from "../../types";

const bingleOption = new SlashCommandStringOption()
    .setName('bingle')
    .setDescription('Ya know, bingle!')
    .setRequired(true);

const command: Command = {
    metadata: new SlashCommandBuilder()
        .setName("bing")
        .setDescription("Replies with Bong!")
        .addStringOption(bingleOption),
        
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply(`Bong! The bingle: ${interaction.options.getString('bingle')}`);
    }
}

export default command;