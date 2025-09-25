'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const pageData = {
  title: 'Hypothesis Testing & P-Values',
  subtitle: 'Learn all about hypothesis testing and p-values',
  sections: [
    {
      section_id: 1,
      type: 'intro',
      title: 'The Core Idea: What is Hypothesis Testing?',
      content:
        "Think of hypothesis testing as being a data detective. You start with a default assumption, the 'Null Hypothesis' ('innocent until proven guilty'). Your job is to gather enough evidence to see if you can overturn that default in favor of your new theory, the 'Alternative Hypothesis'.",
    },
    {
      section_id: 2,
      type: 'comparison',
      title: 'The Big Decision: Which Path to Take?',
      content: {
        parametric: {
          title: 'Parametric Tests 👨‍🍳',
          analogy:
            "The Professional Chef's Kitchen: These tests are powerful and precise, but they assume your data is 'well-behaved' and follows a specific pattern, like the Normal Distribution (bell curve).",
          tests: [
            {
              name: 'T-Test',
              description: 'Compares the averages of two groups.',
            },
            {
              name: 'Z-Test',
              description:
                "Compares a sample's average to a known population average when variance is known.",
            },
            {
              name: 'ANOVA (Analysis of Variance)',
              description: 'Compares the averages of three or more groups.',
            },
            {
              name: 'Pearson Correlation',
              description:
                'Measures the strength and direction of a linear relationship between two variables.',
            },
            {
              name: 'F-Test',
              description:
                'Compares the variances (spread) of two or more groups.',
            },
          ],
        },
        non_parametric: {
          title: 'Non-Parametric Tests 🏕️',
          analogy:
            "The Campfire Cookout: These flexible tests make no assumptions about your data's shape. They are perfect for 'wild' data, small sample sizes, or ranked data.",
          tests: [
            {
              name: 'Mann-Whitney U Test',
              description:
                'Alternative to the T-Test for comparing two independent groups.',
            },
            {
              name: 'Kruskal-Wallis Test',
              description:
                'Alternative to ANOVA for comparing three or more groups.',
            },
            {
              name: 'Wilcoxon Signed-Rank Test',
              description:
                "Alternative to the paired T-Test for 'before and after' data from a single group.",
            },
            {
              name: "Spearman's Rank Correlation",
              description:
                'Measures the relationship between two variables based on their rank order.',
            },
            {
              name: 'Sign Test',
              description:
                'A simple test to check the direction of change between paired data points.',
            },
          ],
        },
      },
    },
    {
      section_id: 3,
      type: 'quiz',
      title: 'Knowledge Check: Which Test Should You Use?',
      questions: [
        {
          id: 1,
          question_text:
            'You want to compare the average battery life of two different smartphone brands. The data for both brands is normally distributed. Which test should you use?',
          options: ['ANOVA', 'T-Test', 'Kruskal-Wallis Test', 'Sign Test'],
          correct_answer: 'T-Test',
        },
        {
          id: 2,
          question_text:
            'A researcher wants to know if there is a difference in the median salaries across four different cities. The salary data is heavily skewed and not normal. Which test is most appropriate?',
          options: [
            'ANOVA',
            'F-Test',
            'Kruskal-Wallis Test',
            'Pearson Correlation',
          ],
          correct_answer: 'Kruskal-Wallis Test',
        },
        {
          id: 3,
          question_text:
            "You want to see if an employee's performance rating (ranked 1st, 2nd, 3rd...) is related to the number of training hours they completed. What is the best test?",
          options: [
            'Pearson Correlation',
            'Z-Test',
            "Spearman's Rank Correlation",
            'T-Test',
          ],
          correct_answer: "Spearman's Rank Correlation",
        },
        {
          id: 4,
          question_text:
            'To test if a new teaching method is effective, you measure the test scores of 10 students before and after the training. You want to see if the scores improved. Which non-parametric test is suitable for this paired data?',
          options: [
            'Mann-Whitney U Test',
            'Wilcoxon Signed-Rank Test',
            'Kruskal-Wallis Test',
            'F-Test',
          ],
          correct_answer: 'Wilcoxon Signed-Rank Test',
        },
        {
          id: 5,
          question_text:
            'A company wants to know if the average customer satisfaction score is different across its five main product lines. The data is normally distributed. What test should be used?',
          options: ['ANOVA', 'T-Test', 'Mann-Whitney U Test', 'Sign Test'],
          correct_answer: 'ANOVA',
        },
      ],
    },
  ],
};

