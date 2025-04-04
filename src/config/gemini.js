//const apiKey='AIzaSyDsaqVXvGMqNY2usR9SPaM05uZcPkP1hjI'

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

async function run(prompt) {
  try {
    console.log(" Received prompt:", prompt);

    // Ensure the prompt is valid
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      throw new Error(" Invalid input: Prompt must be a non-empty string.");
    }

    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt.trim());

    if (!result?.response?.candidates || !Array.isArray(result.response.candidates)) {
      throw new Error("Invalid response format from Gemini API.");
    }

    const candidates = result.response.candidates;
    if (candidates.length === 0 || !candidates[0].content?.parts?.length) {
      throw new Error(" No valid response received from Gemini API.");
    }

    const responseText = candidates[0].content.parts[0]?.text || "No response text found.";
    console.log(" API Response:", responseText);

    return responseText;

  } catch (error) {
    console.error(" Error during execution:", error);
    return "An error occurred while generating content.";
  }
}

export default run;

