import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY_CONTRACT!
);

export const contractModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});