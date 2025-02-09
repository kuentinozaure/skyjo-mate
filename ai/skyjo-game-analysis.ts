import Groq from "groq-sdk";
import { type SkyjoGameAnalysis } from "../interface/skyjo-game-analysis";

const VISION_MODEL_USED = "llama-3.2-90b-vision-preview";

const PROMPT_TO_ANALYSIS_SKYJO_BOARD = `

    You are an expert of image analysis more precisely on Skyjo end game card

    Give all the number (negative / positive) you see on the image
    The image can have max 3 row and max 4 column

    -----------------------------
    Output :
        Return the element with the current format in JSON FORMAT :
            {
               line1: [number], // each number found in the line separated with a comma
               line2: [number], // each number found in the line separated with a comma
               line3: [number], // each number found in the line separated with a comma
            }
        
        Example :
            - {
               line1: [1,2,3,5], // image show first line : card 1, card 2, card 3, card 5
               line2: [1,4,3,5], // image show first line : card 1, card 4, card 3, card 5
               line3: [2,8,11,0] // image show first line : card 2, card 8, card 11, card 0
            }
    Constraint: 
      Avoid returning the number as one number, eg: [1,2,3,5] -> not return 1235, return comma separated number
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

  console.log(chatCompletion.choices[0].message.content);

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
