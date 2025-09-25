
'use server';

import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions';
import { conductInterview } from '@/ai/flows/conduct-interview';
import { z } from 'zod';

const generateFormSchema = z.object({
  topic: z.string().min(1, 'Please select a topic.'),
});

type GenerateState = {
  questions: string[];
  error?: string;
  topic?: string;
};

export async function handleGenerateInterviewQuestions(
  prevState: GenerateState,
  formData: FormData
): Promise<GenerateState> {
  try {
    const validatedFields = generateFormSchema.safeParse({
      topic: formData.get('topic'),
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        error: validatedFields.error.flatten().fieldErrors.topic?.[0],
      };
    }

    const { topic } = validatedFields.data;
    const result = await generateInterviewQuestions({ topic });

    return { questions: result.questions, topic, error: undefined };
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return {
      ...prevState,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}


const conductInterviewSchema = z.object({
  topic: z.string(),
  history: z.string(),
  userResponse: z.string().optional(),
});

type ConductInterviewState = {
  history: { role: 'user' | 'model'; parts: string }[];
  error?: string;
};

export async function handleConductInterview(
  prevState: ConductInterviewState,
  formData: FormData
): Promise<ConductInterviewState> {
  const validatedFields = conductInterviewSchema.safeParse({
    topic: formData.get('topic'),
    history: formData.get('history'),
    userResponse: formData.get('userResponse'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      error: 'Invalid form data.',
    };
  }

  try {
    const { topic, history, userResponse } = validatedFields.data;
    
    const parsedHistory: { role: 'user' | 'model'; parts: string }[] = JSON.parse(history);
    
    if (userResponse) {
      parsedHistory.push({ role: 'user', parts: userResponse });
    }

    const result = await conductInterview({ topic, history: parsedHistory });
    
    const newHistory = [...parsedHistory, { role: 'model' as const, parts: result.response }];

    return { history: newHistory };
  } catch (error) {
    console.error('Error in conduct interview action:', error);
    return {
      ...prevState,
      error: 'Failed to get response from AI. Please try again.',
    };
  }
}
