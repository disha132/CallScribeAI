const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeTranscript = async (transcript) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
  });

  const prompt = `
You are an AI meeting assistant.

Analyze the following meeting transcript and return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "A concise summary of the meeting",
  "keyPoints": [
    "Important point 1",
    "Important point 2"
  ],
  "actionItems": [
    "Action item 1",
    "Action item 2"
  ],
  "decisions": [
    "Decision 1",
    "Decision 2"
  ]
}

If there is no relevant information for a section, return an empty array.

Meeting transcript:
${transcript}
`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();

  const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedResponse);
};

module.exports = {
  analyzeTranscript,
};