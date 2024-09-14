import OpenAI from "openai";
const openai = new OpenAI();
import { fetch } from "bun";
import { load } from "cheerio";
import * as cheerio from "cheerio";

/**
 * takes in html of URL
 * passes to LLM
 * return LLM-generated description summary, title, and imgURL as a Summary object
 */

type Summary = {
  title: string;
  description: string;
  imageURL: string;
};

async function fetchHTML(url: string) {
  const response = await fetch(url);
  return await response.text();
}

function extractOGImg(html: string): string {
  const $ = cheerio.load(html);
  const ogImage = $('meta[property="og:image"]').attr("content");
  return ogImage || "";
}

async function generateSummaries(
  html: string,
  ogImage: string
): Promise<Summary> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Your task is to analyze the HTML content of a webpage and provide two summaries.",
      },
      {
        role: "user",
        content: `Analyze the following HTML content and provide these outputs:
        1. A title (max 30 characters)
        2. A brief description, identify one non-obvious insight and do not use any version of the phrase "one notable insight is..."(max 250 characters)
        
        Format your response as follows:
        Title: [Your title here]
        Description: [Your description here]  

        The HTML content to analyze is provided after this line:
        ${html}
        `,
      },
    ],
  });

  const AIResponse = completion.choices[0].message.content;
  if (!AIResponse) {
    throw new Error("Failed to get AI response content");
  }
  return parseSummary(AIResponse, ogImage);
}

function parseSummary(AISummary: string, ogImg: string): Summary {
  const lines = AISummary.split("\n");
  //init Summary object byt using Partial to create an object that doesnt have all the properties yet
  const summary: Partial<Summary> = {
    imageURL: ogImg,
  };

  lines.forEach((line) => {
    if (line.startsWith("Title:")) {
      summary.title = line.slice(6).trim();
    } else if (line.startsWith("Description")) {
      summary.description = line.slice(12).trim();
    }
  });

  if (!summary.title || !summary.description) {
    throw new Error("Failed to parse summary from OpenAI response");
  }

  return summary as Summary;
}

export async function summarizeUrl(url: string): Promise<Summary> {
  try {
    const html = await fetchHTML(url);
    const imageURL = extractOGImg(html);
    return await generateSummaries(html, imageURL);
  } catch (error) {
    console.error("Error summarizing url", error);
    throw error;
  }
}

// TESTING;
// summarizeUrl("https://www.maximumnewyork.com/p/nycs-elizabeth-street-garden")
//   .then((summary) => console.log(summary))
//   .catch((error) => console.error("error: ", error));
