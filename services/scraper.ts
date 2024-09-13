type SiteSummary = {
    title: string;
    summary: string;
    imageUrl: string;
}
export const summarizeSite = async (url: string): Promise<SiteSummary> => {
    const title = 'Summary';
    const summary = `Summarized from ${url}`;
    const imageUrl = 'https://cdn.discordapp.com/attachments/1283885817223446551/1284142569877667860/download_1.png';

    return {
        title,
        summary,
        imageUrl,
    };
}