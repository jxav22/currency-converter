import OpenAI from "openai";
import dotenv from 'dotenv';
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

dotenv.config()
const openai = new OpenAI();

const app = express();
const port = 3000;
app.use(bodyParser.json());

// Helper function to call the currency conversion API
const convertCurrency = async (amount) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://test.immersve.com/api/currency/convert?currency=NZD&amount=${amount}`,
    headers: {
      Accept: 'application/json',
      'x-api-key': process.env.IMMERSVE_API_KEY,
      'x-api-secret': process.env.IMMERSVE_API_SECRET,
    },
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Currency conversion API error:', error.message);
    throw new Error('Failed to fetch currency conversion data.');
  }
};


// API endpoint to handle prompt
app.post('/prompt', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Use OpenAI to parse the user's input
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a bot that extracts the amount of money specified by the user, as an integer" },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const rawContent = completion.choices[0].message.content;
  const amount = Number(rawContent);

  const response = isNan(amount) ? rawContent : await convertCurrency(amount);

  res.status(200).json({ message: response });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});