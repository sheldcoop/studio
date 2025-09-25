
'use server';

import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions';
import { z } from 'zod';

const formSchema = z.object({
  topic: z.string().min(1, 'Please select a topic.'),
});

type State = {
  questions: string[];
  error?: string;
};

export async function handleGenerateInterviewQuestions(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const validatedFields = formSchema.safeParse({
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

    return { questions: result.questions, error: undefined };
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return {
      ...prevState,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
