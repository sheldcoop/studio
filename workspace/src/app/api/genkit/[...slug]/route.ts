
'use server';

import { appRoute } from '@genkit-ai/next';
import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';

/**
 * NOTE: This is a placeholder flow to make the API route work.
 * You should replace this with your actual Genkit flow.
 * The key is to define a flow and then pass it to the `appRoute` function.
 */
export const exampleFlow = defineFlow(
  {
    name: 'exampleFlow',
    inputSchema: z.object({ name: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    return `Hello, ${input.name}!`;
  }
);

// The 'appRoute' function correctly creates the GET and POST handlers
// for your Genkit flow.
export const { GET, POST } = appRoute({
  flow: exampleFlow,
});
