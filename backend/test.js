import OpenAI from "openai";
import dotenv from 'dotenv';
import express from "express";
import axios from "axios";

dotenv.config()
const openai = new OpenAI();

// const completion = await openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   messages: [
//     { role: "system", content: "You are a helpful assistant." },
//     {
//       role: "user",
//       content: "Write a haiku about recursion in programming.",
//     },
//   ],
// });

// console.log(completion.choices[0].message);

// Initialize Express
const app = express();
const port = 3000;
app.use(express.json());


const prompt = "10 NZD";

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

const amount = Number(completion.choices[0].message.content);
// console.log(amount);

// Perform the conversion
// const conversionData = convertCurrency(amount).then(console.log(res));
// console.log(conversionData);
convertCurrency(amount)
  .then((res) => {
    console.log(res); // Log the response data when the promise resolves
  })
  .catch((error) => {
    console.error(error); // Handle any errors from the API call
  });
