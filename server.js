import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config({ path: './gemini.env' });

const app = express();
const PORT = 3000;

const API_KEY = process.env.GEMINI_API_KEY;
console.log("Is API key set:", API_KEY);

if (!API_KEY) {
  console.error("❌ API key is missing! Check your gemini.env file.");
  process.exit(1); // Stop the server if key is not loaded
}
console.log("✅ API key loaded.");


app.use(cors());
app.use(bodyParser.json());

app.post("/gemini", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ response: "No message provided." });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: message }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const geminiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";
    res.json({ response: geminiResponse });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ response: "Something went wrong. Check API key or network." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
