import Groq from "groq-sdk";
import { type SkyjoGameAnalysis } from "../interface/skyjo-game-analysis";

const VISION_MODEL_USED = "llama-3.2-90b-vision-preview";

const PROMPT_TO_ANALYSIS_SKYJO_BOARD = `
    You are an expert in image analysis, specifically for recognizing numbers in a Skyjo end-game card grid.

    TASK:

    Extract and return all the numbers (both positive and negative) visible in the image.
    The grid contains a maximum of 3 rows and 4 columns.
    You should only return a maximum of 12 numbers.
    Important distinction: The numbers 6 and 9 may be visually similar, but :
      - If the number is red, it should be recognized as 9.
      - If the number is yellow, it should be recognized as 6.


    Output Format (JSON):
    
        Return the numbers as a list of integers.
        if you don't see or can't recognize a number, you can skip it and return undefined.
        Ensure numbers are comma-separated (not concatenated into a single number).
        if you don't see any numbers, return an empty list.
        
        Example :
        {
            "numbers": [1, 2, 3, 5, 1, 4, 3, 5, 2, 8, 11, 0]
        }

    Constraint:

      Do not merge numbers together
`;

export async function skyjoEndGameAnalysis(
  pngBase64Image: string
): Promise<SkyjoGameAnalysis | null> {
  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: PROMPT_TO_ANALYSIS_SKYJO_BOARD,
          },
          {
            type: "image_url",
            image_url: {
              url: pngBase64Image,
            },
          },
        ],
      },
    ],
    model: VISION_MODEL_USED,
    temperature: 0.1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false,
    response_format: { type: "json_object" },
    stop: null,
  });

  // If vision model can return a content
  if (!chatCompletion.choices[0].message.content) {
    return null;
  }

  // If we can parse the text content to the object SkyjoGameAnalysis
  // return as SkyjoGameAnalysis otherwise null
  return (
    (JSON.parse(
      chatCompletion.choices[0].message.content
    ) as SkyjoGameAnalysis) || null
  );
}