const introSection = pageData.sections.find(sec => sec.type === 'intro');
const comparisonSection = pageData.sections.find(sec => sec.type === 'comparison');
const quizSection = pageData.sections.find(sec => sec.type === 'quiz');

type UserAnswers = { [key: number]: string };

const Quiz = () => {
  const questions = (quizSection as any).questions;
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleValueChange = (questionId: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(Object.keys(userAnswers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    let currentScore = 0;
    questions.forEach((q: any) => {
      if (userAnswers[q.id] === q.correct_answer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };
  
  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
  }

  const getResultIcon = (questionId: number) => {
    if(!submitted) return null;
    const question = questions.find((q:any) => q.id === questionId);
    if(userAnswers[questionId] === question.correct_answer) {
      return <CheckCircle className="text-green-500" />;
    } else {
      return <XCircle className="text-red-500" />;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{quizSection?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((q: any, index: number) => (
              <div key={q.id}>
                <p className="font-semibold mb-4">{index + 1}. {q.question_text}</p>
                <RadioGroup onValueChange={(value) => handleValueChange(q.id, value)}>
                  {q.options.map((option: string) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                      <Label htmlFor={`${q.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button type="submit" className="w-full">Submit Answers</Button>
          </form>
        ) : (
          <div className="text-center">
             <CardTitle className="font-headline mb-4">Quiz Results</CardTitle>
             <p className="text-4xl font-bold mb-2">{score} / {questions.length}</p>
             <p className="text-muted-foreground mb-6">You got {score} out of {questions.length} questions correct.</p>
            
            <div className="text-left space-y-6 mb-8">
                {questions.map((q:any) => (
                    <div key={q.id} className={cn("p-4 rounded-lg", userAnswers[q.id] === q.correct_answer ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20')}>
                        <p className="font-semibold mb-2 flex items-center gap-2">{getResultIcon(q.id)} {q.question_text}</p>
                        <p className="text-sm">Your answer: <span className={cn(userAnswers[q.id] === q.correct_answer ? 'text-green-600' : 'text-red-600' )}>{userAnswers[q.id]}</span></p>
                        {userAnswers[q.id] !== q.correct_answer && (
                            <p className="text-sm">Correct answer: <span className="text-green-600">{q.correct_answer}</span></p>
                        )}
                    </div>
                ))}
            </div>

            <Button onClick={handleReset}>
                <RefreshCw className="mr-2" />
                Retake Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function HypothesisTestingPage() {
  const comparisonData = (comparisonSection as any)?.content;
  
  return (
    <div>
      <PageHeader title={pageData.title} description={pageData.subtitle} />

      <section className="mb-12 max-w-4xl mx-auto">
        <h2 className="font-headline text-2xl mb-4">{introSection?.title}</h2>
        <p className="text-lg text-muted-foreground">{introSection?.content}</p>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-3xl mb-6 text-center">{comparisonSection?.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{comparisonData.parametric.title}</CardTitle>
              <CardDescription>{comparisonData.parametric.analogy}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {comparisonData.parametric.tests.map((test: any) => (
                  <li key={test.name}>
                    <p className="font-semibold">{test.name}</p>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{comparisonData.non_parametric.title}</CardTitle>
              <CardDescription>{comparisonData.non_parametric.analogy}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {comparisonData.non_parametric.tests.map((test: any) => (
                  <li key={test.name}>
                    <p className="font-semibold">{test.name}</p>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      <section className="max-w-4xl mx-auto">
        <Quiz />
      </section>
    </div>
  );
}

    