
'use server';

/**
 * @fileOverview An AI agent for conducting a mock interview.
 *
 * - conductInterview - A function that handles the interview conversation flow.
 * - ConductInterviewInput - The input type for the conductInterview function.
 * - ConductInterviewOutput - The return type for the conductInterview function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.string(),
});

export const ConductInterviewInputSchema = z.object({
  topic: z.string().describe('The subject of the interview (e.g., Linear Algebra).'),
  history: z.array(HistoryItemSchema).describe('The conversation history so far.'),
});
export type ConductInterviewInput = z.infer<typeof ConductInterviewInputSchema>;

export const ConductInterviewOutputSchema = z.object({
  response: z.string().describe('The interviewer\'s next question or comment.'),
});
export type ConductInterviewOutput = z.infer<typeof ConductInterviewOutputSchema>;


export async function conductInterview(
  input: ConductInterviewInput
): Promise<ConductInterviewOutput> {
  return conductInterviewFlow(input);
}

const prompt = ai.definePrompt(
  {
    name: 'conductInterviewPrompt',
    input: { schema: ConductInterviewInputSchema },
    output: { schema: ConductInterviewOutputSchema },

    prompt: `You are an expert interviewer for a top-tier quantitative finance firm. Your role is to conduct a mock technical interview with a candidate.

The topic for this interview is: {{{topic}}}.

- If the conversation history is empty, start with a friendly opening and ask the first technical question related to the topic.
- If the user has responded, briefly acknowledge their answer. Do not give feedback or corrections.
- Ask the next logical question. Keep your questions concise and technical.
- Maintain a professional, neutral, and slightly formal tone.
- Do not say "Great", "Excellent" or similar praise. Just move to the next question.
- Ask only one question at a time.
- After 4-5 questions, conclude the interview with a polite closing statement like, "Alright, that's all the questions I have for you. Thanks for your time."

Conversation History:
{{#each history}}
  **{{role}}**: {{parts}}
{{/each}}
`,
  },
);

const conductInterviewFlow = ai.defineFlow(
  {
    name: 'conductInterviewFlow',
    inputSchema: ConductInterviewInputSchema,
    outputSchema: ConductInterviewOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
