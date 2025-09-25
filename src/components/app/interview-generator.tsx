
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import {
  handleGenerateInterviewQuestions,
  handleConductInterview,
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Sparkles, LoaderCircle, ArrowRight, Bot, User } from 'lucide-react';
import { quantTopics } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

function GenerateButton() {
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

function InterviewSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="icon">
      {pending ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <ArrowRight />
      )}
      <span className="sr-only">Submit Answer</span>
    </Button>
  );
}

type InterviewHistory = { role: 'user' | 'model'; parts: string }[];

export function InterviewGenerator() {
  const { toast } = useToast();
  const [view, setView] = useState<'generate' | 'list' | 'session'>('generate');

  const [generateState, generateDispatch] = useFormState(
    handleGenerateInterviewQuestions,
    { questions: [], error: undefined }
  );

  const [interviewState, interviewDispatch] = useFormState(handleConductInterview, {
    history: [],
    error: undefined,
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (generateState.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: generateState.error,
      });
    }
    if (generateState.questions.length > 0) {
      setView('list');
    }
  }, [generateState, toast]);
  
  useEffect(() => {
    if (interviewState.error) {
      toast({ variant: 'destructive', title: 'Error', description: interviewState.error });
    }
  }, [interviewState.error, toast]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [interviewState.history]);


  const handleStartSession = () => {
    const topic = generateState.topic;
    if (!topic) return;
    
    // Initial dispatch to get the first question
    const formData = new FormData();
    formData.append('topic', topic);
    formData.append('history', '[]');
    interviewDispatch(formData);

    setView('session');
  };
  
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };


  return (
    <div className="grid gap-8">
      {view === 'generate' && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              AI Mock Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Select a topic to generate a list of potential questions, or start an interactive mock interview session.</p>
            <form action={generateDispatch} className="space-y-4">
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
                <GenerateButton />
              </div>
              {generateState.error && <p className="text-sm text-destructive">{generateState.error}</p>}
            </form>
          </CardContent>
        </Card>
      )}

      {view === 'list' && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Generated Questions for {generateState.topic}</CardTitle>
              <Button onClick={handleStartSession}>Start Interactive Session</Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <ul className="space-y-3">
                  {generateState.questions.map((q, index) => (
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
        </>
      )}

      {view === 'session' && (
        <Card className="flex h-[70vh] flex-col">
          <CardHeader>
            <CardTitle className="font-headline">
              Mock Interview: {generateState.topic}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="space-y-6 pr-4">
                {interviewState.history.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-4',
                      message.role === 'user' && 'justify-end'
                    )}
                  >
                    {message.role === 'model' && (
                       <Avatar>
                         <AvatarFallback><Bot /></AvatarFallback>
                       </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg p-3',
                        message.role === 'model'
                          ? 'bg-secondary'
                          : 'bg-primary text-primary-foreground'
                      )}
                    >
                      <p className="text-sm">{message.parts}</p>
                    </div>
                     {message.role === 'user' && (
                       <Avatar>
                          <AvatarFallback><User /></AvatarFallback>
                       </Avatar>
                    )}
                  </div>
                ))}
                 {useFormStatus().pending && interviewState.history.at(-1)?.role === 'user' && (
                    <div className="flex items-start gap-4">
                       <Avatar>
                         <AvatarFallback><Bot /></AvatarFallback>
                       </Avatar>
                       <div className="max-w-[80%] rounded-lg bg-secondary p-3">
                         <LoaderCircle className="animate-spin text-muted-foreground" />
                       </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <form action={interviewDispatch} className="flex w-full items-center gap-2" ref={formRef}>
              <input type="hidden" name="topic" value={generateState.topic} />
              <input
                type="hidden"
                name="history"
                value={JSON.stringify(interviewState.history)}
              />
              <Textarea
                name="userResponse"
                placeholder="Type your answer here..."
                className="min-h-0"
                rows={1}
                disabled={useFormStatus().pending}
                onKeyDown={handleTextareaKeyDown}
              />
              <InterviewSubmitButton />
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
