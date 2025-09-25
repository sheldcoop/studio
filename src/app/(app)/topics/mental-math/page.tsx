
'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, X, RefreshCw, Timer } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Problem = {
  question: string;
  answer: number;
};

type QuizState = 'not-started' | 'active' | 'finished';

const timeOptions = [
  { value: 60, label: '1 Minute' },
  { value: 120, label: '2 Minutes' },
  { value: 300, label: '5 Minutes' },
  { value: 600, label: '10 Minutes' },
];

const generateProblem = (): Problem => {
  const problemTypes = ['multiplication', 'division', 'decimal', 'fraction'];
  const type = problemTypes[Math.floor(Math.random() * problemTypes.length)];

  switch (type) {
    case 'division': {
      const divisor = Math.floor(Math.random() * 13) + 2; // 2-14
      const answer = Math.floor(Math.random() * 20) + 2; // 2-21
      const dividend = divisor * answer;
      return { question: `${dividend} ÷ ${divisor}`, answer };
    }
    case 'decimal': {
      const num1 = parseFloat((Math.random() * 10).toFixed(1));
      const num2 = parseFloat((Math.random() * 10).toFixed(1));
      const result = parseFloat((num1 + num2).toFixed(2));
      return { question: `${num1} + ${num2}`, answer: result };
    }
    case 'fraction': {
      const den1 = Math.floor(Math.random() * 5) + 2; // 2-6
      const den2 = Math.floor(Math.random() * 5) + 2;
      const num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
      const num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
      const answer = num1 / den1 + num2 / den2;
      return {
        question: `${num1}/${den1} + ${num2}/${den2}`,
        answer: parseFloat(answer.toFixed(3)),
      };
    }
    case 'multiplication':
    default: {
      const num1 = Math.floor(Math.random() * 19) + 2; // 2-20
      const num2 = Math.floor(Math.random() * 19) + 2; // 2-20
      return { question: `${num1} × ${num2}`, answer: num1 * num2 };
    }
  }
};

export default function MentalMathPage() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [problemsAnswered, setProblemsAnswered] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>('not-started');
  const [timeSelection, setTimeSelection] = useState(60);
  const [timeLeft, setTimeLeft] = useState(timeSelection);

  useEffect(() => {
    if (quizState === 'active' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && quizState === 'active') {
      setQuizState('finished');
    }
  }, [quizState, timeLeft]);

  const newProblem = useCallback(() => {
    setIsCorrect(null);
    setUserAnswer('');
    setProblem(generateProblem());
  }, []);

  useEffect(() => {
    if(quizState === 'active') {
      newProblem();
    }
  }, [quizState, newProblem]);

  const handleStart = () => {
    setTimeLeft(timeSelection);
    setScore(0);
    setProblemsAnswered(0);
    setQuizState('active');
  };
  
  const handleReset = () => {
    setQuizState('not-started');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer === '') return;

    const answerFloat = parseFloat(userAnswer);
    if (Math.abs(answerFloat - problem!.answer) < 0.01) {
      setIsCorrect(true);
      if(quizState === 'active') {
        setScore((s) => s + 1);
      }
    } else {
      setIsCorrect(false);
    }

    if(quizState === 'active') {
      setProblemsAnswered((p) => p + 1);
      setTimeout(() => newProblem(), 1200);
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <PageHeader
        title="Mental Math Practice"
        description="Sharpen your calculation speed for quant interviews."
      />
      <div className="flex justify-center">
        <Card className="w-full max-w-lg">
          {quizState === 'not-started' && (
             <CardContent className="p-6">
               <CardTitle className="font-headline mb-4 text-center">Choose Your Challenge</CardTitle>
               <RadioGroup value={String(timeSelection)} onValueChange={(val) => setTimeSelection(Number(val))} className="grid grid-cols-2 gap-4 mb-6">
                 {timeOptions.map(option => (
                   <div key={option.value}>
                     <RadioGroupItem value={String(option.value)} id={String(option.value)} className="peer sr-only"/>
                     <Label htmlFor={String(option.value)} className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                       {option.label}
                     </Label>
                   </div>
                 ))}
               </RadioGroup>
               <Button onClick={handleStart} className="w-full">Start Quiz</Button>
             </CardContent>
          )}

          {(quizState === 'active' || quizState === 'finished') && (
            <>
              <CardHeader>
                <div className="flex justify-between items-center">
                   <CardTitle className="font-headline text-center text-3xl tracking-tight">
                     {problem?.question}
                   </CardTitle>
                   <div className="flex items-center gap-2 font-medium text-lg">
                     <Timer className="text-primary"/>
                     <span>{formatTime(timeLeft)}</span>
                   </div>
                </div>
                <CardDescription className="text-center pt-2">
                  Round fractions and decimals to 3 decimal places if necessary.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Your Answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={isCorrect !== null || quizState === 'finished'}
                      className={cn(
                        'text-center text-lg h-12',
                        isCorrect === true && 'border-green-500 focus-visible:ring-green-500',
                        isCorrect === false && 'border-red-500 focus-visible:ring-red-500'
                      )}
                    />
                    {isCorrect === true && <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                    {isCorrect === false && <X className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />}
                  </div>
                  {isCorrect === false && (
                    <p className="text-center text-red-500 mt-2">
                      Correct Answer: {problem?.answer}
                    </p>
                  )}
                  <div className="flex justify-center mt-4">
                    {quizState === 'active' ? (
                      <Button type="submit" className="w-full" disabled={isCorrect !== null}>
                        Submit
                      </Button>
                    ) : (
                      <div className="text-center">
                          <p className="text-xl font-bold mb-4">Time's up!</p>
                          <Button onClick={handleReset} className="w-full">
                            Play Again
                            <RefreshCw className="ml-2 h-4 w-4" />
                          </Button>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <p>Score: <span className="font-bold text-foreground">{score}</span></p>
                <p>Answered: <span className="font-bold text-foreground">{problemsAnswered}</span></p>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

