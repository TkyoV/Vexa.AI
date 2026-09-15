import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const instructions = `You are Vexa, Mr. Hazil's personal AI assistant.
Be friendly, concise, helpful, and natural.
The user may speak English or Malayalam; reply in the language the user uses.
You are currently running as a web prototype. Do not claim you can control the phone,
make calls, or access private apps unless those capabilities are actually connected.`;

app.get("/health", (_, res) => res.json({ ok: true, service: "Vexa AI" }));

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message ?? "").trim();
    if (!message) return res.status(400).json({ error: "Message is required." });

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions,
      input: message
    });

    res.json({ reply: response.output_text || "I couldn't generate a response." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Vexa could not reach the AI service. Check the server and API key."
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Vexa AI server running on http://localhost:${process.env.PORT || 3000}`);
});