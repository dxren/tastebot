import type { ConfigObject } from "./types";

import startupConfig from './config.json';
import { writeFile } from "fs/promises";
import path from "path";

const CONFIG_PATH = './config.json';

export const config: ConfigObject = {
    tasteChannelId: startupConfig.tasteChannelId
};

export const setTasteChannelId = async (tasteChannelId: string): Promise<string | undefined> => {
    config.tasteChannelId = tasteChannelId;
    try {
        writeFile(path.join(__dirname, CONFIG_PATH), JSON.stringify(config, null, 2));
    } catch (e) {
        console.error(e);
        return String(e);
    }
}