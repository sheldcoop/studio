'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { handleGenerateInterviewQuestions } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { quantTopics } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles />
          Generate Questions
        </>
      )}
    </Button>
  );
}

export function InterviewGenerator() {
  const { toast } = useToast();
  const initialState = { questions: [], error: undefined };
  const [state, dispatch] = useFormState(
    handleGenerateInterviewQuestions,
    initialState
  );

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            AI Interview Prep
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-grow space-y-2">
                <label htmlFor="topic-select" className="text-sm font-medium">
                  Select a Topic
                </label>
                <Select name="topic" required>
                  <SelectTrigger id="topic-select">
                    <SelectValue placeholder="e.g., Linear Algebra" />
                  </SelectTrigger>
                  <SelectContent>
                    {quantTopics.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <SubmitButton />
            </div>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          </form>
        </CardContent>
      </Card>

      {state.questions && state.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generated Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <ul className="space-y-3">
                {state.questions.map((q, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-md border border-border/50 bg-secondary/30 p-4"
                  >
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="flex-1 text-foreground/90">{q}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
