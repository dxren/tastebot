import type { Command } from "../types";
import fs from "fs";
import path from "path";

const PATH_COMMANDS = path.join(__dirname, "../commands/utility");

const getCommands = async (): Promise<Command[]> => {
    const commandFileNames = fs.readdirSync(PATH_COMMANDS);
    const commands: Command[] = (await Promise.all(commandFileNames.map(async (filename) => {
        const command = (await import(path.join(PATH_COMMANDS, filename))).default as Command;
        if (!command.execute || !command.metadata) {
            console.error(`Command ${filename} is missing execute or metadata`);
            return null;
        }
        return command;
    }))).filter((command) => command !== null);
    return commands;
}

export default getCommands;