
// This API route handles the request to generate a summary using OpenAI's GPT-4 model.
// It takes a title and description from the request body, sends it to OpenAI, and returns the generated summary.   
import { OpenAI } from "openai"; 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { title, description } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: `Summarize this proposal: ${title} - ${description}` }],
      model: "gpt-4",
    });

    res.status(200).json({ summary: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
}
